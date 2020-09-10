<template>
  <div>
    <el-row class="statistics-container">
      <el-col :span="24" class="statistics-header">
        <el-col :span="24" class="header-details">
          <span>{{generateReportLang('selectStores')}}</span>
          <el-select v-model="curCountry"  :placeholder="generateReportLang('country')" size="mini"
                     class="el-province" @change="changeCountry" @clear="clearCountry">
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
          <el-select v-model="curStoreTag" clearable :placeholder="$t('reportView.selectStoreTag')" size="mini"
             class="el-province" @change="changeStoreTag" :disabled="curProvince.length!=0">
                    <el-option
                    v-for="item in StoreTagList"
                    :key="item.tagId"
                    :label="item.tagName"
                    :value="item.tagId">
                    </el-option>
            </el-select>
          <region-multi-select :selected="curProvince" :placeholder="$t('reportView.regionI')" :options="provinceList" @changeInput="handleProChange"
                               style="display: inline" ref="proviceSelect" :disabled="curCountry.length==0||curStoreTag!=''" :all="$t('overview.allZoneI')"></region-multi-select>
          <region-multi-select :selected="curCity" :placeholder="$t('reportView.regionII')" :options="cityList" @changeInput="handleCityChange"
                               style="display: inline" ref="citySelect" :disabled="curProvince.length==0||curStoreTag!=''" :all="$t('overview.allZoneII')"></region-multi-select>

          <multi-select :selected="curStore" :placeholder="$t('reportView.stores')" :options="storeDataList" @changeInput="handleStoreChange"
                        style="display: inline" ref="multiSelect"></multi-select>

        </el-col>
        <el-col :span="24" class="header-details">
          <span :class="lang== 'en'? 'en-span-class' : ''">{{generateReportLang('time')}}</span>
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
            <el-button size="mini" :class="lang==='en'? 'en-search-btn':'search-btn' " @click="searchData" type="primary" :disabled="storeDataList.length==0">{{generateReportLang('search')}}</el-button>
            <el-button type="primary" size="mini" :class="lang==='en'? 'en-search-btn':'search-btn' " @click="handleDown()">
              <div class="btn-area">
                <i class="iconfont icon-pdf"></i>
                <span style="font-size: calc(14/1920*100vw);margin:0 0 0 10px;">{{generateReportLang('InspectionDetail')}}</span>
              </div>
            </el-button>
          </div>
        </el-col>
        <el-col :span="24" class="header-details1">
                <span class="choice-store">
                  <i class="iconfont icon-tishi1" @mouseover="showStoreInfo=true" @mouseleave="showStoreInfo=false"></i>
                  {{generateReportLang('selected')}}
                  <span class="storename-str" style="margin-left:20px;">{{storeStr}}</span>
                </span>
          <div class="store-selected" v-if="showStoreInfo">
            <h1>{{generateReportLang('selected')}}</h1>
            <ul class="store-list" v-show="storeStr.length > 0">
              <li v-for="(item,index) in storeStr.split('，')" :key="index" class="store-item" style="display: block; text-align: left">
                - {{item}}
              </li>
            </ul>
          </div>
        </el-col>
      </el-col>
      <div class="statistics-content">
        <el-col :span="24" class="region-chart">
          <el-col :span="24" class="region-header">
            <div class="region-titles">
              <span class="title">
              {{$t('overview.regionalAssessment')}}
            </span>
            </div>
          </el-col>
          <el-col :span="9" class="evalution-pct">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart :auto-resize='true' :options="regionsOptions" class="chart-content" ref="itemsPie"></v-chart>
              </div>
              <div class="pct-nums">
                <div class="content-labels" :class="lang=='en'? 'en-labels': ''" v-for="(item, index) in regionsPerArray"
                     :key="index">
                  <div class="excellent_nums">{{item.percent}}%</div>
                  <div class="excellent_labels">
                    <span class="labels excellent-label" :class="`label-` + index"></span>
                    <span class="label-desc">{{item.type}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="15" class="charts-content">
            <div class="title">
              <limit-select :selected="curRegion" :options="regionsList" @changeInput="handleRegionsChange" style="display: inline" ref="multiRegionsSelect"
                            :limit="2" :inputSize="'mini'"></limit-select>
            </div>
            <div class="region-result">
              <div class="region-content">
                <div class="region-result-panel">
                  <v-chart :options="regionsChartsOptions" class="result-content" :auto-resize='true' ref="storeChart" ></v-chart>
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <el-col :sapn="24" class="region-list">
          <el-col :span="24" class="region-header">
            <div class="region-titles">
            <span class="title">
              {{$t('overview.regionalList')}}
            </span>
              <div class="exprotBtn">
                  <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="export2Excel" >
                    <div class="btn-area">
                      <img :src="exportPng" class="icon-excel">
                      <span class="spanClass">{{$t('eventView.exportReport')}}</span>
                    </div>
                  </el-button>
              </div>
            </div>
          </el-col>
          <div class="el-table-panel">
            <el-table
              ref="eltable"
              :data="regionTableData"
              :highlight-current-row="true"
              empty-text='无数据'
              align='left'
              stripe
              @sort-change='regionSortChange'
              :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
              border
              style="width: 100%"
              :header-cell-class-name="headerClass"
              size="mini"
              :cell-class-name="cellClass"
              :row-class-name="rowClass"
            >
              <el-table-column v-for="(_item,_index) in regionInfoData" :key="_index"
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
                            @size-change="regionSizeChange"
                            @current-change="regionCurrentChange"
                            :current-page="pageRegion"
                            layout="jumper,total, prev, pager, next,sizes"
                            :page-size="sizeNumRegion" :total="totalRegion">
              </el-pagination>
            </div>
        </el-col>

        <el-col :sapn="24" class="store-list">
          <el-col :span="24" class="region-header">
            <div class="region-titles">
            <span class="title">
              {{$t('overview.storeList')}}
            </span>
              <div class="exprotBtn">
                  <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="exportStore2Excel" >
                    <div class="btn-area">
                      <img :src="exportPng" class="icon-excel">
                      <span class="spanClass">{{$t('eventView.exportReport')}}</span>
                    </div>
                  </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="el-table-panel">
              <el-table
                :data="storeTableData"
                :highlight-current-row="true"
                empty-text='无数据'
                align='left'
                stripe
                @sort-change='storeSortChange'
                :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
                border
                style="width: 100%"
                :header-cell-class-name="headerClass"
                size="mini"
                :cell-class-name="cellClass"
                :row-class-name="rowClass"
              >
                <el-table-column v-for="(_item,_index) in storeInfoData" :key="_index"
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
          </el-col>
            <div class="toolbar pagination clearfix">
              <el-pagination background small
                            :page-sizes="[10, 20, 50, 100]"
                            @size-change="storeSizeChange"
                            @current-change="storeCurrentChange"
                            :current-page="pageStore"
                            layout="jumper,total, prev, pager, next,sizes"
                            :page-size="sizeNumStore" :total="totalStore">
              </el-pagination>
            </div>
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
    </el-row>



    <el-row class="statistics-container" id="pdfDom" v-if="ispdf" style="padding:40px 20px;">
      
      <div class="statistics-content">
        <el-col :span="24" class="region-chart">
          <el-col :span="24" class="region-header">
            <div class="region-titles">
              <span class="title">
              {{$t('overview.regionalAssessment')}}
            </span>
            </div>
          </el-col>
          <el-col :span="9" class="evalution-pct">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart :auto-resize='true' :options="regionsOptions" class="chart-content" ref="itemsPie"></v-chart>
              </div>
              <div class="pct-nums">
                <div class="content-labels" :class="lang=='en'? 'en-labels': ''" v-for="(item, index) in regionsPerArray"
                     :key="index">
                  <div class="excellent_nums">{{item.percent}}%</div>
                  <div class="excellent_labels">
                    <span class="labels excellent-label" :class="`label-` + index"></span>
                    <span class="label-desc">{{item.type}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="15" class="charts-content">
            <div class="title">
              <limit-select :selected="curRegion" :options="regionsList" @changeInput="handleRegionsChange" style="display: inline" ref="multiRegionsSelect"
                            :limit="2" :inputSize="'mini'"></limit-select>
            </div>
            <div class="region-result">
              <div class="region-content">
                <div class="region-result-panel">
                  <v-chart :options="regionsChartsOptions" class="result-content" :auto-resize='true' ref="storeChart" ></v-chart>
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <el-col :sapn="24" class="region-list" style="padding-bottom:20px;">
          <el-col :span="24" class="region-header">
            <div class="region-titles">
            <span class="title">
              {{$t('overview.regionalList')}}
            </span>
              
            </div>
          </el-col>
          <div class="el-table-panel">
            <el-table
              ref="eltable"
              :data="regionPDFData"
              :highlight-current-row="true"
              empty-text='无数据'
              align='left'
              stripe
              @sort-change='regionSortChange'
              :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
              border
              style="width: 100%"
              :header-cell-class-name="headerClass"
              size="mini"
              :cell-class-name="cellClass"
              :row-class-name="rowClass"
            >
              <el-table-column v-for="(_item,_index) in regionInfoData" :key="_index"
                               :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="lang!=='en'? _item.pdfwidth : _item.pdfmaxWidth">
              </el-table-column>
              <div slot="empty">
                <div>
                  <i class="iconfont icon-zhengque empty-data-icon"></i>
                  <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{$t('overview.noData')}}</span>
                </div>
              </div>
            </el-table>
          </div>
          
        </el-col>

        <el-col :sapn="24" class="store-list" style="padding-bottom:20px;">
          <el-col :span="24" class="region-header">
            <div class="region-titles">
            <span class="title">
              {{$t('overview.storeList')}}
            </span>
              
            </div>
          </el-col>
          <el-col :span="24">
            <div class="el-table-panel">
              <el-table
                :data="storePDFData"
                :highlight-current-row="true"
                empty-text='无数据'
                align='left'
                stripe
                @sort-change='storeSortChange'
                :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
                border
                style="width: 100%"
                :header-cell-class-name="headerClass"
                size="mini"
                :cell-class-name="cellClass"
                :row-class-name="rowClass"
              >
                <el-table-column v-for="(_item,_index) in storeInfoData" :key="_index"
                                 :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="lang!=='en'? _item.pdfwidth : _item.pdfmaxWidth">
                </el-table-column>
                <div slot="empty">
                  <div>
                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                    <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{$t('overview.noData')}}</span>
                  </div>
                </div>
              </el-table>
            </div>
          </el-col>
          
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
  import {generateReportLang} from '@/api/i18n'
  import {getStoreList,getBriefStoreList,GetTagList} from '@/api/store'
  import {mapGetters} from 'vuex'
  import MultiSelect from '@/components/MultiSelect'
  import RegionMultiSelect from '@/components/RegionMultiSelect'
  import LimitSelect from '@/components/LimitSelect'
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
  import {Message} from 'element-ui'
  import util from '../../common/util.js'
  import {
    getInspectStatsOverRegion,
    getInspectStatsOverviewWithRegionV2
  } from '@/api/inspectOverview'

  export default {
    name:'PatrolEvaluationSta',
    components: {
      MultiSelect,
      'v-chart': ECharts,
      RegionMultiSelect,
      LimitSelect
    },
    data(){
      return {
        htmlTitle:this.$t("overview.htmltopdfA"),
        isexportPDF:false,
        curCountry:'',
        curStoreTag:'',
        StoreTagList:[],
        countryList:[],
        curProvince:[],
        provinceList:[],
        curCity:[],
        cityList:[],
        curStore:[],
        storeList:[],
        storeStr: '',
        curRegion: [],
        dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
        dateOpt: {
          disabledDate: (time) => {
            return time.getTime() > this.$moment(new Date).endOf('d').toDate();
          }
        },
        timeMode: 1,
        regionsList:[],
        params: {},
        daysRangeList: [],
        toolTipClass: 'page-login-toolTipClass',
        tooltipClass: 'tooltip-class',
        lang: this.$i18n.locale,
        showStoreInfo: false,
        poperClass: 'date-picker-poper',
        storeDataList: [],
        exportPng: require('../../../static/img/icon_excel.png'),
        regionsOptions: null,
        regionsPerArray: [],
        resultLegend: [
          {
            'type': this.$t("overview.danger"),
            'percent': '0%',
          },
          // {
          //   'type': this.$t("overview.improve"),
          //   'percent': '0%',
          // },
          {
            'type': this.$t("overview.echartGood"),
            'percent': '0%',
          },
          {
            'type': this.$t("overview.excellent"),
            'percent': '0%',
          }
        ],
        regionsChartsOptions: null,
        regionInfoData:[
          {
            "prop": "region",
            "label": this.$t('overview.regionName'),
            "sortable": false,
            "pdfwidth": '22%',
            "pdfmaxWidth": '22%',
            "width": '284',
            "maxWidth": '284'
          },
          {
            "prop":"cycleOfInspect",
            "label": this.$t('overview.advPatrolCycle'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '14%',
            "width": '160',
            "maxWidth": '180'
          },
          {
            "prop":"numOfReport",
            "label": this.$t('overview.numOfEvaluations'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '12%',
            "width": '160',
            "maxWidth": '160'
          },
          // {
          //   "prop": "numOfExcellent",
          //   "label": this.$t('overview.excellent'),
          //   "sortable":'custom',
          //   "width": '160',
          //   "maxWidth": '160'
          // },
          {
            "prop":"numOfQualified",
            "label": this.$t('overview.echartGood'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '12%',
            "width": '160',
            "maxWidth": '160'
          },
          // {
          //   "prop":"numOfImproved",
          //   "label": this.$t('overview.improve'),
          //   "sortable":'custom',
          //   "pdfwidth": '12%',
          //   "pdfmaxWidth": '12%',
          //   "width": '160',
          //   "maxWidth": '160'
          // },
          {
            "prop":"numOfDangerous",
            "label": this.$t('overview.danger'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '12%',
            "width": '160',
            "maxWidth": '160'
          },
          {
            "prop":"qualifiedRatePer",
            "label": this.$t('overview.passRate'),
            "sortable":'custom',
            "pdfwidth": '16%',
            "pdfmaxWidth": '14%',
            "width": '217',
            "maxWidth": '180'
          },
          {
            "prop":"averageScore",
            "label": this.$t('overview.averageScore'),
            "sortable":'custom',
            "pdfwidth": '16%',
            "pdfmaxWidth": '14%',
            "width": '217',
            "maxWidth": '180'
          }
        ],
        regionTableData: [],
        regionPDFData:[],
        totalRegion:0,
        pageRegion:1,
        sizeNumRegion:10,
        storeInfoData:[
          {
            "prop": "region",
            "label": this.$t('overview.storeName'),
            "sortable":false,
            "pdfwidth": '22%',
            "pdfmaxWidth": '22%',
            "width": '284',
            "maxWidth": '284'
          },
          {
            "prop":"cycleOfInspect",
            "label": this.$t('overview.advPatrolCycle'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '14%',
            "width": '160',
            "maxWidth": '180'
          },
          {
            "prop":"numOfReport",
            "label": this.$t('overview.numOfEvaluations'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '12%',
            "width": '160',
            "maxWidth": '160'
          },
          // {
          //   "prop": "numOfExcellent",
          //   "label": this.$t('overview.excellent'),
          //   "sortable":'custom',
          //   "width": '160',
          //   "maxWidth": '160'
          // },
          {
            "prop":"numOfQualified",
            "label": this.$t('overview.echartGood'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '12%',
            "width": '160',
            "maxWidth": '160'
          },
          // {
          //   "prop":"numOfImproved",
          //   "label": this.$t('overview.improve'),
          //   "sortable":'custom',
          //   "pdfwidth": '12%',
          //   "pdfmaxWidth": '12%',
          //   "width": '160',
          //   "maxWidth": '160'
          // },
          {
            "prop":"numOfDangerous",
            "label": this.$t('overview.danger'),
            "sortable":'custom',
            "pdfwidth": '12%',
            "pdfmaxWidth": '12%',
            "width": '160',
            "maxWidth": '160'
          },
          {
            "prop":"qualifiedRatePer",
            "label": this.$t('overview.passRate'),
            "sortable":'custom',
            "pdfwidth": '16%',
            "pdfmaxWidth": '14%',
            "width": '219',
            "maxWidth": '180'
          },
          {
            "prop":"averageScore",
            "label": this.$t('overview.averageScore'),
            "sortable":'custom',
            "pdfwidth": '16%',
            "pdfmaxWidth": '14%',
            "width": '217',
            "maxWidth": '180'
          }
        ],
        storeTableData: [],
        storePDFData:[],
        totalStore:0,
        pageStore:1,
        sizeNumStore:10,
        curRegionArray: [],
        exportDataHeader:['门店名称','平均巡店周期','评估次数','合格', '立即督导','合格率','平均分'], //需要导出数据的表头
        exportRegionHeader:['区域名称','平均巡店周期','评估次数','合格', '立即督导','合格率','平均分'], //需要导出数据的表头
        regionParams: {},
        chartParams:{},
        chartArrayData: [],
        echartBackground: 'rgba(30,34,52,0.75)',
        echartColor: '#7d8cab',
        regionDataList: [],
        echartAxiasColor: '#e3e9f4',
        headerClass: 'header-class',
        cellClass: 'cell-class',
        rowClass: 'row-class',
        regionFilter: {"page": 0 , "size": 10},
        regionOrder: {"direction":"asc", "property": 'qualifiedRate'},
        storeFilter: {"page": 0 , "size": 10},
        storeOrder: {"direction":"asc", "property": 'qualifiedRate'},
        sidebarElm: null,
        fontFamily: 'Roboto, Microsoft YaHei',
        ispdf:false
      }
    },
    computed:{
      ...mapGetters({accountChanged:'accountChanged'})
    },
    watch: {
      async accountChanged(val, oldVal) {
        console.log(val);
        let self = this;
        if (val != 0) {
          let self = this;
          self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date).endOf('d').toDate()];
          let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
          let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
          self.params.beginTs = start;
          self.params.endTs = end;
          self.initDaysRange();
          // await self.getRegionInfo();
          // await self.getCountryStore()
          await self.initData();
          self.curStoreTag=''
        }
      }
    },
    methods:{
      generateReportLang,
      handleDown(){
        let self = this
        self.ispdf=true
        require.ensure([], async() => {
          // 区域表
          if(self.totalRegion>0){
            let size= self.totalRegion;
            let params = {};
            params.beginTs = self.params.beginTs;
            params.endTs = self.params.endTs;
            params.filter = {"page": 0, "size": size};
            params.order = self.regionOrder;
            let region = 1;
            if(self.curCity.length > 0){
              region = 2;
            }
            else{
              region = 1;
            }
            params.regionMode = region;
            params.storeIds = self.params.storeIds;
            let regionResult = await self.getInspectStatsOverviewWithRegion(params);
            if (regionResult.errCode == 0) {
              let result = regionResult.data;
              if (result) {
                result.content.forEach(item=>{
                  item.qualifiedRatePer = item.qualifiedRate + '%'
                })
                self.regionPDFData= result.content;
              }
            }
          }
          // 门店表
          if(self.totalStore>0){
            let storesize= self.totalStore;
            let storeparams = {};
            storeparams.beginTs = self.params.beginTs;
            storeparams.endTs = self.params.endTs;
            storeparams.regionMode = 3;
            storeparams.storeIds = self.params.storeIds;
            storeparams.filter = {
              "page": 0,
              "size": storesize
            };
            storeparams.order = self.storeOrder;

            let storeResult = await self.getInspectStatsOverviewWithRegion(storeparams);
            if (storeResult.errCode == 0) {
              let result = storeResult.data;
              if (result) {
                result.content.forEach(item=>{
                  item.qualifiedRatePer = item.qualifiedRate + '%'
                })
                self.storePDFData = result.content
              }
            }
          }
        })
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
      regionSortChange(col){
        let self=this;
        let column = col.column;
        let order = col.order;
        let prop  = '';
        let tempOrder = '';
        if(order=="ascending"){
          self.regionOrder={
            "direction":"asc",
            "property": col.column.property == 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
          }
          prop = col.column.property;
          tempOrder =  "asc";
        }
        else if(order=="descending"){
          self.regionOrder={
            "direction":"desc",
            "property": col.column.property == 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
          }
          prop = col.column.property;
          tempOrder =  "desc";
        }
        else{
          self.regionOrder={"direction":"asc", "property": 'qualifiedRate'};
        }
        self.regionFilter={
          page:self.pageRegion-1,
          size:self.sizeNumRegion
        }
        self.getInspectStatsOverviewOfRegionTable();
      },
      regionSizeChange(val){
        let self=this;
        self.sizeNumRegion=val;
        //self.page=1;
        self.pageRegion = 1;
        self.regionFilter ={page:self.pageRegion-1,size:val};
        self.getInspectStatsOverviewOfRegionTable();
      },
      regionCurrentChange(val){
        let self=this;
        self.pageRegion = val;
        self.regionFilter ={page:val-1,size:self.sizeNumRegion};
        self.getInspectStatsOverviewOfRegionTable();
      },
      storeSortChange(col){
        let self=this;
        let column = col.column;
        let order = col.order;
        let prop  = '';
        let tempOrder = '';
        if(order=="ascending"){
          self.storeOrder={
            "direction":"asc",
            "property": col.column.property == 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
          }
          prop = col.column.property;
          tempOrder =  "asc";
        }
        else if(order=="descending"){
          self.storeOrder={
            "direction":"desc",
            "property": col.column.property == 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
          }
          prop = col.column.property;
          tempOrder =  "desc";
        }
        else{
          self.storeOrder={"direction":"asc", "property": 'qualifiedRate'};
        }
        self.storeFilter={
          page:self.pageStore-1,
          size:self.sizeNumStore
        }
        self.getInspectStatsOverviewOfStore();
      },
      storeSizeChange(val){
        let self=this;
        self.sizeNumStore=val;
        //self.page=1;
        self.pageStore = 1;
        self.storeFilter ={page:self.pageStore-1,size:val};
        self.getInspectStatsOverviewOfStore();
      },
      storeCurrentChange(val){
        let self=this;
        self.pageStore = val;
        self.storeFilter={page:val-1,size:self.sizeNumStore};
        self.getInspectStatsOverviewOfStore();
      },
      dateChange(val) {
        let self = this;
        self.currentIndex = 0;
        let start = typeof(val[0]) === 'object' ? val[0].getTime() : val[0];
        let end = typeof(val[1]) === 'object' ? val[1].getTime() : val[1];
        let daysDiff = self.$moment(end).diff(start, 'days');
        if (daysDiff < 6) {  //当前选择的时间范围不到7天
          self.$message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
          })
          start = end - 3600 * 24 * 6 * 1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        if (daysDiff > 364) {  //当前选择的时间范围超过365天
          self.$message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
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
          self.daysRangeList = weekList;

        }
        else if (self.timeMode == 2) {
          let monthArray = util.getMonthBetween(startDay, endDay)
          self.daysRangeList = monthArray;
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
          //temp.push({label:self.$t('reportView.country'), value:''})
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
      async getCountryStore(){
          let self=this;
          let data=await self.getBriefStoreData();
          let temp=[]
          if(data.errCode==0&&data.errMsg=='Success'){
              self.storeList=data.data;
              if(self.storeList.length!=0){
                  self.storeList.forEach(item=>{
                      let country=item.country;
                      if(temp.map(x=>x.label).indexOf(country)==-1){
                          let obj={
                              value:country,
                              label:country
                          }
                          temp.push(obj);
                      }
                  })
              }
              let countryList=temp;
              self.countryList[0] = {}
              self.countryList[0].label= self.$t('reportView.country');
              self.countryList[0].countryList = countryList
              self.curCountry = countryList[0].label;
              self.selectAllProAndCity(self.curCountry);
          }
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
        self.searchData()
        self.changeStore(self.curStore)
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
      getBriefStoreData(){
          let self=this;
          return new Promise((resolve,reject)=>{
              getBriefStoreList().then(res=>{
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
      getTagListData(){
          let self=this;
          return new Promise((resolve,reject)=>{
              GetTagList().then(res=>{
                  let errMsg=res.errMsg;
                  if(errMsg!=undefined&&errMsg=='Success'){
                      self.StoreTagList=res.data;
                      resolve(res);
                  }
              }).catch(res => {
                  resolve(res);
              })
          })
      },
      changeStoreTag(val){
        let self=this
        let temp=[]
        self.clearStoreInfo();
        self.storeList.forEach(item=>{
            item.tagIds.forEach(_item=>{
                if(_item==val&&self.curCountry==item.country){
                    let obj={
                        storeId:item.storeId,
                        label:item.name,
                        value:item.name,
                        userId:item.userId,
                        userName:item.userName
                    };
                    temp.push(obj);
                }
            })
        })
        self.storeDataList=temp
      },
      changeCountry(val){
        let self=this;
        self.curProvince= [];
        self.curCity=[];
        self.curStoreTag=''
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
      clearCountry(){
        let self=this;
        self.curProvince= [];
        self.curCity=[];
        self.clearStoreInfo();

        let storeList=self.storeList;
        let tempStore=[];
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
        self.storeDataList=tempStore;

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
      cleaPro(){
        let self=this;
        self.curCity=[];
        self.clearStoreInfo();

        let storeList=self.storeList;
        let temp=[];
        let tempStore=[];
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
      clearCity(){
        let self=this;
        self.clearStoreInfo();

        let storeList=self.storeList;
        let tempStore=[];
        storeList.forEach(item=>{
          if(item.province==self.curProvince){
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
        self.storeDataList=tempStore;
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
      clearStoreInfo(){
        let self=this;
        self.curStore=[];
        self.storeStr='';
        self.$refs.multiSelect.selectedArray = [];
        self.$refs.multiSelect.input=''
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },
      searchData(){
        let self=this;
        // if(self.curProvince.length == 0 ){
        //   self.notify(self.$t('storeView.selectProviceInfo'), 'warning', 3000)
        //   return false;
        // }
        let storeIds = [];
        if(self.curStore.length == 0 ){
          self.storeDataList.forEach(item=>{
            storeIds.push(item.storeId)
          })
          self.curStore = storeIds.concat()
          self.changeStore(storeIds)
        }
        else if(self.curStore.includes("-1")){
          self.storeDataList.forEach(item=>{
            storeIds.push(item.storeId)
          })
        }
        else{
          storeIds = self.curStore;
        }
        self.params.storeIds = storeIds;

        self.getInspectStatsOverviewOfRegion();
        self.getInspectStatsOverviewOfStore();
        self.getInspectStatsLine();
      },
      async export2Excel() {
        let that = this;
        if(that.regionTableData.length==0){
          that.$message({
            message: that.$t('overview.emptyRegionList'),
            type:'warning',
          })
          return false;
        }
        require.ensure([], async() => {
          const { export_json_to_excel } = require('@/excel/Export2Excel');
          const tHeader = that.exportRegionHeader; // 导出的表头名
          const filterVal = ['region','cycleOfInspect','numOfReport','numOfQualified','numOfDangerous','qualifiedRatePer','averageScore']; // 导出的表头字段名
          let self=this;
          let size= self.totalRegion;
          let params = {};
          params.beginTs = self.params.beginTs;
          params.endTs = self.params.endTs;
          params.filter = {"page": 0, "size": size};
          params.order = self.regionOrder;
          let region = 1;
          if(self.curCity.length > 0){
            region = 2;
          }
          else{
            region = 1;
          }
          params.regionMode = region;
          params.storeIds = self.params.storeIds;
          let regionResult = await that.getInspectStatsOverviewWithRegion(params);
          let curData = [];
          if (regionResult.errCode == 0) {
            let result = regionResult.data;
            if (result) {
              result.content.forEach(item=>{
                item.qualifiedRatePer = item.qualifiedRate + '%'
              })
              curData= result.content;
            }
          }

          const data = that.formatJson(filterVal, curData);
          let fileName = 'Area'+'-'+util.getCurDateStr();
          export_json_to_excel(tHeader, data, fileName);// 导出的表格名称，根据需要自己命名
        })
      },
      async exportStore2Excel(){
        let that = this;
        if(that.storeTableData.length==0){
          that.$message({
            message: that.$t('overview.emptyStoreList'),
            type:'warning',
          })
          return false;
        }
        require.ensure([], async() => {
          const { export_json_to_excel } = require('@/excel/Export2Excel');
          const tHeader = that.exportDataHeader; // 导出的表头名
          const filterVal = ['region','cycleOfInspect','numOfReport','numOfQualified','numOfDangerous','qualifiedRatePer','averageScore']; // 导出的表头字段名
          let self=this;
          let size= self.totalStore;
          let params = {};
          params.beginTs = self.params.beginTs;
          params.endTs = self.params.endTs;
          params.regionMode = 3;
          params.storeIds = self.params.storeIds;
          params.filter = {
            "page": 0,
            "size": size
          };
          params.order = self.storeOrder;

          let storeResult = await that.getInspectStatsOverviewWithRegion(params);
          let curData = [];
          if (storeResult.errCode == 0) {
            let result = storeResult.data;
            if (result) {
              result.content.forEach(item=>{
                item.qualifiedRatePer = item.qualifiedRate + '%'
              })
              curData = result.content
            }
          }
          const data = that.formatJson(filterVal, curData);
          let fileName = 'Store'+'-'+util.getCurDateStr();
          export_json_to_excel(tHeader, data, fileName);// 导出的表格名称，根据需要自己命名
        })
      },
      async getExportData(){
        let self=this;
        let size= self.totalStore;
        self.params.filter={
          "page": 0,
          "size": size
        };
        self.params.regionMode = 3;
        self.getInspectStatsOverviewWithRegion(self.params);
        return new Promise((resolve,reject)=>{
          eventRESTful.getEventList(self.params).then((res)=>{
            let data=res.data.content;
            let temp=[];
            data.forEach(item=>{
              let obj={};
              obj.subject=item.subject;
              obj.storeName=item.storeName;
              obj.assignerName=item.assignerName;
              obj.ts=util.getDateTime(item.ts);
              temp.push(obj);
            })
            resolve(temp);
          }).catch(err=>{
            console.log("Error:"+err);
          });
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      getInspectStatsOverviewWithRegion(params){
        return new Promise((resolve, reject) => {
          getInspectStatsOverviewWithRegionV2(params).then(res => {
            resolve(res)
          })
        })
      },
      getInspectResultOverRegion(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsOverRegion(params).then(res => {
            resolve(res)
          })
        })
      },
      async getInspectStatsLine(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        let region = 1;
        if(self.curCity.length > 0){
          region = 2;
        }
        else{
          region = 1;
        }
        params.region = region;
        params.timeMode = self.timeMode;
        let regionResult = await self.getInspectResultOverRegion(params);
        let option = {
          color: ['#f31d65', '#6097f4'],
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
            top:'40',//距上边距
            left:'25',//距离左边距
            right:'5',//距离右边距
            bottom:'32',//距离下边距
          },
          textStyle:{
            fontFamily: self.fontFamily
          },
          tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'cross' ,     // 默认为直线，可选为：'line' | 'shadow'
              label: {
                show: false
              }
            },
            padding: 5,
            textStyle:{
              align:'left',
            },
            backgroundColor: self.echartBackground,
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
            },
            data: self.daysRangeList
          },
          yAxis: [
            {
            type: 'value',
            name: self.$t('overview.passRate') + '(%)',
            // interval: 20,
            minInterval: 10,
            max: 100,
            nameLocation: 'end',
              nameTextStyle:{
                align: 'left',
                padding: [0, 10]
              },

            splitLine:{
              show:true,
              lineStyle:{
                color: self.echartAxiasColor,
                width: 1,
              }
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              onZero: false,
              show: true,
              lineStyle: {
                color: 'self.echartAxiasColor'
              }
            },
            axisLabel:{
              show: true,
              fontStyle: 12,
              margin: 10,
              color: '#7d8cab'
            }
          },
            {
              type : 'value',
              max: 100,
              position: 'right',
              axisLabel : {
                show : false,
                interval : 'auto',
              },
              splitNumber : 20,
              axisTick: {
                show: false,
              },
              splitLine : {
                show : false,
              },
              axisLine: {
                onZero: false,
                show: true,
                lineStyle: {
                  color: 'self.echartAxiasColor'
                }
              },
            }
          ],
          series: [
            {
              type: 'line',
              symbol: 'none',
              yAxisIndex : 0,//使用第一个y轴
              smooth: true,
              name: '',
              data: []
            },
            {
              type: 'line',
              symbol: 'none',
              yAxisIndex : 1,//使用第二个y轴
              smooth: true,
              name: '',
              data: []
            },
          ]
        };
        if(regionResult.errCode == 0){
          let result = regionResult.data;
          let soureceList = [];
          let sortedProviceOrCity = [];
          sortedProviceOrCity = region == 1 ?  JSON.parse(JSON.stringify(self.curProvince)) : JSON.parse(JSON.stringify(self.curCity))
          let filterResult = self.jsonArrayHasSpecifiedValue(sortedProviceOrCity, result);
          self.regionDataList = filterResult; //过滤出已选择区域的记录
          let regionArray = [];
          filterResult[0].regions.forEach(item=>{
            let json = {};
            json.label = item.region;
            json.value = item.region;
            json.disabled = false;
            regionArray.push(json)
          })
          self.regionsList = regionArray;
          self.curRegion = [];
          self.regionsList.length > 0 ? self.curRegion.push(self.regionsList[0].value) : self.curRegion;
          self.regionsList.length > 1 ? self.curRegion.push(self.regionsList[1].value): self.curRegion;
          //过滤出前两条记录
          let filterTwoResult = self.jsonArrayHasSpecifiedValue(self.curRegion, filterResult);

          let regionData1 = [];
          let regionData2 = [];
          filterTwoResult.forEach((item, index)=>{
            let filterRegions = item.regions;
            filterRegions.forEach((_item, _index)=>{
              let sumOfReports = 0;
              let sunOfExcellent = 0;
              let sumOfQualified = 0;
              let percentRegion = 0;
              sunOfExcellent += _item.numOfExcellent
              sumOfQualified += _item.numOfQualified;
              sumOfReports += + _item.numOfQualified + _item.numOfDangerous;
              if(sumOfReports == 0){
                percentRegion = 0;
              }
              else{
                let percent = (sunOfExcellent+sumOfQualified) /sumOfReports * 100
                percentRegion = percent.toFixed(2);
              }
              if(_index == 0){
                regionData1.push(percentRegion);
                option.series[0].name = _item.region;
              }
              else{
                regionData2.push(percentRegion)
                option.series[1].name = _item.region;
              }
            })

          })
          option.series[0].data = regionData1;
          option.series[1].data = regionData2;
        }
        self.regionsChartsOptions = option;
      },
      jsonArrayHasSpecifiedValue(specifiedValue, jsonArray)
      {
        let tempData = [];
        jsonArray.forEach(item => {
          let tempJson = {};
          tempJson.ts = item.ts;
          let tempRegions = [];
          let regions = item.regions;
          regions.sort((item1, item2) => {
            return item1.region < item2.region ? 1 : -1;
          })
          specifiedValue.forEach(_item=>{
            regions.forEach(regionItem=>{
              if(regionItem.region == _item){
                tempRegions.push(regionItem);
              }
            })
          })
          tempJson.regions = tempRegions;
          tempData.push(tempJson);
        })
        return tempData;
      },
      async getInspectStatsOverviewOfRegion(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        let region = 1;
        if(self.curCity.length > 0){
          region = 2;
        }
        else{
          region = 1;
        }
        params.regionMode = region;
        params.storeIds = self.params.storeIds;
        let storeResult = await self.getInspectStatsOverviewWithRegion(params);
        if (storeResult.errCode == 0) {
          let result = storeResult.data;
          if (result) {
            self.totalRegion = result.totalElements;
            result.content.forEach(item=>{
              item.qualifiedRatePer = item.qualifiedRate + '%'
            })
            self.regionTableData = result.content;
          }
        }
        else {
          self.notify(self.$t('overview.queryFail'), 'warning', 3000);
          self.totalRegion = 0;
          self.regionTableData = []
        }
        self.getRegionPie();
      },

      async getInspectStatsOverviewOfRegionTable(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.filter = self.regionFilter;
        params.order = self.regionOrder;
        let region = 1;
        if(self.curCity.length > 0){
          region = 2;
        }
        else{
          region = 1;
        }
        params.regionMode = region;
        params.storeIds = self.params.storeIds;
        let storeResult = await self.getInspectStatsOverviewWithRegion(params);
        if (storeResult.errCode == 0) {
          let result = storeResult.data;
          if (result) {
            result.content.forEach(item=>{
              item.qualifiedRatePer = item.qualifiedRate + '%'
            })
            self.regionTableData = result.content;
          }
        }
        else {
          self.notify(self.$t('overview.queryFail'), 'warning', 3000);
          self.totalRegion = 0;
          self.regionTableData = []
        }
      },

      async getInspectStatsOverviewOfStore(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.regionMode = 3;
        params.storeIds = self.params.storeIds;
        params.filter = self.storeFilter;
        params.order = self.storeOrder;
        let storeResult = await self.getInspectStatsOverviewWithRegion(params);
        if (storeResult.errCode == 0) {
          let result = storeResult.data;
          if (result) {
            self.totalStore = result.totalElements;
            result.content.forEach(item=>{
              item.qualifiedRatePer = item.qualifiedRate + '%'
            })
            self.storeTableData = result.content;
          }
        }
        else {
          self.notify(self.$t('overview.queryFail'), 'warning', 3000);
          self.totalStore = 0;
        }
      },
      async getRegionPie(){
        let self = this;
        let totalDargerous = 0;
        let totalImproved = 0;
        let totalQualified = 0;
        // let totalExcellent = 0;
        let totalReport = 0;
        let jsonArray = self.resultLegend.slice(0,2);
        let seriesData = [];
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        let region = 1;
        if(self.curCity.length > 0){
          region = 2;
        }
        else{
          region = 1;
        }
        params.regionMode = region;

        params.storeIds = self.params.storeIds;
        //params.storeIds = self.params.storeIds;
        if(self.totalRegion > 0){
          params.filter = {page: 0, size: self.totalRegion};
          let storeResult = await self.getInspectStatsOverviewWithRegion(params);
          if (storeResult.errCode == 0) {
            let result = storeResult.data;
            if (result) {
              result.content.forEach(item=>{
                totalDargerous += item.numOfDangerous;
                // totalImproved += item.numOfImproved;
                totalQualified += item.numOfQualified;
                // totalExcellent += item.numOfExcellent;
                totalReport += item.numOfReport;
              })
            }
            seriesData = [
              {value: totalDargerous, name: self.$t('overview.danger')},
              // {value: totalImproved, name: self.$t('overview.improve')},
              {value: totalQualified, name: self.$t('overview.echartGood')},
              // {value: totalExcellent, name: self.$t('overview.excellent')}
            ];
            let totalArray = [totalDargerous, totalQualified];
            jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
            jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
            // jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
            // jsonArray[3].percent = util.getPercentValue(totalArray, 3, 2);
          }
          else {
            self.notify(self.$t('overview.queryFail'), 'warning', 3000);
            let totalArray = [0, 0, 0, 0];
            jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
            jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
            // jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
            // jsonArray[3].percent = util.getPercentValue(totalArray, 3, 2);
          }
        }
        else {
          let totalArray = [0, 0, 0, 0];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          // jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
          // jsonArray[3].percent = util.getPercentValue(totalArray, 3, 2);
        }
        self.regionsOptions = {
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
                    var colorList = ['#f31d65', '#72a1f3'];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        self.regionsPerArray = jsonArray
      },
      handleRegionsChange(val){
        let self = this;
        self.curRegion = val;
        let option = {
          color: ['#f31d65', '#6097f4'],
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
            top:'40',//距上边距
            left:'8',//距离左边距
            right:'5',//距离右边距
            bottom:'32',//距离下边距
          },
          tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'cross' ,     // 默认为直线，可选为：'line' | 'shadow'
              label: {
                show: false
              }
            },
            padding: 5,
            textStyle:{
              align:'left',
            },
            backgroundColor: self.echartBackground,
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
            },
            data: self.daysRangeList
          },
          yAxis: [
            {
              type: 'value',
              name: '合格率(%)',
              // interval: 20,
              minInterval: 10,
              max: 100,
              nameLocation: 'end',
              nameTextStyle:{
                align: 'left',
                padding: [0, 10]
              },

              splitLine:{
                show:true,
                lineStyle:{
                  color: self.echartAxiasColor,
                  width: 1,
                }
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                onZero: false,
                show: true,
                lineStyle: {
                  color: 'self.echartAxiasColor'
                }
              },
              axisLabel:{
                show: true,
                fontStyle: 12,
                margin: 10,
                color: '#7d8cab'
              }
            },
            {
              type : 'value',
              max: 100,
              position: 'right',
              axisLabel : {
                show : false,
                interval : 'auto',
              },
              splitNumber : 20,
              axisTick: {
                show: false,
              },
              splitLine : {
                show : false,
              },
              axisLine: {
                onZero: false,
                show: true,
                lineStyle: {
                  color: 'self.echartAxiasColor'
                }
              },
            }
          ],
          series: [
            {
              type: 'line',
              symbol: 'none',
              yAxisIndex : 0,//使用第一个y轴
              smooth: true,
              name: '',
              data: []
            },
            {
              type: 'line',
              symbol: 'none',
              yAxisIndex : 1,//使用第二个y轴
              smooth: true,
              name: '',
              data: []
            },
          ]
        };
        //过滤出对应区域记录
        let filterResult = self.jsonArrayHasSpecifiedValue(self.curRegion, self.regionDataList);

        let regionData1 = [];
        let regionData2 = [];
        filterResult.forEach((item, index)=>{
          let filterRegions = item.regions;
          filterRegions.forEach((_item, _index)=>{
            let sumOfReports = 0;
            let sunOfExcellent = 0;
            let sumOfQualified = 0;
            let percentRegion = 0;
            sunOfExcellent += _item.numOfExcellent
            sumOfQualified += _item.numOfQualified;
            sumOfReports += _item.numOfQualified + _item.numOfDangerous;
            if(sumOfReports == 0){
              percentRegion = 0;
            }
            else{
              let percent = (sunOfExcellent+sumOfQualified) /sumOfReports * 100
              percentRegion = percent.toFixed(2);
            }
            if(_index == 0){
              regionData1.push(percentRegion);
              option.series[0].name = _item.region;
            }
            else{
              regionData2.push(percentRegion)
              option.series[1].name = _item.region;
            }
          })

        })
        option.series[0].data = regionData1;
        option.series[1].data = regionData2;
        self.regionsChartsOptions = option;
      },
      initData(){
        let self = this;
        let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs=start;
        self.params.endTs=end;
        let storeIds = self.curStore.filter(item=> item!= -1)
        self.params.storeIds = storeIds;
        self.params.filter={page:0,size:self.sizeNumStore};
        self.getCountryStore()
        self.getTagListData()
        // self.getInspectStatsOverviewOfRegion();
        // self.getInspectStatsOverviewOfStore();
        // self.getInspectStatsLine();
      },
      adjustChart(){
        let self = this;
        if(self.$refs.itemsPie){
          self.$refs.itemsPie.resize()
        }
        if(self.$refs.storeChart){
          self.$refs.storeChart.resize()
        }
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
      self.initDaysRange();
      // await self.getRegionInfo();
      await self.initData();
    },
    mounted(){
      let self = this;
      // self.getCountryStore()
      // self.getTagListData()
      window.addEventListener("resize", self.adjustChart, false);
      self.sidebarElm = document.getElementsByClassName('aside-menu')[0]
      self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false)
    },
    beforeDestroy(){
      let self = this;
      window.removeEventListener('resize', self.adjustChart);
      self.adjustChart = null;
      self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar,false)
      self.$refs.itemsPie &&  self.$refs.itemsPie.dispose()
      self.$refs.storeChart && self.$refs.storeChart.dispose()
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
  $qualified:#6097F3;
  $noqualied:#FDBA40;
  $suggestBack:#F1F6FE;
  $excellent: #57e78f;
  $dangerous:#f31d65;
  $improved: #ffd035;
  $pass: #72a1f3;
  $failed: #ffd035;
  $ignored: #cad1db;

  *{
    box-sizing: border-box;
    font-family: Roboto, Arial, 'Microsoft YaHei';
  }
  .statistics-container{
    /*margin-bottom: 20px;*/
    .statistics-header{
      /*height: calc(180/1920*100vw);*/
      margin-bottom: 20px;
      border-bottom: 1px solid $border;
      background-color: #fff;
      padding-top: 30px;
      padding-bottom: 30px;
      color: $black;
      .header-details1{
        text-align: left;
        padding-left: calc(30/1920*100vw);
        padding-right: calc(30/1920*100vw);
        // height: 20px;
        // line-height: 20px;
        span{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
        }
        .choice-store{
          color: $tab;
          // white-space: nowrap;
          // overflow: hidden;
          /* text-overflow: ellipsis; */
          // width: 90%;
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
          min-height: 28px;
          min-width: 85px
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
        // .storename-str{
        //     width: 100%;
        //     white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
        //     overflow: hidden; //隐藏超出单元格的部分。
        //     text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
        // }
      }
      .header-details:nth-child(2){
        padding-top:15px;
        padding-bottom: 30px;
        padding-right: calc(60/1920*100vw);
      }
    }
    .statistics-content{
      margin-left: calc(30/1920*100vw);
      margin-right: calc(30/1920*100vw);
    }
    .region-header{
      height: 70px;
      text-align: left;
      padding-left: calc(30/1920*100vw);
      padding-right: calc(30/1920*100vw);
      border-bottom: 1px solid $border;
      .title{
        display: inline-block;
        font-size: calc(20/1920*100vw);
        padding-top: 30px;
      }
      .exprotBtn{
        float: right;
        // display: inline-block;
        padding-top: 25px;
      }
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
        width: calc(160/1920*100vw);
        min-width: 120px;
        .btn-area{
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
        margin: 0;
        padding: 0;
        font-size: calc(14/1920*100vw);
        line-height: calc(36/1920*100vw);
        color: #ffffff;
        border-width: 0;
        border-radius: 4px;
        width: calc(160/1920*100vw);
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
            width: calc(24/1920*100vw);
            height: calc(24/1920*100vw);
          }
          .spanClass{
            font-size: calc(14/1920*100vw);
            display: inline-block;
          }
        }
      }
    }
    .region-chart{
      background-color: #fff;
      margin-right: calc(30/1920*100vw);
      //height: calc(400 / 1920 * 100vw);
      border: 1px solid $border;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .evalution-pct {
        .pct-content {
          padding-top: 90px;
          padding-bottom: 25px;
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
            /*margin-left: calc(75 / 1920 * 100vw);*/
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
                line-height: 12px;
                font-size: 0;
                .labels {
                  height: 10px;
                  width: 10px;
                  display: inline-block;
                  margin-right: calc(10 / 1920 * 100vw);
                }
                .label-desc {
                  color: $tab;
                  font-size: 12px;
                }
                .label-0 {
                  background-color: $dangerous;
                }
                // .label-1 {
                //   background-color: $improved;
                // }
                .label-1 {
                  background-color: $pass;
                }
                // .label-3 {
                //   background-color: $excellent;
                // }
              }
            }
            .en-labels {
              @media screen and (max-width: 1280px) {
                padding: 0 calc(5 / 1920 * 100vw);
              }
            }
          }
        }
      }
      .charts-content{
        padding:0 calc(30/1920*100vw);
        .title{
          height: 70px;
          text-align: right;
          padding-top: 20px;
        }
        .region-result-panel{
          height:260px;
        }
        .result-content{
          height: 100%;
          width: 100%;
        }
      }
    }
    .region-list{
      background-color: #fff;
      margin-top: 30px;
      border: 1px solid $border;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .region-header{
        border-bottom: 1px solid $border;
        margin-bottom: 30px;
      }
      .el-table-panel{
        margin-left: calc(30/1920*100vw);
        margin-right: calc(30/1920*100vw);
      }
    }
    .store-list{
      margin-top: 30px;
      border: 1px solid $border;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .region-header{
        border-bottom: 1px solid $border;
        margin-bottom: 30px;
      }
      .el-table-panel{
        margin-left: calc(30/1920*100vw);
        margin-right: calc(30/1920*100vw);
      }

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
      height:13%;
    }
  }
</style>
<style>
.LoadDialog /deep/ .el-dialog__header{
    padding-bottom:0;
  }
  .LoadDialog /deep/ .el-dialog__body{
    padding:0px 20px 30px 20px !important;
  }
.el-table__body-wrapper::-webkit-scrollbar{
    height: 8px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb{
    border-radius: 2px;
}
.el-table__body-wrapper::-webkit-scrollbar-track{
    border-radius: 2px;
}
  .header-class{
    height: 40px;
    font-size: 12px;
    font-family: Roboto, Arial, 'Microsoft YaHei';
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
