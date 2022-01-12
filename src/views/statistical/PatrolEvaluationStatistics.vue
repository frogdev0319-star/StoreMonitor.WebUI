<template>
  <div>
    <el-row class="statistics-container">
      <el-col :span="24">
        <search-component
          ref="inspectEvalutionSearch"
          :is-patrol = "true"
          :default-sort="defaultSort"
          path="inspectEvalutionStatistics"
          @emitSearch = "emitSearch"
          @exportPdf = "exportPdf"
          @setDefaultSortAndPage="setDefaultSortAndPage"/>
      </el-col>
      <div class="statistics-content" style="height:194px;margin-top:200px">
                <div class="head">
                    <el-col :span="17">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.titles.overview') }}
                            </span>
                        </div>
                    </el-col>
                </div>
                <el-row :span="24" class="region-overview">
                    <el-col :span="8" class="division" @click="routeToInspectionReport">
                      <el-col class="text-area">        
                        <el-row class="top">
                           <span class="mainTitle">{{overviewCount.store!=-9999?overviewCount.store:'N/A'}}</span>
                           <span class="unit">{{ $t('statistics.overview.store_unit') }}</span>
                        </el-row >
                        <el-row class="subtitlehead">
                            <span>{{ $t('statistics.overview.store_subtitle') }}</span>
                        </el-row>
                      </el-col>
                      <img class="image-area" :src="overviewStoreSrc" />   
                      <el-col class="line"/>
                     </el-col>
                     <el-col :span="8" class="division">
                      <el-col class="text-area"   @click.native="routeToInspectionReport">
                           <el-row class="top">
                           <span class="mainTitle">{{overviewCount.items>=0?overviewCount.items:'N/A'}}</span>
                           <span class="unit">{{ $t('statistics.overview.count_unit') }}</span>
                        </el-row >
                        <el-row class="subtitlehead">
                            <span>{{ $t('statistics.overview.count_subtitle') }}</span>
                        </el-row>
                      </el-col>
                      <img class="image-area" :src="overviewCountSrc" />      
                      <el-col class="line"/>
                    </el-col>
                    <el-col :span="8" class="division">
                    <el-col class="text-area"   @click.native="routeToInspectionReport">   
                       <el-row class="top">
                           <span class="mainTitle">{{overviewCount.avgScore>=0?overviewCount.avgScore:'N/A'}}</span>
                           <span class="unit">{{ $t('statistics.overview.avg_unit') }}</span>
                        </el-row >
                        <el-row class="subtitlehead">
                            <span>{{ $t('statistics.overview.avg_subtitle') }}</span>
                        </el-row>      
                      </el-col>
                      <img class="image-area" :src="overviewAvgSrc" />  
                    </el-col>
                </el-row>
      </div>
       <div class="statistics-content" style="height:860px;margin-top:18px">
                <div class="head">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.titles.distribution') }}
                            </span>
                        </div>
                            <TypeSelectArea
                              path="inspectEvalutionStatistics"
                              :allow-all=true
                              :region-array1="params.curProvince"
                              :region-array2="params.curCity"
                              :cur-store-group="params.curStoreGroup"
                              :cur-store-type="params.curStoreType"
                              :cur-stores="params.curStore"
                              :inspect-id="params.inspectId"
                              :cached-params="params"
                              :cur-country="curCountry"
                              @emitTypeChanged="emitTypeChangedPart1"
                          ></TypeSelectArea>
                </div>
        <el-row  :span="24" class="partition" style="height:320px">
            <el-col  :span="24" style="height:100%">
              <el-col :span="12" class="evalution-pct">
                <div class="pct-content">
                  <div class="pct-panel">
                    <div class="inner"/>
                    <v-chart ref="itemsPie" 
                    @click="clickPart1Pie"
                    :auto-resize="true" :options="part1.pieOption" class="chart-content"/>
                  </div>
                  <div class="pct-nums">
                    <div
                      v-for="(item, index) in regionsPerArray"
                      :class="index==part1.indexType? 'selected-labels': 'content-labels'"
                      :key="index"
                      @click="setPart1Type(index)"
                      >
                      <div class="excellent_labels">
                        <span :class="`label-` + index" class="labels excellent-label"/>
                        <span class="label-desc">{{ item.type }}</span>
                      </div>
                      <div class="excellent_nums">{{ item.percent }}%</div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col  :span="12"  style="height:290px;padding-top:32px">
                    <div style="overflow-x:auto;overflow-y:hidden;height:100%;">
                    <v-chart @click='clickPart1Bar' ref="storeChart" :options="part1.barRegionOption" autoresize
                            :style="{width:part1.barRegionOption?part1.barRegionOption.width :'100%',height:'100%'}" />
                    </div>
              </el-col>
              <div style="position:absolute;right:0px;top:32px" @click='changePart1RegionOrder'>
                  <div class="button-area" >
                      <span style="color:#acaeb1">{{ part1.regionOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='part1.regionOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                  </div>    
              </div>
           </el-col>      
        </el-row > 
        <div class="subtitle-head">
          <span class="title" >
            {{ $t('statistics.titles.storeEvalDetail') }}
          </span>
           <div class="operation-btns">
                  <div class="switch-btn">
                    <el-button
                    class="mode-btn"
                    :class="{'active-mode-btn' :part1.storeMode==0}"
                    @click="onSwitchPart1Mode(0)"
                    >{{ $t('statistics.event.tableMode')}}</el-button>
                    <el-button
                      class="mode-btn"
                      :class="{'active-mode-btn' :part1.storeMode==1}"
                      @click="onSwitchPart1Mode(1)"
                    >{{ $t('statistics.event.imageMode')}}</el-button>
                  </div>
                  <delay-button
                      :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                    style="margin-left:32px;background-color:#fff;"
                    type="primary"
                    size="mini"
                    @click="exportStore2ExcelPart1"
                  >
                    <div class="button-area">
                      <img :src="exportPng" class="icon-excel">
                      <span style="color:#006ab7">{{ $t('eventView.exportReport') }}</span>
                    </div>
                  </delay-button>
            </div>
        </div>
         <el-col  style="position:absolute;height:400px;padding-top:32px;margin-left:20px;padding-right:40px;width:calc( 100% - 40px )">
                  <v-chart  v-if="part1.storeMode==1" 
                            ref="storeChart" :id="part1-region-line-chart" :options="part1.barStoreOption" 
                      autoresize
                            :style="{width:part1.barStoreOption?part1.barStoreOption.width :'100%',height:'100%'}" />
                  <div v-else style="margin-top:20.5px;height:100%;">
                  <div style="margin-top:20.5px;">
                    <table-only
                      ref="elTP"
                     :column-data="part1StoreInfoTableCol"
                      :table-data="part1.storeTableData"
                      :total="part1.table.total"
                      :highlight-current-row= "true"
                      :pagesize="sizeNum"
                      :current-page="page"
                      :is-event = "false"
                      :default-sort = "defaultSort"
                      :allowRowExpand = "true"
                      :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}" 
                      :tableHeight = "300"
                      layout = "prev,pager,next,sizes"
                      expand-component = "IncepItemTop5"
                      :expandCompProperties = "componentsProps"
                      @handleChange="handlePageAndSizeChangePart1"
                      @sortChange="handleSortChangePart1"
                      @onCellClick = "onEvenListNumClick"
                    />
                  </div>
                  <div style="width:100%; margin-top:12px;height:31px;">
                  <tbl-pagination-only
                    :total="part1.table.total"
                    :pagesize="part1.table.sizeNum"
                    :current-page="part1.table.page"
                    layout = "prev,pager, next,sizes,slot"
                    @sizeChange="handlePageAndSizeChangePart1"
                    @currentChange="handlePageAndSizeChangePart1"
                  />
                </div>
                </div>
                  <div  v-if="part1.storeMode==1"  
                      style="position:absolute;right:40px;top:30px;height:40px" @click='changePart1StoreOrder'>
                    <div class="button-area" >
                      <span style="color:#acaeb1">{{ part1.storeOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='part1.storeOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                    </div>    
                  </div>
           </el-col>  
      </div> 
       <div class="statistics-content" style="height:930px;margin-top:18px">
                <div class="head">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.titles.scoreDistribution') }}
                            </span>
                        </div>
                            <TypeSelectArea
                              path="inspectEvalutionStatistics"
                              :allow-all=true
                              :region-array1="params.curProvince"
                              :region-array2="params.curCity"
                              :cur-store-group="params.curStoreGroup"
                              :cur-store-type="params.curStoreType"
                              :cur-stores="params.curStore"
                              :cached-params="params"
                              :inspect-id="params.inspectId"
                              :cur-country="curCountry"
                              @emitTypeChanged="emitTypeChangedPart2"
                          ></TypeSelectArea>
                </div>
         <el-row :span="24" class="region-overview" style="margin-left:40px;width:400px">
                    <el-col v-if='part2.standardScore!=-9999'  :span="10" class="division">
                      <el-col   class="text-area">        
                        <el-row class="top">
                           <span class="mainTitle">{{part2.standardScore!=-9999?part2.standardScore:'N/A'}}</span>
                           <span class="unit">{{ $t('statistics.score') }}</span>
                        </el-row >
                        <el-row class="subtitlehead">
                            <span>{{ $t('statistics.standardScore') }}</span>
                        </el-row>
                      </el-col>
                      <el-col  class="line"/>
                     </el-col>
                     <el-col v-if='part2.standardScore!=-9999'  :span="4" class="division"/>
                     <el-col :span="8" class="division">
                      <el-col class="text-area">
                        <el-row class="top">
                           <span class="mainTitle">{{part2.averageScore>=0?part2.averageScore:'N/A'}}</span>
                           <span class="unit">{{ $t('statistics.score') }}</span>
                        </el-row >
                        <el-row class="subtitlehead">
                            <span>{{ $t('statistics.averageScore') }}</span>
                        </el-row>
                      </el-col> 
                    </el-col>
                </el-row>
        <el-row  :span="24" class="partition" style="height:320px">
          <v-chart @click='clickPart2Bar' ref="storeChart" :options="part2.barRegionOption"        autoresize
                            :style="{width:part2.barRegionOption?part2.barRegionOption.width :'100%',height:'100%'}" />
          <div style="position:absolute;right:0px;top:0px" @click='changePart2RegionOrder'>
                  <div class="button-area" >
                      <span style="color:#acaeb1">{{ part2.regionOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='part2.regionOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                  </div>    
          </div>
        </el-row > 
        <div class="subtitle-head">
          <span class="title" >
            {{ $t('statistics.titles.storeEvalDetail') }}
          </span>
           <div class="operation-btns">
                  <div class="switch-btn">
                    <el-button
                    class="mode-btn"
                    :class="{'active-mode-btn' :part2.storeMode==0}"
                    @click="onSwitchPart2Mode(0)"
                    >{{ $t('statistics.event.tableMode')}}</el-button>
                    <el-button
                      class="mode-btn"
                      :class="{'active-mode-btn' :part2.storeMode==1}"
                      @click="onSwitchPart2Mode(1)"
                    >{{ $t('statistics.event.imageMode')}}</el-button>
                  </div>
                  <delay-button
                    :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                    style="margin-left:32px;background-color:#fff;"
                    type="primary"
                    size="mini"
                    @click="exportStore2ExcelPart2"
                  >
                    <div class="button-area">
                      <img :src="exportPng" class="icon-excel">
                      <span style="color:#006ab7">{{ $t('eventView.exportReport') }}</span>
                    </div>
                  </delay-button>
            </div>
        </div>
         <el-col  class="partition"  style="position:absolute;height:350px;padding-top:32px;margin-left:20px;padding-right:40px;width:calc(100% - 40px)">
                  <v-chart  v-if="part2.storeMode==1" 
                            ref="storeChart" :id="part2-region-line-chart" :options="part2.barStoreOption" autoresize
                            :style="{width:part2.barStoreOption?part2.barStoreOption.width :'100%',height:'100%'}" />
                  <div v-else style="main-rgtop:20.5px;height:100%;overflow-y: scroll;">
                    <table-pagination
                      ref="elTP"
                      :column-data="part2StoreInfoTableCol"
                      :table-data="part2.storeTableData"
                      :total="part2.table.total"
                      :highlight-current-row= "true"
                      :pagesize="part2.table.sizeNum"
                      :current-page="part2.table.page"
                      :is-event = "false"
                      :default-sort = "defaultSort"
                      :allowRowExpand = "true"
                      layout = "prev,pager,next,sizes"
                      expand-component = "IncepItemTop5"
                      :expandCompProperties = "componentsProps"
                      @handleChange="handlePageAndSizeChangePart2"
                      @sortChange="handleSortChangePart2"
                  />
                </div>
                <div  v-if="part2.storeMode==1"  
                      style="position:absolute;right:40px;top:30px;height:40px" @click='changePart2StoreOrder'>
                    <div class="button-area" >
                      <span style="color:#acaeb1">{{ part2.storeOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='part2.storeOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                    </div>    
                  </div>
           </el-col>  
      </div> 
      <div v-if="part3.standardScore!=-9999" class="statistics-content" style="height:930px;margin-top:18px">
                <div class="head">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.titles.rateDistribution') }}
                            </span>
                             <span class="title" style="font-size:13px;margin-left:8px">
                                {{ "("+$t('statistics.standardLine')+": " }}
                            </span>
                            <span class="title" style="font-size:13px;color:#f00;">
                                {{ part3.standardScore }}
                            </span>
                            <span class="title" style="font-size:13px">
                                {{ $t('statistics.score')+")" }}
                            </span>
                        </div>
                            <TypeSelectArea
                              path="inspectEvalutionStatistics"
                              :allow-all=true
                              :region-array1="params.curProvince"
                              :region-array2="params.curCity"
                              :cur-store-group="params.curStoreGroup"
                              :cur-store-type="params.curStoreType"
                              :cur-stores="params.curStore"
                              :inspect-id="params.inspectId"
                              :cached-params="params"
                              :cur-country="curCountry"
                              @emitTypeChanged="emitTypeChangedPart3"
                          ></TypeSelectArea>
                </div>
          <el-row :span="24" class="region-overview" style="margin-left:40px;width:400px">
                    <el-col :span="10" class="division">
                      <el-col class="text-area">        
                        <el-row class="top">
                           <span class="mainTitle">{{part3.averageScore>0?part3.averageScore:'N/A'}}</span>
                           <span class="unit">{{  "%" }}</span>
                        </el-row >
                        <el-row class="subtitlehead">
                            <span>{{ $t('statistics.totalStandardRate') }}</span>
                        </el-row>
                      </el-col>
                     </el-col>
          </el-row>
        <el-row  :span="24" class="partition" style="height:320px">
            <el-col  :span="24" style="height:100%">
               <v-chart @click='clickPart3Bar' ref="storeChart" :options="part3.barRegionOption"  autoresize
                            :style="{width:part3.barRegionOption?part3.barRegionOption.width :'100%',height:'100%'}" />
            <div style="position:absolute;right:0px;top:0px" @click='changePart3RegionOrder'>
                      <div class="button-area" >
                          <span style="color:#acaeb1">{{ part3.regionOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                          <img :src='part3.regionOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                      </div>    
              </div>
           </el-col>      
        </el-row > 
        <div class="subtitle-head">
          <span class="title" >
            {{ $t('statistics.titles.storeEvalDetail') }}
          </span>
           <div class="operation-btns">
                  <div class="switch-btn">
                    <el-button
                    class="mode-btn"
                    :class="{'active-mode-btn' :part3.storeMode==0}"
                    @click="onSwitchPart3Mode(0)"
                    >{{ $t('statistics.event.tableMode')}}</el-button>
                    <el-button
                      class="mode-btn"
                      :class="{'active-mode-btn' :part3.storeMode==1}"
                      @click="onSwitchPart3Mode(1)"
                    >{{ $t('statistics.event.imageMode')}}</el-button>
                  </div>
                  <delay-button
                    :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                    style="margin-left:32px;background-color:#fff;"
                    type="primary"
                    size="mini"
                    @click="exportStore2ExcelPart3"
                  >
                    <div class="button-area">
                      <img :src="exportPng" class="icon-excel">
                      <span style="color:#006ab7">{{ $t('eventView.exportReport') }}</span>
                    </div>
                  </delay-button>
            </div>
        </div>
         <el-col  style="height:350px;padding-top:32px;margin-left:20px;padding-right:40px;width:calc(100% - 40px);position:absolute">
                  <v-chart  v-if="part3.storeMode==1" 
                            ref="storeChart" :id="part3-region-line-chart" :options="part3.barStoreOption"   autoresize
                            :style="{width:part3.barStoreOption?part3.barStoreOption.width :'100%',height:'100%'}" />
                  <div v-else style="margin-top:20.5px;height:100%;overflow-y: scroll;">
                    <table-pagination
                      ref="elTP"
                      :column-data="part3StoreInfoTableCol"
                      :table-data="part3.storeTableData"
                      :total="part2.table.total"
                      :highlight-current-row= "true"
                      :pagesize="part2.table.sizeNum"
                      :current-page="part2.table.page"
                      :is-event = "false"
                      :default-sort = "defaultSort"
                      :allowRowExpand = "true"
                      layout = "prev,pager,next,sizes"
                      expand-component = "IncepItemTop5"
                      :expandCompProperties = "componentsProps"
                      @handleChange="handlePageAndSizeChangePart3"
                      @sortChange="handleSortChangePart3"
                  />
                </div>
                <div  v-if="part2.storeMode==1"  
                      style="position:absolute;right:40px;top:30px;height:40px" @click='changePart3StoreOrder'>
                    <div class="button-area" >
                      <span style="color:#acaeb1">{{ part3.storeOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='part3.storeOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                    </div>    
                  </div>
           </el-col>  
      </div> 
    </el-row>
    <dialog-pop
      :title="$t('insSettingView.export')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="ispdf"
      :show-button="false"
      :show-close="false"
      class="LoadDialog"
    >
      <p>{{ $t('insSettingView.isExportPDF') }}......</p>
    </dialog-pop>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import LimitSelect from '@/components/LimitSelect';
import ECharts from 'vue-echarts';
import util from '@/common/util.js';
import {
  getInspectStatsOverviewV2,
  getInspectStatsOverRegion,
  getInspectStatsOverviewWithRegionV2,
  getInspectStatsOverviewWithGroup
} from '@/api/inspectOverview';
import { GetInspectTagList } from '@/api/inspect';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TablePagination from '@/components/TablePagination_V2';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DialogPop from '@/components/DialogPop';
import DelayButton from '@/components/DelayButton';
import TypeSelectArea from '@/components/TypeSelectArea';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import "../../assets/sass/util.scss";
export default {
  name: 'PatrolEvaluationSta',

  components: {
    DelayButton,
    DialogPop,
    'v-chart': ECharts,
    LimitSelect,
    SearchComponent,
    TablePagination,
    TypeSelectArea,
    TableOnly,
    TblPaginationOnly
  },
  mixins: [resize],
  data() {
    return {
      page:null,
      total:null,
      componentsProps:"",
      sizeNum:null,
      expandCompProperties:"",
      htmlTitle: this.$t('overview.htmltopdfA'),
      isexportPDF: false,
      storeNameStr: '',
      storeGroupStr: '',
      storeTypeStr: '',
      storePatrolLists: '',
      curRegion: [],
      timeMode: 1,
      regionsList: [],
      params: {},
      daysRangeList: [],
      toolTipClass: 'page-login-toolTipClass',
      tooltipClass: 'tooltip-class',
      lang: this.$i18n.locale,
      storeDataList: [],
      exportPng: require('../../../static/img/excel.png'),
      descPng: require('../../../static/img/statistics/orderDesc.png'),
      incPng: require('../../../static/img/statistics/orderInc.png'),
      overviewStoreSrc: require('../../../static/img/statistics/overview_store.png'),
      overviewCountSrc: require('../../../static/img/statistics/overview_count.png'),
      overviewAvgSrc: require('../../../static/img/statistics/overview_avg.png'),
      regionsOptions: null,
      regionsPerArray: [],
      resultLegend: [
        {
          'type': this.$t('overview.danger'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.improve'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.echartGood'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.excellent'),
          'percent': '0%'
        }
      ],
      regionsChartsOptions: null,
      regionInfoData: [
        {
          'prop': 'region',
          'label': this.$t('overview.regionName'),
          'sortable': false,
          'pdfwidth': '22%',
          'pdfmaxWidth': '22%',
          'width': '284',
          'maxWidth': '284'
        },
        {
          'prop': 'cycleOfInspect',
          'label': this.$t('overview.advPatrolCycle'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '14%',
          'width': '160',
          'maxWidth': '230'
        },
        {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '180'
        },
        {
          'prop': 'numOfQualified',
          'label': this.$t('overview.echartGood'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'numOfImproved',
          'label': this.$t('overview.improve'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'numOfDangerous',
          'label': this.$t('overview.danger'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'qualifiedRateStr',
          'label': this.$t('overview.passRate'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'pdfmaxWidth': '14%',
          'width': '217',
          'maxWidth': '180'
        },
        {
          'prop': 'averageScore',
          'label': this.$t('overview.averageScore'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'pdfmaxWidth': '14%',
          'width': '217',
          'maxWidth': '180'
        }
      ],
      regionTableData: [],
      regionPDFData: [],
      totalRegion: 0,
      pageRegion: 1,
      sizeNumRegion: 10,
      storeInfoData: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'region',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '120',
          'maxWidth': '120'
        },
        {
          'prop': 'cycleOfInspect',
          'label': this.$t('overview.advPatrolCycle'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'width': '160',
          'maxWidth': '230'
        },
        {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '14%',
          'width': '150',
          'maxWidth': '180'
        },
        {
          'prop': 'numOfQualified',
          'label': this.$t('overview.echartGood'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '100',
          'maxWidth': '100'
        },
        {
          'prop': 'numOfImproved',
          'label': this.$t('overview.improve'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '110',
          'maxWidth': '120'
        },
        {
          'prop': 'numOfDangerous',
          'label': this.$t('overview.danger'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '130',
          'maxWidth': '130'
        },
        {
          'prop': 'qualifiedRateStr',
          'label': this.$t('overview.passRate'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '140',
          'maxWidth': '140'
        },
        {
          'prop': 'averageScore',
          'label': this.$t('overview.averageScore'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '110',
          'maxWidth': '110'
        }
      ],
      storeTableData: [],
      storePDFData: [],
      totalStore: 0,
      pageStore: 1,
      sizeNumStore: 10,
      curRegionArray: [],
      exportDataHeader:
      [
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('overview.storeName'),
        this.$t('remotePatrol.code'),
        this.$t('overview.advPatrolCycle'),
        this.$t('overview.numOfEvaluations'),
        this.$t('overview.echartGood'),
        this.$t('overview.improve'),
        this.$t('overview.danger'),
        this.$t('overview.passRate'),
        this.$t('overview.averageScore')
      ],
      exportRegionHeader:
      [
        this.$t('overview.regionName'),
        this.$t('overview.advPatrolCycle'),
        this.$t('overview.numOfEvaluations'),
        this.$t('overview.echartGood'),
        this.$t('overview.improve'),
        this.$t('overview.danger'),
        this.$t('overview.passRate'),
        this.$t('overview.averageScore')
      ],
      exportPart1DataHeader:
      [
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('overview.storeName'),
        this.$t('remotePatrol.code'),
        this.$t('statistics.submitter'),
        this.$t('overview.numOfEvaluations'),
        this.$t('overview.echartGood'),
        this.$t('overview.improve'),
        this.$t('overview.danger'),
      ],
      exportPart2DataHeader:
      [
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('overview.storeName'),
        this.$t('remotePatrol.code'),
        this.$t('statistics.submitter'),
        this.$t('overview.numOfEvaluations'),
        this.$t('overview.averageScore'),
        this.$t('statistics.rank'),
      ],
      exportPart3DataHeader:
      [
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('overview.storeName'),
        this.$t('remotePatrol.code'),
        this.$t('statistics.submitter'),
        this.$t('overview.numOfEvaluations'),
        this.$t('statistics.numOfStandard'),
        this.$t('statistics.sRate'),
        this.$t('statistics.rank'),
      ],
      regionParams: {},
      chartParams: {},
      chartArrayData: [],
      echartBackground: 'rgba(30,34,52,0.75)',
      echartColor: '#7d8cab',
      regionDataList: [],
      echartAxiasColor: '#e3e9f4',
      headerClass: 'header-class',
      cellClass: 'cell-class',
      rowClass: 'row-class',
      regionFilter: { 'page': 0, 'size': 10 },
      regionOrder: { 'direction': 'asc', 'property': 'qualifiedRate' },
      storeFilter: { 'page': 0, 'size': 10 },
      storeOrder: { 'direction': 'asc', 'property': 'qualifiedRate' },
      fontFamily: 'Roboto, Microsoft YaHei',
      ispdf: false,
      regionMode: 2,
      ifSaveParams: false,
      defaultSort: { prop: 'qualifiedRateStr', order: 'ascending' },
      defaultStoreSort: { prop: 'qualifiedRateStr', order: 'ascending' },
      defaultRegionSort: { prop: 'qualifiedRateStr', order: 'ascending' },
      overviewCount:{store:-9999,items:-9999,avgScore:-9999},
      curCountry:"-1",
      part1StoreInfoTableCol: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '90',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '90',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'groupName',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'width': '80',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeGroup',
          'label': this.$t('statistics.event.storeGroup'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeType',
          'label': this.$t('statistics.event.storeType'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
          {
          'prop': 'storeSubmitters',
          'label': this.$t('statistics.submitter'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%'
        },
        {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '14%',
          'width': '80',
          'maxWidth': '180'
        },
        {
          'prop': 'numOfQualified',
          'label': this.$t('overview.echartGood'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        },
        {
          'prop': 'numOfImproved',
          'label': this.$t('overview.improve'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '120'
        },
        {
          'prop': 'numOfDangerous',
          'label': this.$t('overview.danger'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '130'
        },
    
      ],
      part2StoreInfoTableCol: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '90',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '90',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'groupName',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'width': '80',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeGroup',
          'label': this.$t('statistics.event.storeGroup'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeType',
          'label': this.$t('statistics.event.storeType'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
          {
          'prop': 'storeSubmitters',
          'label': this.$t('statistics.submitter'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%'
        },
        {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '14%',
          'width': '80',
          'maxWidth': '180'
        },
        {
          'prop': 'averageScore',
          'label': this.$t('overview.averageScore'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        },
          {
          'prop': 'rank',
          'label': this.$t('statistics.rank'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        },
        {
          'prop': 'compareTrend',
          'label': this.$t('statistics.compareTrend'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        }
        ],
        part3StoreInfoTableCol: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '90',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '90',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'groupName',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'width': '80',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeGroup',
          'label': this.$t('statistics.event.storeGroup'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeType',
          'label': this.$t('statistics.event.storeType'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
          {
          'prop': 'storeSubmitters',
          'label': this.$t('statistics.submitter'),
          'sortable': false,
          'width': '110',
          'maxWidth': '110',
          'pdfwidth': '11%'
        },
         {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '14%',
          'width': '80',
          'maxWidth': '180'
        },
          {
          'prop': 'numOfStandard',
          'label': this.$t('statistics.numOfStandard'),
          'sortable': 'custom',
          'pdfwidth': '14%',
          'width': '80',
          'maxWidth': '180'
        },
        {
          'prop': 'standardRate',
          'label': this.$t('statistics.sRate'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        },
          {
          'prop': 'rank',
          'label': this.$t('statistics.rank'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        },
        {
          'prop': 'compareTrend',
          'label': this.$t('statistics.compareTrend'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '80',
          'maxWidth': '100'
        }
    
      ],
      part1:{ compareType:'stores', indexRegion:0, content:[],selStoreIdArr:[],
              compareIds :[],comapareLabels:[],originArray:[],
              indexType:0, regionOrder:"desc",storeOrder:"desc",
              storeMode:0, barRegionSort:1,barStoreStore:1,
              pageIndex:0,pargeSize:10,storeTableData:[],
              pieOption:{},barRegionOption:{},barStoreOption:{},
              table:{total:0,page:1,sizeNum:10,order:'desc',property:'numOfReport'}},
      part2:{ standardScore:-9999,averageScore:-9999,
              compareType:'stores', indexRegion:0, content:[],selStoreIdArr:[],
              compareIds :[],comapareLabels:[],originArray:[],
              indexType:0,regionOrder:"desc",storeOrder:"desc",
              storeMode:0, barRegionSort:1,barStoreStore:1,
              pageIndex:0,pargeSize:10,storeTableData:[],
              pieOption:{},barRegionOption:{},barStoreOption:{},
              table:{total:0,page:1,sizeNum:10,order:'desc',property:'numOfRepo rt'}},
      part3:{ standardScore:-9999,averageScore:-9999,
              compareType:'stores', indexRegion:0, content:[],selStoreIdArr:[],
              compareIds :[],comapareLabels:[],originArray:[],
              indexType:0,regionOrder:"desc",storeOrder:"desc",
              storeMode:0, barRegionSort:1,barStoreStore:1,
              pageIndex:0,pargeSize:10,storeTableData:[],
              pieOption:{},barRegionOption:{},barStoreOption:{},
              table:{total:0,page:1,sizeNum:10,order:'desc',property:'numOfReport'}},
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        await this.initData();
      }
    },
  },

  async created() {
    await this.initData();
  },

  beforeDestroy() {
    this.$refs.itemsPie && this.$refs.itemsPie.dispose();
    this.$refs.storeChart && this.$refs.storeChart.dispose();
  },

  methods: {
    routeToInspectionReport(){
      const searchParamsObj = {
        path: 'inspectReport',
        params: this.params
      };
      this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
       this.$router.push({
         path: '/report',
      });

    },
    handlePageAndSizeChangePart1(e){
        this.part1.table.page = e.page;
        this.part1.table.sizeNum = e.size;
        this.getPart1StoreBar();
    },
    handleCurrentChangePart1(e){
        this.part1.table.page = e.page;
        this.part1.table.sizeNum = e.size;
        this.getPart1StoreBar();
    },
    handleSortChangePart1(e){
        console.log(e)
        this.part1.table.order = e.direction;
        this.part1.table.property = e.property;
        this.getPart1StoreBar();
    },
    handlePageAndSizeChangePart2(e){
        this.part2.table.page = e.page;
        this.part2.table.sizeNum = e.size;
        this.getPart2StoreBar();
    },
    handleSortChangePart2(e){
        console.log(e)
    },
    handlePageAndSizeChangePart3(e){
        this.part3.table.page = e.page;
        this.part3.table.sizeNum = e.size;
        this.getPart3StoreBar();
    },
    handleSortChangePart3(e){
        console.log(e)
    },
    handlePageAndSizeChangePart1(e){
        this.part1.table.page = e.page;
        this.part1.table.sizeNum = e.size;
        this.getPart1StoreBar();
    },

    onSwitchPart1Mode(mode){
      this.part1.storeMode = mode;
    },
    onSwitchPart2Mode(mode){
      this.part2.storeMode = mode;
    },
    onSwitchPart3Mode(mode){
      this.part3.storeMode = mode;
    },
    async handleExportReport() {
      const self = this;
      self.ispdf = true;
      try {
        if (self.totalRegion > 0) {
          const size = self.totalRegion;
          const params = {};
          params.beginTs = self.params.beginTs;
          params.endTs = self.params.endTs;
          params.filter = { 'page': 0, 'size': size };
          params.order = self.regionOrder;
          params.regionMode = self.regionMode;
          params.storeIds = self.params.storeIds;
          params.inspectTagId = self.params.inspectId;
          const regionResult = await self.getInspectStatsOverviewWithRegion(params);
          if (regionResult.errCode === 0) {
            const result = regionResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRateStr = item.qualifiedRate + '%';
              });
              self.regionPDFData = result.content;
            }
          }
        }
        if (self.totalStore > 0) {
          const storesize = self.totalStore;
          const storeparams = {};
          storeparams.beginTs = self.params.beginTs;
          storeparams.endTs = self.params.endTs;
          storeparams.regionMode = 3;
          storeparams.storeIds = self.params.storeIds;
          storeparams.inspectTagId = self.params.inspectId;
          storeparams.filter = {
            'page': 0,
            'size': storesize
          };
          storeparams.order = self.storeOrder;

          const storeResult = await self.getInspectStatsOverviewWithRegion(storeparams);
          if (storeResult.errCode === 0) {
            const result = storeResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRateStr = item.qualifiedRate + '%';
              });
              self.storePDFData = result.content;
            }
          }
        }
      } catch (e) {
        self.ispdf = false;
        return;
      }
      setTimeout(() => {
        self.getPdf();
        if (sessionStorage.getItem('startPDF') === 'start') {
          sessionStorage.removeItem('startPDF', 'start');
          if (sessionStorage.getItem('endPDF') === 'end') {
            sessionStorage.removeItem('endPDF', 'end');
            setTimeout(() => {
              self.ispdf = false;
            }, 1000);
          }
        }
      }, 1000);
    },

    async searchData() {
    
      this.storeDateValue = util.getDates(this.params.beginTs) + '-' + util.getDates(this.params.endTs);
      this.part1.pieOption = null;
      this.part1.storeTableData = null;
      this.part1.barRegionOption = null;
      this.part1.barStoreOption = null;
      this.part2.pieOption = null;
      this.part2.storeTableData = null;
      this.part2.barRegionOption = null;
      this.part2.barStoreOption = null;
      this.part3.pieOption = null;
      this.part3.storeTableData = null;
      this.part3.barRegionOption = null;
      this.part3.barStoreOption = null;
      this.overviewCount={store:-9999,items:-9999,avgScore:-9999};
      if(this.params.storeIds.length>0){
        await this.dataGetOverview();
        await this.dataGetPart1() ;
        await this.dataGetPart2() ;
        await this.dataGetPart3() ;

      }

    },

    async export2Excel() {
      const that = this;
      if (this.part1.storeTableData.length === 0) {
        util.notify(that.$t('overview.emptyRegionList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportRegionHeader;
        const filterVal = ['region', 'cycleOfInspect', 'numOfReport', 'numOfQualified', 'numOfImproved',
          'numOfDangerous', 'qualifiedRateStr', 'averageScore'];
        const self = this;
        const data = that.formatJson(filterVal, this.part1.storeTableData);
        const fileName = 'Area' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    async exportStore2ExcelPart1() {
      const that = this;
      if (that.part1.storeTableData.length === 0) {
        util.notify(that.$t('overview.emptyStoreList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportPart1DataHeader;
        const filterVal = ['province', 'city', 'groupName', 'code', 'storeSubmitters', 'numOfReport', 'numOfQualified', 'numOfImproved',
          'numOfDangerous'];
        const self = this;
        const data = that.formatJson(filterVal, that.part1.storeTableData);
        const name = self.params.inspectId==='' ? 'All' : self.storePatrolLists;
        const fileName = name + '_Inspection evaluation result_' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    async exportStore2ExcelPart2() {
      const that = this;
      if (that.part2.storeTableData.length === 0) {
        util.notify(that.$t('overview.emptyStoreList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportPart2DataHeader;
        const filterVal = ['province', 'city', 'groupName', 'code', 'storeSubmitters', 'numOfReport', 'averageScore', 'rank'];
        const self = this;
        const data = that.formatJson(filterVal, that.part2.storeTableData);
        const name = self.params.inspectId==='' ? 'All' : self.storePatrolLists;
        const fileName = name + '_Inspection score_' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    async exportStore2ExcelPart3() {
      const that = this;
      if (that.part3.storeTableData.length === 0) {
        util.notify(that.$t('overview.emptyStoreList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportPart3DataHeader;
        const filterVal = ['province', 'city', 'groupName', 'code', 'storeSubmitters', 'numOfReport','numOfStandard',
        'qualifiedRate','rank'];
        const self = this;
        const data = that.formatJson(filterVal, that.part3.storeTableData);
        const name = self.params.inspectId==='' ? 'All' : self.storePatrolLists;
        const fileName = name + '_Inspection compliance_' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    getInspectStatsOverviewWithRegion(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverviewWithRegionV2(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    
       getInspectStatsOverviewWithGroup(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverviewWithGroup(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
   getInspectReulstStatsOverview(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverviewV2(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    getInspectResultOverRegion(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverRegion(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    async getInspectStatsLine() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.region = this.regionMode;
      params.timeMode = self.timeMode;
      params.inspectTagId = self.params.inspectId;
      params.storeIds = self.params.storeIds;
      try {
        const regionResult = await self.getInspectResultOverRegion(params);
        const option = self.getInspectLineOption();
        if (regionResult.errCode === 0) {
          const result = regionResult.data;
          let sortedProviceOrCity = [];
          sortedProviceOrCity = this.regionMode === 1 ? JSON.parse(JSON.stringify(self.curRegionI))
            : JSON.parse(JSON.stringify(self.curRegionII));
          const filterResult = self.jsonArrayHasSpecifiedValue(sortedProviceOrCity, result);
          self.regionDataList = filterResult;
          const regionArray = [];
          filterResult[0].regions.forEach(item => {
            const json = {};
            json.label = item.region;
            json.value = item.region;
            json.disabled = false;
            regionArray.push(json);
          });
          self.regionsList = regionArray;
          self.curRegion = [];
          self.regionsList.length > 0 ? self.curRegion.push(self.regionsList[0].value) : self.curRegion;
          self.regionsList.length > 1 ? self.curRegion.push(self.regionsList[1].value) : self.curRegion;
          const filterTwoResult = self.jsonArrayHasSpecifiedValue(self.curRegion, filterResult);

          const regionData1 = [];
          const regionData2 = [];
          filterTwoResult.forEach((item) => {
            const filterRegions = item.regions;
            filterRegions.forEach((_item, _index) => {
              let sumOfReports = 0;
              let sunOfExcellent = 0;
              let sumOfQualified = 0;
              let percentRegion = 0;
              sunOfExcellent += _item.numOfExcellent;
              sumOfQualified += _item.numOfQualified;
              sumOfReports += _item.numOfExcellent + _item.numOfQualified + _item.numOfImproved + _item.numOfDangerous;
              if (sumOfReports === 0) {
                percentRegion = 0;
              } else {
                const percent = (sunOfExcellent + sumOfQualified) / sumOfReports * 100;
                percentRegion = percent.toFixed(2);
              }
              if (_index === 0) {
                regionData1.push(percentRegion);
                option.series[0].name = _item.region;
              } else {
                regionData2.push(percentRegion);
                //option.series[1].name = _item.region;
              }
            });
          });
          if(regionData1.length>0){
            var item = {
              value:46,
              itemStyle: {
                color: '#a90000'
              }
            };
            regionData1[0] =item;
          }
          option.series[0].data = regionData1;
        //  option.series[1].data = regionData2;
        }
        self.regionsChartsOptions = option;
      } catch (e) {
        console.log('PatrolEvaluationStatistics-getInspectStatsLine:' + e);
      }
    },
    emitTypeChangedPart1({compareType,compareArr,selectedLabels,originArray,selStoreIdArr}){ //劃分類型選擇
      console.log("Part1 Emit Type Change="+compareType)
      this.part1.compareType = compareType;
      this.part1.compareIds = compareArr;
      this.part1.comapareLabels = selectedLabels;
      this.part1.originArray = originArray;
      this.part1.selStoreIdArr = selStoreIdArr;
      this.dataGetPart1();

    },
    emitTypeChangedPart2({compareType,compareArr,selectedLabels,originArray,selStoreIdArr}){ //劃分類型選擇
      console.log("Part2 Emit Type Change="+compareType)
      this.part2.compareType = compareType;
      this.part2.compareIds = compareArr;
      this.part2.comapareLabels = selectedLabels;
      this.part2.originArray = originArray;
      this.part2.selStoreIdArr = selStoreIdArr;
      this.dataGetPart2();

    },
    emitTypeChangedPart3({compareType,compareArr,selectedLabels,originArray,selStoreIdArr}){ //劃分類型選擇
      console.log("Part3 Emit Type Change="+compareType)
      this.part3.compareType = compareType;
      this.part3.compareIds = compareArr;
      this.part3.comapareLabels = selectedLabels;
      this.part3.originArray = originArray;
      this.part3.selStoreIdArr = selStoreIdArr;
      this.dataGetPart3();

    },
    getInspectLineOption() {
      const option = {
        width:'100%',
        color: ['#f11e66'],
        legend: {
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          padding: 0,
          icon: 'rect',
          textStyle: {
            color: this.echartColor,
            fontSize: 12,
            padding: [0, 0, 0, 5],
            height: 12,
            lineHeight: 12
          }
        },
        grid: {
          containLabel: true,
          top: '40',
          left: '25',
          right: '5',
          bottom: '32'
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: false
            }
          },
          padding: 5,
          textStyle: {
            align: 'left'
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            show: false,
            inside: true,
            lineStyle: {
              color: '#7D8CAB',
              fontSize: 12
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#7D8CAB'
            }
          },
          axisLabel: {
            fontStyle: 12,
            margin: 10,
            rotate:45,
          },
          data: []
        },
        yAxis: [
          {
            type: 'value',
            name: '(%)',
            minInterval: 10,
            nameLocation: 'end',
            nameTextStyle: {
              align: 'left',
              padding: [0, 10]
            },

            splitLine: {
              show: true,
              lineStyle: {
                color: this.echartAxiasColor,
                width: 1
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              onZero: false,
              show: true,
              lineStyle: {
                color: 'this.echartAxiasColor'
              }
            },
            axisLabel: {
              show: true,
              fontStyle: 12,
              margin: 10,
              color: '#7d8cab'
            }
          },
          {
            type: 'value',
            max: 100,
            position: 'right',
            axisLabel: {
              show: false,
              interval: 'auto'
            },
            splitNumber: 20,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              onZero: false,
              show: true,
              lineStyle: {
                color: 'this.echartAxiasColor'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: 15,
            symbol: 'none',
            
            yAxisIndex: 0,
            smooth: true,
            name: '',
            data: []
          },
        ]
      };
      return option;
    },

    jsonArrayHasSpecifiedValue(specifiedValue, jsonArray) {
      const tempData = [];
      jsonArray.forEach(item => {
        const tempJson = {};
        tempJson.ts = item.ts;
        const tempRegions = [];
        const regions = item.regions;
        regions.sort((item1, item2) => {
          return item1.region < item2.region ? 1 : -1;
        });
        specifiedValue.forEach(_item => {
          regions.forEach(regionItem => {
            if (regionItem.region === _item) {
              tempRegions.push(regionItem);
            }
          });
        });
        tempJson.regions = tempRegions;
        tempData.push(tempJson);
      });
      return tempData;
    },
  async dataGetOverview() {
    
      const self = this;
      const params = {};
      console.log("dataGetOverview")
      console.log(self.params)
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      params.filter = { page: 0, size: params.storeIds.length };
      const storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        const result = storeResult.data;
        if (result) {
          let total = 0;
          let nums = 0;
          console.log(result)
          result.content.forEach(function(item){
            total += item.averageScore * item.numOfReport;
            nums +=item.numOfReport;
          })
          this.overviewCount.avgScore= -9999;
          this.overviewCount.store = result.content.length;
          this.overviewCount.items = nums;
          if(nums>0) this.overviewCount.avgScore=Math.round(total/nums)
        }
      } 
    },

    async dataGetPart1() {
      console.log("dataGetPart1")
      this.part1.pieOption = null;
      this.part1.storeTableData = null;
      this.part1.barRegionOption = null;
      this.part1.barStoreOption = null;
      await this.getPart1RegionBar();
      //self.getInspectStatsLine();:
    },
    async dataGetPart2(){
      this.part2.pieOption = null;
      this.part2.storeTableData = null;
      this.part2.barRegionOption = null;
      this.part2.barStoreOption = null;
      await this.getPart2RegionBar();
    },
    async dataGetPart3(){
      this.part3.pieOption = null;
      this.part3.storeTableData = null;
      this.part3.barRegionOption = null;
      this.part3.barStoreOption = null;
      await this.getPart3RegionBar();
    },
    async getInspectStatsOverviewOfRegionTable() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.filter = self.regionFilter;
      params.order = self.regionOrder;
      params.regionMode = self.regionMode;
      params.storeIds = self.params.storeIds;

      params.inspectTagId = self.params.inspectId;
      const storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        const result = storeResult.data;
        if (result) {
          result.content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
          });
          self.regionTableData = result.content;
        }
      } else {
        util.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalRegion = 0;
        self.regionTableData = [];
      }
    },

    async getInspectStatsOverviewOfStore() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.storeIds = self.params.storeIds;
      params.filter = self.storeFilter;
      params.order = self.storeOrder;
      params.inspectTagId = self.params.inspectId;
      const storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        const result = storeResult.data;
        if (result) {
          self.totalStore = result.totalElements;
          result.content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
          });
          self.storeTableData = result.content;
        }
      } else {
        util.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalStore = 0;
      }
    },
    filterContent(content,type,ids,labels,originArray){
      let output = [];
      if(type == 'stores'){
        content.map(function(item,i){
          item.list = [];
         //item.list.push(JSON.parse(JSON.stringify(item)))
          output.push(item)
        });;
      }
      else{
        content.map(function(item,i){
          originArray.map(function(d){
            if(d.label == item.groupName){
              item.list = d.contents;
            }
          })
          output.push(item)
        });;
      }
     
      console.log("Filter content")
      console.log(output);
      return output;
    },
    async getPart1RegionBar() {
      const self = this;
      let totalDargerous = 0;
      let totalImproved = 0;
      let totalQualified = 0;
      let totalReport = 0;
      const jsonArray = self.resultLegend.slice(0, 3);
      let seriesData = [];
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.groupMode = 0;
      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      if(this.part1.compareType=='stores'){
         params.storeIds  = this.part1.compareIds;
         params.groupIds = this.part1.compareIds;
         params.groupMode = 0;
      }
      else if(this.part1.compareType=='area1'){
         params.groupIds  = this.part1.compareIds;
         params.storeIds =  this.part1.selStoreIdArr;
         params.groupMode = 1;
      }
      else if(this.part1.compareType=='area2'){
         params.groupIds  = this.part1.compareIds;
         params.storeIds =  this.part1.selStoreIdArr;
         params.groupMode = 2;
      }
      else if(this.part1.compareType=='storeType'){
         params.groupIds  = this.part1.compareIds;
         params.groupMode = 3;
      }
      else if(this.part1.compareType=='storeGroup'){
         params.groupIds  = this.part1.compareIds;
         params.groupMode = 3;
      }
      else if(this.part1.compareType=='users'){
         params.submitters  = this.part1.compareIds;
         params.groupMode = 5;
      }
      
        params.filter = { page: 0, size: params.groupIds.length };
        console.log("Get Part1 Region bar")
        console.log(params)
        const storeResult = await self.getInspectStatsOverviewWithGroup(params);
        if (storeResult.errCode === 0) {
          const result = storeResult.data;
          if (result) {
            console.log(result)
            this.part1.content = this.filterContent(result.content, 
            this.part1.compareType,
            this.part1.compareIds,
            this.part1.comapareLabels,
            this.part1.originArray);
            this.part1.indexRegion = -1;
            result.content.forEach(item => {
              totalDargerous += item.numOfDangerous;
              totalImproved += item.numOfImproved;
              totalQualified += item.numOfQualified;
              totalReport += item.numOfReport;
            });
          }
          seriesData = [
            { value: totalDargerous, name: self.$t('overview.danger') },
            { value: totalImproved, name: self.$t('overview.improve') },
            { value: totalQualified, name: self.$t('overview.echartGood') }
          ];
          const totalArray = [totalDargerous, totalImproved, totalQualified];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        } else {
          util.notify(self.$t('overview.queryFail'), 'warning', 3000);
          const totalArray = [0, 0, 0, 0];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        } 

      for(var k in seriesData){
        if(seriesData[k].value>0){
          this.part1.indexType = parseInt(k);
          console.log("Init RegionIndex="+this.part1.indexType )
          break;
        }
      }
      const pieOption = self.getRegionPieOption();
      pieOption.series[0].data = seriesData;
      self.regionsOptions = pieOption;
      this.part1.pieOption  = pieOption
      self.regionsPerArray = jsonArray;
      this.drawPart1RegionBar();
    },
    async drawPart1RegionBar(){
      console.log("Region Line")
      const self = this;
      const option = this.getInspectLineOption();
      const regionData =[];
      const regionLabel =[];
      
   
      if(this.part1.content){
          this.part1.content.map((item,index) => {
          let value = 0;
          var arr  = [item.numOfDangerous,item.numOfImproved,item.numOfQualified]
          if(this.part1.indexType==0){
              value = util.getPercentValue(arr, 0, 2)
          }
          else if(this.part1.indexType==1){
              value = util.getPercentValue(arr, 1, 2)
          }
          else if(this.part1.indexType==2){
              value =  util.getPercentValue(arr, 2, 2)
          }
          item.value = value;
        });
        this.part1.content = this.part1.content.sort(function(a,b){
          if(self.part1.regionOrder == "desc")
             return b.value -a.value; 
          else
             return a.value -b.value; 
        })
        this.part1.content.map((item,index) => {
          if(this.part1.indexRegion<0 && item.value>0){
            this.part1.indexRegion = index;
          }
          
          if( this.part1.indexRegion == index){   
            regionData.push({value:item.value,itemStyle: {
                color: '#f11e66',
                emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(1, 0, 0, 0.0)'
                    }
            }});
          }else{
            regionData.push({value:item.value,itemStyle: {
            color: 'rgba(250, 30, 102, 0.6)',
            emphasis: {
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.0)'
                    }
          }})
          }
  
          regionLabel.push(item.groupName)
        });
      }

      option.series[0].name = "";
      option.series[0].data = regionData;
      option.xAxis.data = regionLabel;

      if(regionLabel.length>10){
        regionData.push(0)
        regionLabel.push("")
        option.width =( regionLabel.length*50) +'px'
      }
      else{
        option.width = '100%'
      }
      console.log("ChartWidth="+option.width)
      this.regionsChartsOptions = option;
      this.part1.barRegionOption = option;
      
      await this.getPart1StoreBar();
    },
    async getPart1StoreBar(){
      const self = this;
      const option = this.getInspectLineOption();
      const regionData =[];
      const regionLabel =[];

      let content = [];
      if(this.part1.content && this.part1.content[this.part1.indexRegion]){
        if(this.part1.compareType == 'stores'){
            content =[this.part1.content[this.part1.indexRegion]];
        }
        else{
            const params = {};
            params.beginTs = self.params.beginTs;
            params.endTs = self.params.endTs;
            params.groupMode = 0;
            params.storeIds = this.part1.content[this.part1.indexRegion].list;
            params.inspectTagId = self.params.inspectId;
            params.order={
              direction: (this.part1.storeMode==1) ? this.part1.storeOrder : this.part1.table.order,
              property: (this.part1.storeMode==1) ? (this.part1.indexType==0?"numOfDangerous":this.part1.indexType==1?"numOfImproved":"numOfQualified"): this.part1.table.property,
            }
            params.filter={
              page:this.part1.table.page-1,
              size:this.part1.table.sizeNum
            }
            const storeResult = await this.getInspectStatsOverviewWithGroup(params);
            if (storeResult.errCode === 0) {
              const result = storeResult.data;
              if (result) {
                  content = result.content
                  this.part1.table.total = result.totalPages;
               //   console.log(result)
              }
            }
        }
        

        content.map((item,index) => {
          item.storeGroup = item.storeRegion.toString();
          item.storeType = item.storeBranchType.toString();
          item.storeSubmitters = item.submitters.toString();
          if(item.code=='')item.code='- -'
          if(item.storeGroup=='')item.storeGroup='- -'
          if(item.storeType=='')item.storeType='- -'
          let value = 0;
          var arr  = [item.numOfDangerous,item.numOfImproved,item.numOfQualified]
          if(this.part1.indexType==0){
              value = util.getPercentValue(arr, 0, 2)
          }
          else if(this.part1.indexType==1){
              value = util.getPercentValue(arr, 1, 2)
          }
          else if(this.part1.indexType==2){
              value =  util.getPercentValue(arr, 2, 2)
          }
          regionData.push({value,itemStyle: {
            color: '#7bd8eb',
          }})
          regionLabel.push(item.groupName)
        });
      }
      this.part1.storeTableData = content;
      option.series[0].name = "";
      option.series[0].data = regionData;
      option.xAxis.data = regionLabel;

      if(regionLabel.length>20){
        regionData.push(0)
        regionLabel.push("")
        option.width =( regionLabel.length*50) +'px'
      }
      else{
        option.width = '100%'
      }
      this.part1.barStoreOption = option;
    },
    async getPart2RegionBar() {
      console.log("getPart2RegionBar")
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.groupMode = 0;
      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      params.order={
         direction: this.part2.regionOrder,
         property:"averageScore"
      }
      if(this.part2.compareType=='stores'){
         params.storeIds  = this.part2.compareIds;
         params.groupIds  = this.part2.compareIds;
         params.groupMode = 0;
      }
      else if(this.part2.compareType=='area1'){
          params.storeIds =  this.part2.selStoreIdArr;
         params.groupIds  = this.part2.compareIds;
         params.groupMode = 1;
      }
      else if(this.part2.compareType=='area2'){
         params.storeIds =  this.part2.selStoreIdArr;
         params.groupIds  = this.part2.compareIds;
         params.groupMode = 2;
      }
      else if(this.part2.compareType=='storeType'){
         params.groupIds  = this.part2.compareIds;
         params.groupMode = 3;
      }
      else if(this.part2.compareType=='storeGroup'){
         params.groupIds  = this.part2.compareIds;
         params.groupMode = 3;
      }
      else if(this.part2.compareType=='users'){
         params.submitters  = this.part1.compareIds;
         params.groupMode = 5;
      }
      let totalReport = 0;
      let totalStandard = 0;
      params.filter = { page: 0, size: params.groupIds.length };
        const storeResult = await self.getInspectStatsOverviewWithGroup(params);
        if (storeResult.errCode === 0) {
          const result = storeResult.data;
          if (result) {
            this.part2.content = this.filterContent(result.content, 
                                  this.part2.compareType,
                                  this.part2.compareIds,
                                  this.part2.comapareLabels,
                                  this.part2.originArray);
            this.part2.content.forEach(function(item){
                  totalReport += item.numOfReport;
                  totalStandard +=  item.averageScore * item.numOfReport;
            })       
            this.part2.averageScore =  totalStandard>0? Math.round( (totalStandard) /totalReport):-9999;
            console.log("Leave FIlterContent")
            console.log(this.part2.content)
            this.part2.indexRegion = -1;
            this.drawPart2RegionBar();
          }
        }

    },
    async drawPart2RegionBar(){
      console.log("drawPart2RegionBar")
      const option = this.getInspectLineOption();
      const regionData =[];
      const regionLabel =[];
      if(this.part2.content){
        this.part2.content.map((item,index) => {
          let value = item.averageScore;
          if(this.part2.indexRegion<0 && value>0){
            this.part2.indexRegion = index;
          }
          
          if( this.part2.indexRegion == index){   
            regionData.push({value:value,itemStyle: {
                color: '#7bd8eb',
                emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(1, 0, 0, 0.0)'
                    }
            }});
          }else{
            regionData.push({value,itemStyle: {
            color: 'rgba(123 ,216, 235, 0.5)',
            emphasis: {
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.0)'
                    }
          }})
          }
  
          regionLabel.push(item.groupName)
        });
      }

      option.series[0].name = "";
      option.series[0].data = regionData;
      option.xAxis.data = regionLabel;
      if(regionLabel.length>20){
        regionData.push(0)
        regionLabel.push("")
        option.width =( regionLabel.length*50) +'px'
      }
      else{
        option.width = '100%'
      }
      option.yAxis[0].name  =  this.$t('statistics.score'),
      this.part2.barRegionOption = option;
      console.log(option)
      await this.getPart2StoreBar();
    },
    async getPart2StoreBar(){
      const self = this;
      const option = this.getInspectLineOption();
      const regionData =[];
      const regionLabel =[];
      console.log("getPart1StoreBar")
      let content = [];
      if(this.part2.content && this.part2.content[this.part2.indexRegion]){
        if(this.part2.compareType == 'stores'){
            content =[this.part2.content[this.part2.indexRegion]];
        }
        else{
            const params = {};
            params.beginTs = self.params.beginTs;
            params.endTs = self.params.endTs;
            params.groupMode = 0;
            params.storeIds = this.part2.content[this.part2.indexRegion].list;
            params.inspectTagId = self.params.inspectId;
            params.order={
              direction: this.part2.storeOrder,
              property:"averageScore"
            }
            params.filter={
              page:this.part2.table.page-1,
              size:this.part2.table.sizeNum
            }
            const storeResult = await this.getInspectStatsOverviewWithGroup(params);
            if (storeResult.errCode === 0) {
              const result = storeResult.data;
              if (result) {
                  content = result.content
                  console.log(result)
              }
            }
        }
        

        content.map((item,index) => {
          item.rank = parseInt(index)+1;
          item.compareTrend = this.$t('statistics.check'),
          item.storeGroup = item.storeRegion.toString();
          item.storeType = item.storeBranchType.toString();
          item.storeSubmitters = item.submitters.toString();
          if(item.code=='')item.code='- -'
          if(item.storeGroup=='')item.storeGroup='- -'
          if(item.storeType=='')item.storeType='- -'
          let value = item.averageScore;
          regionData.push({value,itemStyle: {
            color: '#7bd8eb',
          }})
          regionLabel.push(item.groupName)
        });
      }
      this.part2.storeTableData = content;
      option.series[0].name = "";
      option.series[0].data = regionData;
      option.xAxis.data = regionLabel;
      if(regionLabel.length>20){
        regionData.push(0)
        regionLabel.push("")
        option.width =( regionLabel.length*50) +'px'
      }
      else{
        option.width = '100%'
      }
      option.yAxis[0].name  =  this.$t('statistics.score'),
      this.part2.barStoreOption = option;
    },
     async getPart3RegionBar() {
      console.log("getPart3RegionBar")
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.groupMode = 0;
      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      params.order={
         direction: this.part3.regionOrder,
         property:"standardRate"
      }
      if(this.part3.compareType=='stores'){
         params.storeIds  = this.part3.compareIds;
         params.groupIds  = this.part3.compareIds;
         params.groupMode = 0;
      }
      else if(this.part3.compareType=='area1'){
         params.storeIds =  this.part3.selStoreIdArr;
         params.groupIds  = this.part3.compareIds;
         params.groupMode = 1;
      }
      else if(this.part3.compareType=='area2'){
         params.storeIds =  this.part3.selStoreIdArr;
         params.groupIds  = this.part3.compareIds;
         params.groupMode = 2;
      }
      else if(this.part3.compareType=='storeType'){
         params.groupIds  = this.part3.compareIds;
         params.groupMode = 3;
      }
      else if(this.part3.compareType=='storeGroup'){
         params.groupIds  = this.part3.compareIds;
         params.groupMode = 3;
      }
      else if(this.part3.compareType=='users'){
         params.submitters  = this.part1.compareIds;
         params.groupMode = 5;
      }
      
      let totalReport = 0;
      let totalStandard = 0;
      params.filter = { page: 0, size: params.groupIds.length };
        const storeResult = await self.getInspectStatsOverviewWithGroup(params);
        if (storeResult.errCode === 0) {
          const result = storeResult.data;
          if (result) {
            this.part3.content = this.filterContent(result.content, 
                                  this.part3.compareType,
                                  this.part3.compareIds,
                                  this.part3.comapareLabels,
                                  this.part3.originArray);
            this.part3.content.forEach(function(item){
                  totalReport += item.numOfReport;
                  totalStandard +=  item.numOfStandard;
            })       
            this.part3.averageScore =  totalStandard>0? Math.round( (100*totalStandard) /totalReport):-1;
            this.part3.indexRegion = -1;
            this.drawPart3RegionBar();
          }
        }

    },
    async drawPart3RegionBar(){
      console.log("drawPart2RegionBar")
      const option = this.getInspectLineOption();
      const regionData =[];
      const regionLabel =[];
      if(this.part3.content){
        console.log(this.part3.content)
        this.part3.content.map((item,index) => {
          let value = item.standardRate;
          if(this.part3.indexRegion<0 && value>0){
            this.part3.indexRegion = index;
          }
          
          if( this.part3.indexRegion == index){   
            regionData.push({value:value,itemStyle: {
                color: '#7bd8eb',
                emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(1, 0, 0, 0.0)'
                    }
            }});
          }else{
            regionData.push({value,itemStyle: {
            color: 'rgba(123 ,216, 235, 0.5)',
            emphasis: {
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.0)'
                    }
          }})
          }
  
          regionLabel.push(item.groupName)
        });
      }

      option.series[0].name = "";
      option.series[0].data = regionData;
      option.xAxis.data = regionLabel;
      if(regionLabel.length>20){
        regionData.push(0)
        regionLabel.push("")
        option.width =( regionLabel.length*50) +'px'
      }
      else{
        option.width = '100%'
      }
      option.yAxis[0].name  =  this.$t('statistics.score'),
      this.part3.barRegionOption = option;
      console.log(option)
      await this.getPart3StoreBar();
    },
    async getPart3StoreBar(){
      const self = this;
      const option = this.getInspectLineOption();
      const regionData =[];
      const regionLabel =[];
      console.log("getPart1StoreBar")
      let content = [];
      if(this.part3.content && this.part3.content[this.part3.indexRegion]){
        if(this.part3.compareType == 'stores'){
            content =[this.part3.content[this.part3.indexRegion]];
        }
        else{
            const params = {};
            params.beginTs = self.params.beginTs;
            params.endTs = self.params.endTs;
            params.groupMode = 0;
            params.storeIds = this.part3.content[this.part3.indexRegion].list;
            params.inspectTagId = self.params.inspectId;
            params.order={
              direction: this.part3.storeOrder,
              property:"standardRate"
            }
            params.filter={
              page:this.part3.table.page-1,
              size:this.part3.table.sizeNum
            }
            const storeResult = await this.getInspectStatsOverviewWithGroup(params);
            if (storeResult.errCode === 0) {
              const result = storeResult.data;
              if (result) {
                  content = result.content
                  console.log(result)
              }
            }
        }
        

        content.map((item,index) => {
          item.rank = parseInt(index)+1;
          item.compareTrend = this.$t('statistics.check'),
          item.storeGroup = item.storeRegion.toString();
          item.storeType = item.storeBranchType.toString();
          item.storeSubmitters = item.submitters.toString();
          if(item.code=='')item.code='- -'
          if(item.storeGroup=='')item.storeGroup='- -'
          if(item.storeType=='')item.storeType='- -'
          let value = item.standardRate;
          regionData.push({value,itemStyle: {
            color: '#7bd8eb',
          }})
          regionLabel.push(item.groupName)
        });
      }
      this.part3.storeTableData = content;
      option.series[0].name = "";
      option.series[0].data = regionData;
      option.xAxis.data = regionLabel;
      if(regionLabel.length>20){
        regionData.push(0)
        regionLabel.push("")
        option.width =( regionLabel.length*50) +'px'
      }
      else{
        option.width = '100%'
      }
      option.yAxis[0].name  =  this.$t('statistics.score'),
      this.part3.barStoreOption = option;
    },
    getRegionPieOption() {
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          textStyle: {
            align: 'left'
          },
          backgroundColor: this.echartBackground
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        color:['#f11e66', '#f57848', '#8fd92e'],
        series: [
          {
            name: this.$t('overview.itemsAssessment'),
            type: 'pie',
            radius: ['70%', '85%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [],
            itemStyle: {
              borderWidth:5,
              borderColor:'#fff'
            }
          }
        ]
      };
      return pieOption;
    },
    async clickPart1Pie(event){
      if(this.part1.pieOption.series[0].data[event.dataIndex].value>0){
       this.part1.indexType =event.dataIndex
       this.part1.indexRegion =  -1;
        await this.drawPart1RegionBar();
      }
    },
    async clickPart1Bar(event){
      this.part1.indexRegion = event.dataIndex;
      await this.drawPart1RegionBar();
    },
      async clickPart2Bar(event){
      this.part2.indexRegion = event.dataIndex;
      await this.drawPart2RegionBar();
    },
      async clickPart3Bar(event){
      this.part3.indexRegion = event.dataIndex;
      await this.drawPart3RegionBar();
    },

    handleRegionsChange(val) {
      const self = this;
      self.curRegion = val;
      const option = self.getInspectLineOption();
      const filterResult = self.jsonArrayHasSpecifiedValue(self.curRegion, self.regionDataList);

      const regionData1 = [];
      const regionData2 = [];
      filterResult.forEach((item, index) => {
        const filterRegions = item.regions;
        filterRegions.forEach((_item, _index) => {
          let sumOfReports = 0;
          let sunOfExcellent = 0;
          let sumOfQualified = 0;
          let percentRegion = 0;
          sunOfExcellent += _item.numOfExcellent;
          sumOfQualified += _item.numOfQualified;
          sumOfReports += _item.numOfExcellent + _item.numOfQualified + _item.numOfImproved + _item.numOfDangerous;
          if (sumOfReports === 0) {
            percentRegion = 0;
          } else {
            const percent = (sunOfExcellent + sumOfQualified) / sumOfReports * 100;
            percentRegion = percent.toFixed(2);
          }
          if (_index === 0) {
            regionData1.push(percentRegion);
            option.series[0].name = _item.region;
          } else {
            regionData2.push(percentRegion);
           // option.series[1].name = _item.region;
          }
        });
      });
      option.series[0].data = regionData1;
      //option.series[1].data = regionData2;
      self.regionsChartsOptions = option;
    },

    initData() {
      this.params = SearchConditionUtil.getSearchCondition(this.path);
      this.params.filter = { page: 0, size: this.sizeNumStore };
    },

    adjustChart() {
      this.$refs.itemsPie && this.$refs.itemsPie.resize();
      this.$refs.storeChart && this.$refs.storeChart.resize();
    },

    emitSearch({ searchParams, dateRangeList, regionI, regionII, regionMode, storePatrolLists, timeMode }) {
      console.log("Emit Search");
      this.part2.standardScore=-9999;
      this.part3.standardScore=-9999;
      this.doGetAssessmentStandardScore();
      this.params = searchParams;
      console.log(this.params)
      this.daysRangeList = dateRangeList;
      this.curRegionI = regionI;
      this.curRegionII = regionII;
      this.regionMode = regionMode;
      this.timeMode = timeMode;
      this.storePatrolLists = storePatrolLists;
      this.curCountry = this.params.curCountry;
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.ifSaveParams && this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
      this.ifSaveParams = true;
      this.searchData();
    },

    exportPdf(storeNameStr, storeGroupStr, storeTypeStr) {
      this.isexportPDF = true;
      this.storeNameStr = storeNameStr;
      this.storeGroupStr = storeGroupStr;
      this.storeTypeStr = storeTypeStr;
      this.handleExportReport();
    },

    handleRegionPageAndSizeChange(pageObj) {
      const self = this;
      self.pageRegion = pageObj.page;
      self.sizeNumRegion = pageObj.size;
      self.regionFilter = { page: self.pageRegion - 1, size: self.sizeNumRegion };
      self.getInspectStatsOverviewOfRegionTable();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
    },

    handleRegionSortChange(order, defaultSort) {
      this.defaultRegionSort = defaultSort;
      this.regionOrder = order;
      this.regionFilter = {
        page: this.pageRegion - 1,
        size: this.sizeNumRegion
      };
      this.getInspectStatsOverviewOfRegionTable();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
    },

    handleStorePageAndSizeChange(pageObj) {
      this.sizeNumStore = pageObj.size;
      this.pageStore = pageObj.page;
      this.storeFilter = { page: this.pageStore - 1, size: this.sizeNumStore };
      this.getInspectStatsOverviewOfStore();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
    },

    handleStoreSortChange(order, defaultSort) {
      this.defaultStoreSort = defaultSort;
      this.storeOrder = order;
      this.storeFilter = {
        page: this.pageStore - 1,
        size: this.sizeNumStore
      };
      this.getInspectStatsOverviewOfStore();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
    },

    setDefaultSortAndPage(paramsObj) {
      this.defaultSort = paramsObj.defaultSort;
      this.order = this.params.order = paramsObj.order;
      this.sizeNum = paramsObj.filter.size;
      this.page = paramsObj.filter.page + 1;
    },
    async setPart1Type(index){
      if(this.part1.pieOption.series[0].data[index].value>0){
        this.part1.indexType = index;
        this.part1.indexRegion =  -1;
        await this.drawPart1RegionBar();
      }
    },
    getInspectTagStandardScore(){//取得巡檢表達標分數
      const self = this;
      return new Promise((resolve, reject) => {
         GetInspectTagList({includeRule:true}).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    changePart1RegionOrder(){
      
      if(this.part1.regionOrder == 'desc'){
          this.part1.regionOrder = 'asc'
      }
      else{
        this.part1.regionOrder = 'desc'
      }
      console.log("changePart1RegionOrder "+  this.part1.regionOrder )
      this.dataGetPart1();
    },
    changePart1StoreOrder(){
      if(this.part1.storeOrder == 'desc'){
          this.part1.storeOrder = 'asc'
      }
      else{
        this.part1.storeOrder = 'desc'
      }
      this.getPart1StoreBar();
    },
    changePart2RegionOrder(){
      if(this.part2.regionOrder == 'desc'){
          this.part2.regionOrder = 'asc'
      }
      else{
        this.part2.regionOrder = 'desc'
      }
      this.dataGetPart2();
    },
    changePart2StoreOrder(){
      if(this.part2.storeOrder == 'desc'){
          this.part2.storeOrder= 'asc'
      }
      else{
        this.part2.storeOrder = 'desc'
      }
      this.getPart2StoreBar();
    },
     changePart3RegionOrder(){
      if(this.part3.regionOrder == 'desc'){
          this.part3.regionOrder = 'asc'
      }
      else{
        this.part3.regionOrder = 'desc'
      }
      this.dataGetPart3();
    },
    changePart3StoreOrder(){
      if(this.part3.storeOrder == 'desc'){
          this.part3.storeOrder = 'asc'
      }
      else{
        this.part3.storeOrder = 'desc'
      }
      this.getPart3StoreBar();
    },
    async doGetAssessmentStandardScore(){
      console.log("tag-doGetAssessmentStandardScore")
      let tagList = await this.getInspectTagStandardScore();
      console.log("tagList:",tagList);
      let filterTag = tagList.data.filter((tag)=>{
        return tag.id == this.params.inspectId;
      });
      console.log("@@filterTag:",filterTag);
      if(filterTag.length>0){
        let inspectSet=filterTag[0].inspectSettings.filter((setting)=>{
          return setting.name == "standardScore";
        });

        if(inspectSet.length>0){
          console.log("@@inspectSettings:",inspectSet[0]);
          if(inspectSet[0].value!=null){
            this.part3.standardScore =inspectSet[0].value
            this.part2.standardScore =inspectSet[0].value
           // this.standardRate =inspectSet[0].value;
          }else{
            this.standardRate = "- -";
          }
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";
  .statistics-container{
    .export-header{
      min-height: 100px;
      margin: 0 20px 20px 20px;
      border: 1px solid $border;
      background-color: #fff;
      padding: 10px 30px;
      color: $black;
      text-align: left;
      font-size: calc(14/1920*100vw);
      p{
        margin:10px 0;
        display: flex;
        .content-header{
          flex:1;
        }
      }
    }

    .statistics-content{
      margin-left: calc(30/1920*100vw);
      margin-right: calc(30/1920*100vw);
      padding-left:0px;
      padding-right:0px;
    }
    .subtitle-head{
        margin-left:20px;
        margin-top:20px;
        height: 22px;
        padding-right:100px;
        border-left: solid 4px #2c90d9;
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        padding-left:12px;
        span{
            width:150px;  
            font-family: NotoSansCJKTC;
            font-size: 15px;
            text-align: left;
            color: #484848;
        }
    
     }
    .evalution-pct {
        .pct-content {
          display:flex;
          flex-direction:row;
          margin-left:5px;
          padding-top: 50px;
          padding-bottom: 5px;
          width: 100%;
          justify-content:flex-start;
          text-align: center;
          .pct-panel {
            height: 220px;
            width: 220px;
            border-radius: 50%;
            border-color:#dae4eb;
            border-style:dashed dashed dashed dashed; 
            display:flex;
            justify-content:center;
            align-items: center;
            .inner{
              width: 100%;
              height: 100%;
                position:absolute;
                height: 120px;
                width: 120px;
                left:55px;
                right:55px;
                border-radius: 50%;
                border-color:#dae4eb;
                border-style:dashed dashed dashed dashed; 
            }
            .chart-content {
              width: 100%;
              height: 100%;
            }
          }
          .pct-nums {
            margin-left:32.5px;
            /*margin-left: calc(75 / 1920 * 100vw);*/
            font-size: calc(15 / 1920 * 100vw);
            display: flex;
            width:45%;
            flex-direction:column;
            justify-content: center;
            @media screen and (max-width: 1280px) {
              padding: 0 0;
            }
             .selected-labels {
               background-color:#f2f9fe;
               display: flex;
              flex-direction:row;
              padding-left:10px;
              padding-right:10px;
              height:40px;
              font-size: calc(15 / 1920 * 100vw);
              text-align: left;
              align-items:center;
              .excellent_nums {
                   color: #006ab7;
                flex-grow:1;
                text-align:right;
                margin-left: calc(20 / 1920 * 10vw);
                font-size: calc(15 / 1920 * 100vw);
                line-height: calc(14 / 1920 * 100vw);
              }
              .excellent_labels {
                color: #006ab7;
                line-height: 12px;
                font-size: 15px;
                .labels {
                  height: 10px;
                  width: 10px;
                  display: inline-block;
                  margin-right: calc(10 / 1920 * 100vw);
                }
                .label-desc {
                  color: #006ab7;
                  font-weight: 500;
                  font-size: 15px;
                }
                .label-0 {
                  background-color: $dangerous;
                }
                .label-1 {
                  background-color: $improved;
                }
                .label-2 {
                  background-color: $pass;
                }
              }
            }
            .content-labels {
              display: flex;
              flex-direction:row;
              padding-left:10px;
              padding-right:10px;
              height:40px;
               align-items:center;
              font-size: calc(15 / 1920 * 100vw);
              text-align: left;
              .excellent_nums {
                flex-grow:1;
                text-align:right;
                margin-left: calc(20 / 1920 * 10vw);
                font-size: calc(15 / 1920 * 100vw);
                line-height: calc(14 / 1920 * 100vw);
              }
              .excellent_labels {
                line-height: 12px;
                font-size: 15px;
                .labels {
                  height: 10px;
                  width: 10px;
                  display: inline-block;
                  margin-right: calc(10 / 1920 * 100vw);
                }
                .label-desc {
                  color: #484848;
                  font-weight: 500;
                  font-size: 15px;
                }
                .label-0 {
                  background-color: $dangerous;
                }
                .label-1 {
                  background-color: $improved;
                }
                .label-2 {
                  background-color: $pass;
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
      }

    .region-overview{
     
      .division{
        display: flex;
        align-items:flex-end;
        height:135px;
        .text-area{
          height:100%;
          display:flex;
          margin-left:20px;
          padding-top:20px;
          flex-direction:column;
          align-items:flex-start;
          flex-grow:1;
          .top{
            span{
              font-size:48px;
              color:#484848;
            }
            .unit{
              font-size:15px;
              color:#484848;
            }
          }
          .subtitle{
            margin-top:10px;
          }
          .subtitle span{
            font-size:15px;
            color:#484848;
          }
        }
        .image-area{
          width: 115px;
          height:115px;
          margin-bottom:5px;
          margin-right:10px;
        }
         .line{
          background-color:#00000030;
          width: 1px;
          height: 94px;
          margin-bottom:20px;
          
      }

      }
    }

    .region-chart{
      background-color: #fff;
      padding-left:24px;
      padding-right:24px;
      margin-right: calc(30/1920*100vw);
      border: 1px solid $border;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .region-header{
        border-bottom: 1px solid $border;
        padding-top:22px;
        padding-bottom:22px;
        margin-bottom: 30px;
        padding-right: 0;
      }
      .evalution-pct {
        width:100%;
        background-color: hotpink;
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
                .label-1 {
                  background-color: $improved;
                }
                .label-2 {
                  background-color: $pass;
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
      }
      .charts-content{
        padding:0 calc(30/1920*100vw);
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
        padding-right: 0;
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
        padding-right: 0;
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
