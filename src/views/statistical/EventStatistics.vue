<template>
  <div>
    <div class="el-overview-content">
      <el-col :span="24">
        <search-component
          ref="eventSearch"
          :default-sort="defaultSort"
          isInspectItem=true
          path="eventStatistics"
          @emitSearch = "emitSearch"
          @exportPdf = "exportPdf"
          @changeDefaultSort="setDefaultSortAndPage"/>
      </el-col>
      <el-col :span="24" class="el-overview">
        <el-row class="amout_row">
          <el-col :span="24" class="kpi-list">
            <div class="title">{{ $t('statistics.event.eventProcessStatus') }}</div>
          </el-col>
          <el-col :span="24" class="amount_region">
            <div class="region-area"  v-for="(item,index) in eventKPIs" :key="index">
              <div class="num-area">
                <div style="display:flex;height:84.5px;">
                  <div class="number">{{ item.eventNum }}
                    <span v-if="index!=3" style="font-size:15px;margin-left:5px;">{{$t('statistics.event.unit')}}</span>
                    <span v-else style="font-size:15px;margin-left:5px;">%</span>
                  </div>
                </div>
                <div class="description">{{ item.eventTitle}}</div>
              </div>
              <div class="img-area">
                <img v-if="index==0" src="../../../static/img/statistics/ic_totalEvent.svg" style="width:84.8;height:79.8px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else-if="index==1" src="../../../static/img/statistics/ic_inprocess.svg" style="width:108.5;height:65.6px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else-if="index==2" src="../../../static/img/statistics/ic_processed.svg" style="width:111.8;height:74.5px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else src="../../../static/img/statistics/ic_compeleted.svg" style="width:115.5;height:74px;align-items:flex-end;padding-bottom:10.5px;" />
              </div>
              <div v-if="index!=3" class="split-line"></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.eventRank') }}</div>
              <TypeSelectArea
                  path="eventStatistics"
                  :allow-all=true
                  :region-array1="params.curProvince"
                  :region-array2="params.curCity"
                  :cur-store-group="params.curStoreGroup"
                  :cur-store-type="params.curStoreType"
                  :cur-stores="params.curStore"
                  :cached-params="params"
                  :cur-country="curCountry"
                  @emitTypeChanged="emitTypeChanged"
              ></TypeSelectArea>
              <!--<AreaSelected
                path="eventStatistics"
                allow-all="true"
                :cached-params="params"
                :cur-country="curCountry"
                @emitTypeChanged="emitTypeChanged"
              ></AreaSelected>-->
            </div>
            <div class="barchart-area">
              <v-chart ref="itemsChart1" :auto-resize="true" :options="barchartOption" class="chart-content" @click="barchartClick"/>
            </div>
            <div class="table-area">
              <div class="sec-head">
                <div class="title">{{ $t('statistics.event.storeEvent') }}</div>
                <div class="operation-btns">
                  <div class="switch-btn">
                    <el-button
                    class="mode-btn"
                    :class="{'active-mode-btn' :viewMode==0}"
                    @click="onSwitchMode(0)"
                    >{{ $t('statistics.event.tableMode')}}</el-button>
                    <el-button
                      class="mode-btn"
                      :class="{'active-mode-btn' :viewMode==1}"
                      @click="onSwitchMode(1)"
                    >{{ $t('statistics.event.imageMode')}}</el-button>
                  </div>
                  <delay-button
                    :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                    style="margin-left:32px;background-color:#FFF;color:#006ab7;"
                    type="default"
                    size="mini"
                    @click="export2Excel"
                  >
                    <div class="button-area">
                      <img :src="exportPng" class="icon-excel">
                      <span>{{ $t('eventView.exportReport') }}</span>
                    </div>
                  </delay-button>
                </div>
              </div>
              <div style="margin-top:20.5px;">
                <table-only
                  ref="elTP"
                  :column-data="eventInfoData"
                  :table-data="eventTableData"
                  :total="total"
                  :highlight-current-row= "true"
                  :pagesize="sizeNum"
                  :current-page="page"
                  :is-event = "false"
                  :default-sort = "defaultSort"
                  :allowRowExpand = "true"
                  :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}" 
                  :tableHeight = "726"
                  layout = "prev,pager,next,sizes"
                  expand-component = "IncepItemTop5"
                  :expandCompProperties = "componentsProps"
                  @handleChange="handlePageAndSizeChange"
                  @sortChange="handleSortChange"
                  @onCellClick = "onEvenListNumClick"
                />
              </div>
              <div style="width:100%; margin-top:12px;height:31px;">
              <tbl-pagination-only
                :total="total"
                :current-page="page"
                :page-size="sizeNum"
                layout = "prev,pager, next,sizes,slot"
                @sizeChange="handlePageAndSizeChange"
                @currentChange="handleCurrentChange"
              />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="second-row">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.incepItemEvent') }}</div>
              <TypeSelectArea
                  path="eventStatistics"
                  :allow-all=true
                  :region-array1="params.curProvince"
                  :region-array2="params.curCity"
                  :cur-store-group="params.curStoreGroup"
                  :cur-store-type="params.curStoreType"
                  :cur-stores="params.curStore"
                  :cached-params="params"
                  :cur-country="curCountry"
                  @emitTypeChanged="emitTypeChanged2"
              ></TypeSelectArea>
              <!--<AreaSelected
                path="eventStatistics"
                allow-all="true"
                :cached-params="params"
                :cur-country="curCountry"
                @emitTypeChanged="emitTypeChanged2"
              ></AreaSelected>-->
            </div>
            <div class="pie-area">
              <div class="pct-panel">
                <div class="inner"/>
                  <v-chart
                      ref="pieChartRef"
                      :auto-resize="true"
                      :options="eventSourceOptions"
                      class="chart-content"
                  />
              </div>
              <div style="margin-top: 40px;width: calc(300/1440*100vw);margin-left:calc(152/1440*100vw);">
              <div v-for="(item,index) in sourcePerArray" :key="index">
                <div :class="(index==selEventItem) ? 'pie-label-area-active':'pie-label-area'" @click="onClickEventItem(item,index)">
                    <div class="pie-color" :style="{backgroundColor:pieColorList[index]}"></div>
                    <div class="pei-item-name">{{item.itemName}}</div>
                    <div class="pei-item-num">{{item.percentage}}%</div>
                    <div class="pei-item-num">{{item.amount}}次</div>
                </div>
              </div> 
              </div>
            </div>
            <div class="table-area">
              <div class="sec-head">
                <div class="title">{{ selEventItemName+$t('statistics.event.envirmentRate') }}</div>
                <div class="operation-btns">
                  <delay-button
                    :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                    style="margin-left:32px;width:152px;"
                    type="primary"
                    size="mini"
                    @click="onSeeAllIncepEventClick"
                  >
                    <div class="button-area">
                      <img :src="seeAllsvg" class="icon-excel">
                      <span>{{ $t('statistics.event.seeAllIncepEvent') }}</span>
                    </div>
                  </delay-button>
                  <delay-button
                    :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                    style="margin-left:32px;background-color:#FFF;color:#006ab7;"
                    type="default"
                    size="mini"
                    @click="export2Excel_eventItem"
                  >
                    <div class="button-area">
                      <img :src="exportPng" class="icon-excel">
                      <span>{{ $t('eventView.exportReport') }}</span>
                    </div>
                  </delay-button>
                </div>
              </div>
              <div style="margin-top:20.5px;">
                <table-pagination
                  ref="elTP"
                  :column-data="eventItemTable.column_data"
                  :table-data="eventItemTable.table_data"
                  :total="eventItemTable.total"
                  :highlight-current-row= "true"
                  :pagesize="eventItemTable.sizeNum"
                  :current-page="eventItemTable.page"
                  :is-event = "false"
                  :default-sort = "eventItemTable.defaultSort"
                  :allowRowExpand = "false"
                  layout = "prev,pager,next,sizes"
                  @handleChange="handlePageAndSizeChange_eventItem"
                  @sortChange="handleSortChange_eventItem"
                  @onCellClick = "onEvenInvolveStoreClick"
                />
              </div>
            </div>
            <div v-if="showInvolveTableArea" style="margin-top:100px;height: auto;">
              <div style="height: 1px;margin-left:calc(36/1440*100vw);margin-right: calc(24/1440*100vw);border-bottom: solid 1px #acaeb1;"></div>
              <div class="table-area" style="">
                <div class="sec-head">
                  <div class="title">{{ selEventItemName+$t('statistics.event.eventInvolveStores') }}</div>
                  <div class="operation-btns" style="width:calc(300/1440*100vw)">
                    <div class="switch-btn">
                      <el-button
                      class="mode-btn"
                      :class="{'active-mode-btn' :viewMode_eventStores==0}"
                      @click="onSwitchMode_eventStores(0)"
                      >{{ $t('statistics.event.tableMode')}}</el-button>
                      <el-button
                        class="mode-btn"
                        :class="{'active-mode-btn' :viewMode_eventStores==1}"
                        @click="onSwitchMode_eventStores(1)"
                      >{{ $t('statistics.event.imageMode')}}</el-button>
                    </div>
                    <delay-button
                      :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                      style="margin-left:32px;background-color:#FFF;color:#006ab7;"
                      type="default"
                      size="mini"
                      @click="export2Excel_eventStores"
                    >
                      <div class="button-area">
                        <img :src="exportPng" class="icon-excel">
                        <span>{{ $t('eventView.exportReport') }}</span>
                      </div>
                    </delay-button>
                  </div>
                </div>
                <div style="margin-top:20.5px;">
                  <table-pagination
                    ref="elTP"
                    :column-data="eventInvolveTable.column_data"
                    :table-data="eventInvolveTable.table_data"
                    :total="eventInvolveTable.total"
                    :highlight-current-row= "true"
                    :pagesize="eventInvolveTable.sizeNum"
                    :current-page="eventInvolveTable.page"
                    :is-event = "false"
                    :default-sort = "eventInvolveTable.defaultSort"
                    :allowRowExpand = "true"
                    layout = "prev,pager,next,sizes"
                    expand-component = "EventCommentList"
                    :expandCompProperties = "componentsProps_EventCommentList"
                    @handleChange="handlePageAndSizeChange_eventStores"
                    @sortChange="handleSortChange_eventStores"
                  />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </div>
    <div v-if="ispdf" class="el-overview-content">
      <el-col id="pdfDom" ref="printPDF" :span="24" class="el-overview" style="padding:40px 20px;width:1150px;">
        <div :span="24" class="export-header">
          <p>
            <span>{{ $t('remotePatrol.storeSelect') }}：</span>
            <span class="content-header">{{ storeNameStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.storeGroup') }}：</span>
            <span class="content-header">{{ storeGroupStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.storeType') }}：</span>
            <span class="content-header">{{ storeTypeStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.time') }}：</span>
            <span class="content-header">{{ storeDateValue }}</span>
          </p>
        </div>
        <el-row class="first-row">
          <el-col :span="24">
            <img :src="pdfSrc">
          </el-col>
        </el-row>
        <div class="no-print">
          <el-row id="imgTest" class="first-row" style="width:1045px;">
            <el-col :span="24" class="kpi-list" style="background-color:#ffffff;">
              <div class="title">{{ $t('overview.eventGraph') }}</div>
            </el-col>
            <el-col :span="3" class="kpi-list" style="background-color:#ffffff;">
              <div class="kpi-content">
                <div v-for="(item,index) in eventKPIs" :key="index" class="event-list">
                  <div class="event-title">{{ item.eventTitle }}</div>
                  <div class="event-num">{{ item.eventNum }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="14" class="store-events" style="background-color:#ffffff;">
              <div class="region-result">
                <div class="charts-content">
                  <v-chart
                    ref="storeEventRef"
                    :options="storeEventsOptions"
                    :auto-resize="true"
                    class="result-content"/>
                </div>
              </div>
            </el-col>
            <el-col :span="7" class="source-list" style="background-color:#ffffff;">
              <div class="pct-content">
                <div class="pct-panel">
                  <v-chart
                    ref="pieChartRef"
                    :auto-resize="true"
                    :options="eventSourceOptions"
                    class="chart-content"/>
                </div>
                <div class="pct-nums">
                  <div
                    v-for="(item, index) in sourcePerArray"
                    :class="lang === 'en' ? 'en-label' : ''"
                    :key="index"
                    class="content-labels">
                    <div class="excellent_nums">{{ item.percent }}%</div>
                    <div class="excellent_labels">
                      <span :class="`label-` + index" class="labels excellent-label"/>
                      <span class="label-desc">{{ item.type }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row class="second-row" style="padding-bottom:20px;">
          <el-col :span="24" class="items-title">
            <span class="title">{{ $t('overview.eventList') }}</span>
          </el-col>
          <el-col :span="24" class="event-table">
            <div class="table">
              <div class="event-content">
                <el-table
                  :data="allEventData"
                  :highlight-current-row="true"
                  :default-sort = "defaultSort"
                  :header-cell-class-name="headerClass"
                  :cell-class-name="cellClass"
                  :row-class-name="rowClass"
                  empty-text="无数据"
                  align="left"
                  stripe
                  border
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column
                    v-for="(_item,_index) in eventInfoData"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="_item.pdfwidth"
                    :sortable="_item.sortable"/>
                  <el-table-column
                    :label="$t('overview.remotePatrol')"
                    :min-width="lang.indexOf('zh') !== -1 ? '8% ': '9%'"
                    sortable="custom"
                    prop="RemoteStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.RemoteStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    :min-width="lang.indexOf('zh') !== -1 ? '8%' : '9%'"
                    sortable="custom"
                    prop="OnsiteStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.OnsiteStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    :min-width="lang.indexOf('zh') !== -1 ? '8%' : '9%'"
                    sortable="custom"
                    prop="VideoStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper video">
                        <el-tag size="small" color="#fccc3f1a">{{ scope.row.VideoStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <div slot="empty">
                    <div>
                      <i class="iconfont icon-zhengque empty-data-icon"/>
                      <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">
                        {{ $t('overview.noData') }}
                      </span>
                    </div>
                  </div>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </div>
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
import ECharts from 'vue-echarts';
import { mapGetters } from 'vuex';
import util from '@/common/util.js';
import { getEventStatsOverStoreV2, getEventStatsOverStore,getEventStatsOverWithGroup } from '@/api/eventOverview';
import { getInspectItemStatsOverview, getInspectItemStatsOverGroup, getInspectStatsItemOverStore} from '@/api/inspectOverview';
import html2canvas from 'html2canvas';
import Lodash from 'lodash';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TablePagination from '@/components/TablePagination_V2';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import AreaSelected from '@/components/AreaSelected';
import TypeSelectArea from '@/components/TypeSelectArea';
import vm from '@/main.js';
export default {
  name: 'EventStatistics',
  components: {
    DialogPop,
    DelayButton,
    'v-chart': ECharts,
    SearchComponent,
    TablePagination,
    AreaSelected,TypeSelectArea,
    TableOnly,
    TblPaginationOnly
  },
  mixins: [resize],
  data() {
    return {
      ispdf: false,
      pdfSrc: '',
      curCountry:"-1",
      compareIds:[],
      comapareLabels:[],
      compareType:'stores',
      areaMode:[{key:'area1',value:1},{key:'area2',value:2},{key:'stores',value:0},{key:'storeGroup',value:4},{key:'storeType',value:3}],
      barchartOption:null,
      viewMode:0,
      storeNameStr: '',
      storeGroupStr: '',
      storeTypeStr: '',
      storeDateValue: '',
      htmlTitle: this.$t('overview.htmltopdfD'),
      eventKPIs: [
        {
          eventTitle: this.$t('statistics.event.eventTotal'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('statistics.event.inprocessEvent'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('statistics.event.processedEvent'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('statistics.event.completedRate'),
          eventNum: 0
        }
      ],
      sourceLegend: [],
      statusLegend: [
        {
          'type': this.$t('overview.pending'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.done'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.closed'),
          'percent': '0%'
        }
      ],
      itemsPerArray: [],
      params: {},
      poperClass: 'date-picker-poper',
      selectpoperClass: 'select-poper',
      lang: this.$i18n.locale,
      timeMode: 1, // weekly mode
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
      storeEventLegend: ['日期', this.$t('overview.createdEvent'), this.$t('overview.processedEvent'), this.$t('overview.closedEvents')],
      echartAxiasColor: '#e3e9f4',
      echartBackground: 'rgba(30,34,52,0.75)',
      exportPng: require('../../../static/img/excel.png'),
      allEventTableData:[],
      eventBarChartData: [],
      eventTableData: [],
      eventInfoData: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '70',
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
          'prop': 'numOfTotal',
          'label': this.$t('statistics.event.sumEvents'),
          'sortable': 'custom',
          'width': '65',
          'maxWidth': '100',
          'pdfwidth': '11%',
          'isCellClick':true
        },
        {
          'prop': 'numOfUnprocessed',
          'label': this.$t('statistics.event.numUnprocessEvents'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'numOfInprocess',
          'label': this.$t('statistics.event.numProcessEvents'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'numOfProcessed',
          'label': this.$t('statistics.event.numClosedEvents'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'numOfRejected',
          'label': this.$t('statistics.event.numReturndEvents'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'completedRateStr',
          'label': this.$t('statistics.event.completedRate'),
          'sortable': 'custom',
          'width': '60',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'detail',
          'label': this.$t('statistics.event.commonEvent'),
          'sortable': 'false',
          'width': '90',
          'maxWidth': '140',
          'pdfwidth': '12%',
          'isExpand':true
        }
      ],
      order: {
        direction: 'descending',
        property: 'numOfTotal'
      },
      page: 1,
      sizeNum: 10,
      total: 0,
      allEventData: [],
      headerClass: {
      fontSize:'#12px',
      backgroundColor:'#f7f9fa',
      height: '75px',
      border: 'none'
    },
      cellClass: 'cell-class',
      rowClass: 'row-class',
      hasNoData: false,
      fontFamily: 'NotoSansCJKTC-Medium, Roboto, Microsoft YaHei',
      ifSaveParams: false,
      defaultSort: { prop: 'numOfTotal', order: 'ascending' },
      isLoading: true,
      componentsProps:{beginTs:this.$moment().subtract(29, 'days').startOf('d').toDate(),endTs: this.$moment().endOf('d').toDate()},
      eventItemTable:{
        order:{direction: 'descending',property: 'numOfTotal'},
        column_data:[
          {
            'prop': 'groupName',
            'label': this.$t('statistics.event.eventItemGroup'),
            'sortable': false,
            'width': '100',
            'maxWidth': '100',
            'pdfwidth': '11%'
          },
          {
            'prop': 'itemName',
            'label': this.$t('statistics.event.eventItemName'),
            'sortable': false,
            'width': '200',
            'maxWidth': '200',
            'pdfwidth': '11%'
          },
          {
            'prop': 'numOfUnqualified',
            'label': this.$t('statistics.event.numOfUnqualified'),
            'sortable': true,
            'width': '70',
            'maxWidth': '70',
            'pdfwidth': '11%'
          },
          {
            'prop': 'percentage',
            'label': this.$t('statistics.event.UnqualifiedpPercentage'),
            'sortable':true,
            'width': '70',
            'maxWidth': '70',
            'pdfwidth': '11%'
          },
          {
            'prop': 'numOfStore',
            'label': this.$t('statistics.event.numOfStores'),
            'sortable': true,
            'width': '70',
            'maxWidth': '70',
            'pdfwidth': '11%',
            'isCellClick':true
          }
        ],
        table_data:[],
        itemAllData:[],
        page:1,
        sizeNum:10,
        total:0,
        defaultSort: { prop: 'numOfUnqualified', order: 'ascending' },
      },
      pieColorList : ['#5274bb', '#7b9feb', '#7bd8eb','#4de197','#99ee3a'],
      peiDataSource:[],
      compareIds2:[],
      comapareLabels2:[],
      compareType2:'stores',
      selEventItem:0,
      selEventItemName:'',
      selEventItemIds:[],
      allEventItemIds:[],
      seeAllsvg:require('../../../static/img/statistics/ic_viewAll.svg'),
      eventInvolveTable:{
        order:{direction: 'acsending',property: 'numOfTotal'},
        column_data:[
          {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'name',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'width': '80',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeRegionStr',
          'label': this.$t('statistics.event.storeGroup'),
          'sortable': false,
          'width': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeBranchTypeStr',
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
          'prop': 'submitter',
          'label': this.$t('statistics.event.submitter'),
          'sortable': 'custom',
          'width': '65',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'rankByNumOfUnqualified',
          'label': this.$t('statistics.event.rankByNumOfUnqualified'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%'
        },
        {
          'prop': 'percentageStr',
          'label': this.$t('statistics.event.UnqualifiedpPercentage'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%'
        },
        {
          'prop': 'numOfUnqualified',
          'label': this.$t('statistics.event.numOfUnqualified'),
          'sortable': 'custom',
          'width': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isExpand':true,
        }
        ],
        table_data:[],
        itemAllData:[],
        page:1,
        sizeNum:10,
        total:0,
        defaultSort: { prop: 'rankByNumOfUnqualified', order: 'ascending' },
      },
      viewMode_eventStores:0,
      eventInvolveItemId:null,
      showInvolveTableArea:false,
      componentsProps_EventCommentList:{},
      gloableEventData:[],
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        this.ifSaveParams = false;
        this.initData();
      }
    }
  },

  created() {
    this.initData();
  },

  beforeDestroy() {
    this.$refs.pieChartRef && this.$refs.pieChartRef.dispose();
    this.$refs.storeEventRef && this.$refs.storeEventRef.dispose();
  },

  methods: {
    cellCallbackFuc(){

    },
    async initData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
      //this.getSearchParams();
    },
    async emitSearch({ searchParams, dateRangeList, regionI, regionII, regionMode, storePatrolLists, timeMode }) {
      const searchParamsObj = {
          path: 'eventStatistics',
          params: this.params
      };
      this.ifSaveParams && this.$refs.eventSearch.saveSearchParams(searchParamsObj);
        this.ifSaveParams = true;
      /*if(searchParams.inspectId && searchParams.inspectId!=''){
        console.log(searchParams.inspectId,this.curInspectId)
        if(searchParams.inspectId !=this.curInspectId){
          console.log("Change ")
          let result  = await  this.getInspectItemList(searchParams.inspectId)
          if(result.errCode==0 && result.data){
            let tempList = [];
            result.data.forEach(function(item){
                if(item.parentId == -1){
                  tempList.push(item);
                }
            })
            result.data.forEach(function(item){
                tempList.forEach(function(subitem){
                    if(item.parentId == subitem.id){
                      subitem.items.push(item);
                    }
                });

            })
            this.inspectItemList = tempList ;

            this.curInspectId = searchParams.inspectId
            console.log(this.inspectItemList);
          }
        }

      }*/
      this.params = searchParams;
      //console.log('**emit search params:',this.params);
      this.compareIds = this.compareIds2 = this.params.storeIds;
      this.daysRangeList = dateRangeList;
      this.curRegionI = regionI;
      this.curRegionII = regionII;
      this.regionMode = regionMode;
      this.timeMode = timeMode;
      this.storePatrolLists = storePatrolLists;
      this.curCountry = this.params.curCountry;
      this.searchData();
    },
    async searchData() {
      const self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      self.componentsProps.beginTs = self.params.beginTs;
      self.componentsProps.endTs = self.params.endTs;
      if (self.params.storeIds.length === 0) {
        self.eventTableData = [];
        self.total = 0;
        self.allEventData = [];
        self.getEventsNum();
        self.storeEventList = [];
        self.storeEventsOptions && (self.storeEventsOptions.dataset.source = []);
        //self.getEventBySourcePie();
        self.isLoading = false;
        self.params.timeMode = self.timeMode;
        self.hasNoData = true;
        const searchParamsObj = {
          path: 'eventStatistics',
          params: this.params
        };
        this.ifSaveParams && this.$refs.eventSearch.saveSearchParams(searchParamsObj);
        this.ifSaveParams = true;
      } else {
        self.params.filter = { page: self.page - 1, size: self.sizeNum };
        self.params.order = this.order;
        self.hasNoData = false;

        /**
         *firstly, call getEventTableData to get all event num and display the first page of table
         * secondly, call getAllEventData to get all event and pie chart data
         */
      }
        await self.getUpperGloableEventData();
        await self.getEventTableData();
        await self.getAllEventData();
        await self.getEventBarChartData();
        self.doGetInspecEvenItems();
      
    },
    emitTypeChanged({compareType,compareArr,selectedLabels,selStoreIdArr}){ //劃分類型選擇
      this.compareType = compareType;
      //this.compareIds = compareArr;
      //console.log("compareArr :",compareArr);
      //console.log("compareArr.includ :",compareArr.includes('-1'));
      if(selStoreIdArr.includes('-1')){
        this.compareIds = selStoreIdArr.shift();
      }
      else{
          this.compareIds = selStoreIdArr
      }
      //console.log("emitTypeChanged > this.compareIds:",this.compareIds);
      this.comapareLabels = selectedLabels;
      this.getAllEventData();
      this.getEventTableData();
      this.getEventBarChartData();
    },
    /**取得上方狀態 */
    async getUpperGloableEventData() {
      const params = {};
      params.beginTs = this.params.beginTs;
      params.endTs = this.params.endTs;
      params.storeIds = this.params.storeIds;
      params.regionMode = 0;
    
      try {
        //console.log('params:',params);
        const eventResult = await this.getEventTableDataInfo(params);
        const result = eventResult.data;
        if (result) {
          this.gloableEventData = result.content;
          this.getEventsNum();
        }else{
          self.eventTableData = 0;
          self.eventKPIs.forEach(item => {
            item.eventNum = 0;
          });
        }
      } catch (e) {
        this.ispdf = false;
      }
    },
    getEventsNum() {
      const self = this;
      let totalEvents = 0;
      let totalUnprocessed = 0;
      let totalInprocess = 0;
      let totalProcessed = 0;
      let totalRejected = 0;
      self.gloableEventData.forEach(item => {
        totalEvents += item.numOfTotal;
        totalUnprocessed += item.numOfUnprocessed;
        totalInprocess += item.numOfInprocess;
        totalProcessed += item.numOfProcessed;
        totalRejected += item.numOfRejected;
      });
      self.eventKPIs[0].eventNum = totalEvents;
      self.eventKPIs[1].eventNum = totalUnprocessed+totalRejected;
      self.eventKPIs[2].eventNum = totalInprocess;
      self.eventKPIs[3].eventNum = (totalEvents==0)? 0 : ((totalProcessed/totalEvents)*100).toFixed(0);
    },
    /**end 取得上方狀態 */
    
    /**事件數量barchart排名**/
    getEventTableDataInfo(params) { 
      return new Promise((resolve, reject) => {
        getEventStatsOverWithGroup(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    async getExportData() {
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      //console.log("region:",region);
      const params = {};
      params.beginTs = this.params.beginTs;
      params.endTs = this.params.endTs;
      params.groupMode = region[0].value;
      this.params.groupMode = region[0].value;
      params.storeIds = this.compareIds;
      if(region[0].value<3){ //store, area1, area2
        this.params.storeIds=this.compareIds
        params.storeIds = this.compareIds;
      }else{ //groupType, storeGroup
        this.params.groupIds=this.compareIds;
        params.groupIds = this.params.storeIds;
      }
      params.order = {
        direction: 'desc',
        property: 'numOfTotal'
      };
      
      let content = [];
      try {
        const eventResult = await this.getEventTableDataInfo(params);
        const result = eventResult.data;
        if (result) {
          content = result.content;
        }else{
          self.eventTableData = 0;
          self.eventKPIs.forEach(item => {
            item.eventNum = 0;
          });
        }
      } catch (e) {
        this.ispdf = false;
      }
      return content;
    },
    async getAllEventData() {
      const self = this;
      try {
        self.allEventData = await self.getExportData();
        self.allEventData.forEach(item => {
          const numOfTotal = item.numOfTotal;
          if (numOfTotal === 0) {
            item.completedRateStr = 0 + '%';
          } else {
            item.completedRateStr = (item.numOfProcessed / numOfTotal * 100).toFixed(0) + '%';
          }
          item.completedRate = Number(item.completedRateStr.replace('%', ''));
          item.detail = this.$t("statistics.event.detail");
        });
        self.setBarchartData();
        //self.setEventTableData();
        //self.getEventsNum();
        //self.getEventBySourcePie();
      } catch (e) {
        console.log('EventStatistics-getAllEventData:' + e);
      }
    },
    /*畫barChart*/
    async getEventBarChartData() {
      const self = this;
      self.componentsProps.beginTs = self.params.beginTs;
      self.componentsProps.endTs = self.params.endTs;
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      self.params.groupMode = region[0].value;
      let searchCondition = {}
      //if(region[0].value<3){ //store, area1, area2
        self.params.storeIds=this.compareIds
        searchCondition = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,storeIds:this.compareIds};
        //console.log("*getEventTableData>searchCondition:",searchCondition);
      /*}else{ //groupType, storeGroup
        self.params.groupIds=this.compareIds
        searchCondition  = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,groupIds:this.compareIds};
      }*/
     if(this.compareIds.length>0){
        const eventResult = await self.getEventTableDataInfo(searchCondition);
        //console.log("*getEventTableData>eventResult:",eventResult);
        const ignorePer = 0;
        const errCode = eventResult.errCode;
        if (errCode === 0) {
          const result = eventResult.data;
          if (result) {
            self.eventBarChartData = result.content;
          } else {
            self.eventBarChartData =[];
          }
          
        }
      }else{
        self.eventBarChartData = [];
      }
      self.setBarchartData()
    },
    getBarchartOption(){
      const self = this;
      const chartOption = {
        grid:{
          left:40,
          right:40,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            align: 'left'
          },
        },
        legend: {
          x: 'right',
          y: 'bottom',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 37,
          padding: 0,
          icon: 'rect',
          textStyle: {
            color: '#556679',
            fontSize: 13,
            padding: [0, 0, 0, 8],
            height: 18,
            lineHeight: 18
          }
        },
        xAxis:{
          type: "category",
          axisTick:{
            show:false,
          },
          axisLabel:{
            interval:0,
            rotate:30
          },
          data:[],
        },
        yAxis:[{
          type: 'value',
          min:0,
          axisLine:{
            show:false,
          },
          axisTick:{
            show:false,
          },
          splitLine: {
            lineStyle: {
              type:'dashed',
              color:'#979797'
            }
          },
          axisLabel: {
            color:'#556679',
            fontSize:12,
            
          },
          name:'('+this.$t('remotePatrol.unit')+')',
           nameTextStyle:{
             fontSize:12,
             color:'#556679',
             align:'left',
             padding: [0, 10, 14, -30]
           }
        },{
          type: 'value',
          axisLine:{
            show:false,
          },
          axisTick:{
            show:false,
          },
          splitLine: {
            lineStyle: {
              type:'dashed',
              color:'#979797'
            }
          },
          axisLabel: {
            right:0,
            color:'red',
            fontSize:12,
            align:'right',
          },
          }],
        lineStyle:{
              type:'dashed'
            },
        series: [
          {
            name:"",
            type: 'bar',
            barWidth: "16px",
            smooth: true,
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            color:'#D7F3F9',
            barGap:0,
          }
        ],
        itemStyle: {
              emphasis: {
                color:'#7bd8eb'
              },
              normal: {
                color: '#D7F3F9'
              }
            }
        
      };
      return chartOption;
    },
    setBarchartData(){
      this.barchartOption = this.getBarchartOption();
      let date_xAxis=[];
      let chart_dataset=[];
      if(this.eventBarChartData.length>0){
        this.eventBarChartData.forEach(item => {
          date_xAxis.push(item.groupName);
          chart_dataset.push({value:item.numOfTotal,name:item.groupName,innerId:item.innerId});
        });
        this.barchartOption.xAxis.data = date_xAxis;
        //this.barchartOption.yAxis.splitLine.show = true;
        //this.barchartOption.series.name= this.Avg12Num[0].name;
        //console.log("chart_dataset:",chart_dataset);
        this.barchartOption.series[0].data = chart_dataset;
      }
    },
    /*end 畫barChart */
    onSwitchMode(val){
      this.viewMode=val;
    },
    /*取得門店事件表 */
    
    async getEventTableData() {
      const self = this;
      self.componentsProps.beginTs = self.params.beginTs;
      self.componentsProps.endTs = self.params.endTs;
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      self.params.groupMode = region[0].value;
      let searchCondition = {}
      //if(region[0].value<3){ //store, area1, area2
        self.params.storeIds=this.compareIds
        searchCondition = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,storeIds:this.compareIds,
          filter:{"page":this.page-1,"size":this.sizeNum},
          order:this.order
        };
        console.log("*getEventTableData>searchCondition:",searchCondition);
      /*}else{ //groupType, storeGroup
        self.params.groupIds=this.compareIds
        searchCondition  = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,groupIds:this.compareIds};
      }*/
      const searchParamsObj = {
        path: 'eventStatistics',
        params: self.params
      };
      self.ifSaveParams && self.$refs.eventSearch.saveSearchParams(searchParamsObj);
     self.ifSaveParams = true;
     if(this.compareIds.length>0){
        const eventResult = await self.getEventTableDataInfo(searchCondition);
        //console.log("*getEventTableData>eventResult:",eventResult);
        const ignorePer = 0;
        const errCode = eventResult.errCode;
        if (errCode === 0) {
          const result = eventResult.data;
          if (result) {
            self.allEventTableData = result.content;
            self.total = result.totalPages;
            
            self.allEventTableData.forEach(item => {
              const numOfTotal = item.numOfTotal;
              if (numOfTotal === 0) {
                item.completedRateStr = 0 + '%';
              } else {
                item.completedRateStr = (item.numOfProcessed / numOfTotal * 100).toFixed(0) + '%';
              }
              item.id = item.innerId;
              item.completedRate = Number(item.completedRateStr.replace('%', ''));
              item.storeGroup = item.storeRegion.toString();
              item.storeType = item.storeBranchType.toString();
              item.detail = this.$t("statistics.event.detail");
            });
          } else {
            self.eventTableData = 0;
          }
          
        }
      }else{
        self.allEventTableData = [];
      }
      self.setEventTableData();
      self.setBarchartData()
    },
    setEventTableData(){
      this.orderAllTableData();
      this.eventTableData = this.allEventTableData;
      //this.getEventTableData();
      //this.eventTableData = [...this.allEventTableData.slice( (this.page - 1)* this.sizeNum, this.page* this.sizeNum)];
    },

    orderAllTableData(){
      let key = this.defaultSort.prop;
      key = key.indexOf('Str') > -1 ? key.substr(0, key.indexOf('Str')) : key;
      this.defaultSort.order === 'descending' ? this.allEventTableData.sort((a,b) => { return b[key] - a[key] })
                                : this.allEventTableData.sort((a,b) => { return a[key] - b[key] });
    },
    export2Excel() {
      const that = this;
      if (that.eventTableData.length === 0) {
        util.notify(that.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = [];
        this.eventInfoData.forEach(item=>{
          tHeader.push(item.label);
        });
        const filterVal = ['province', 'city', 'groupName', 'storeGroup', 'storeType','code', 'numOfTotal', 'numOfUnprocessed', 'numOfInprocess',
          'numOfProcessed', 'numOfRejected','completedRate'];
        const curData = that.allEventTableData;
        const data = that.formatJson(filterVal, curData);
        const fileName = this.compareType+'_Inspection event' + '_' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    
    handlePageAndSizeChange(pageObj) { //改變一頁顯示
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.getEventTableData();
    },
    handleCurrentChange(pageObj){ //翻頁
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.getEventTableData();
    },

    handleSortChange(order, defaultSort) {
      this.defaultSort = { ...defaultSort };
      this.order = this.params.order = order;
      this.params.filter = {
        page: this.page - 1,
        size: this.sizeNum
      };
      this.getEventTableData();
    },
    onEvenListNumClick(row){
      console.log("clcick row:",row);
      const self = this;
      const searchParamsObj = {
        path: 'inspectReport',
        params: this.params
      };
      self.$refs.eventSearch.saveSearchParams(searchParamsObj);
      //sessionStorage.setItem('report_data', JSON.stringify(row));
      self.$router.push({ name: 'eventManage', params: { data: row }});
    },
    /*巡檢項事件 sec-row*/
    emitTypeChanged2({compareType,compareArr,selectedLabels,selStoreIdArr}){ //劃分類型選擇
      this.showInvolveTableArea = false;
      this.compareType2 = compareType;
      //this.compareIds2 = compareArr;
      //console.log("compareArr :",compareArr);
      //console.log("compareArr.includ :",compareArr.includes('-1'));
      if(compareArr.includes("-1")){
        this.compareIds2 = selStoreIdArr.shift();
      }else{
        this.compareIds2 = selStoreIdArr
      }
      this.comapareLabels2 = selectedLabels;
      this.doGetInspecEvenItems();
    },
    getInspecEvenItems(params) {
      return new Promise((resolve, reject) => {
        getInspectItemStatsOverGroup(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    async doGetInspecEvenItems(){
      const self = this;
      let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,inspectTagId:self.params.inspectId,storeIds:self.compareIds2 };
      //console.log("doGetInspecEvenItems:",params);
      const result = await this.getInspecEvenItems(params);
      
      self.peiDataSource = result.data;
      self.getEventBySourcePie();
    },
    getEventBySourcePie() {
      const self = this;
      let jsonArray = [];
      let seriesData = [];
      let allItemIds = [];
      util.sortArrayByKeyDesc(self.peiDataSource,'numOfUnqualified');
      self.peiDataSource.forEach(item => {
        if(item.numOfUnqualified!=0){
          seriesData.push({value:item.numOfUnqualified,name:item.groupName});
          jsonArray.push({itemName:item.groupName,amount:item.numOfUnqualified,percentage:item.percentage,itemIds:item.itemIds});
          allItemIds.concat(item.itemIds);
        }
      });
      this.allEventItemIds=[];
      allItemIds.forEach(id=>{
        if(!this.allEventItemIds.includes(id)) this.allEventItemIds.push(id);
      });
      this.selEventItemIds = self.peiDataSource[0].itemIds;
      this.selEventItemName = self.peiDataSource[0].groupName;
      const pieOption = self.getEventBySourcePieOption();
      pieOption.series[0].data = seriesData;
      self.eventSourceOptions = pieOption;
      self.sourcePerArray = jsonArray;
      self.getItemDetail();
    },

    getEventBySourcePieOption() {
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          textStyle: {
            align: 'left'
          },
          backgroundColor: this.echartBackground,
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        series: [
          {
            name: '事件来源占比',
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
              emphasis: {
                borderWidth:10,
                borderColor:'#f7f9fa'
              },
              normal: {
                borderWidth:5,
                borderColor:'#fff',
                  color: function(params) {
                  const colorList = ['#5274bb', '#7b9feb', '#7bd8eb','#4de197','#99ee3a'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      return pieOption;
    },

    onClickEventItem(item,index){
        this.showInvolveTableArea = false;
        this.selEventItem = index;
        this.selEventItemIds = item.itemIds;
        this.selEventItemName = item.itemName;
        //console.log("click item>item.itemIds",item.itemIds)
        this.getItemDetail();
    },
    getInspecItemStatsOverview(params) {
      return new Promise((resolve, reject) => {
        getInspectItemStatsOverview(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    async getItemDetail(){
      const self = this;
      let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,itemIds:self.selEventItemIds,storeIds:self.compareIds2 };
      let result = await this.getInspecItemStatsOverview(params);
      self.eventItemTable.itemAllData = result.data;
      self.eventItemTable.total = self.eventItemTable.itemAllData.length;
      self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
    },
    async onSeeAllIncepEventClick(){
      const self = this;
      self.showInvolveTableArea = false;
      self.selEventItemName = self.$t('statistics.event.seeAll');
      let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,itemIds:self.allEventItemIds,storeIds:self.compareIds2 };
      let result = await this.getInspecItemStatsOverview(params);
      self.eventItemTable.itemAllData = result.data;
      self.eventItemTable.total = self.eventItemTable.length;
      self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
    },
    export2Excel_eventItem() {
      const self = this;
      if (self.eventItemTable.itemAllData.length === 0) {
        util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = [];
        self.eventItemTable.colum_data.forEach(item=>{
          tHeader.push(item.label);
        });
        const filterVal = ['groupName', 'itemName', 'numOfUnqualified', 'percentage', 'numOfStores'];
        const curData = self.eventItemTable.itemAllData;
        const data = self.formatJson(filterVal, curData);
        const fileName = this.selEventItemName+'_Inspection item event' + '_' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    
    handlePageAndSizeChange_eventItem(pageObj) {
      const self = this;
      self.eventItemTable.page = pageObj.page;
      self.eventItemTable.sizeNum = pageObj.size;
      self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
    },

    handleSortChange_eventItem(order, defaultSort) {
      this.eventItemTable.defaultSort = { ...defaultSort };
      this.eventItemTable.order = this.params.order = order;
      self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
    },
    onEvenInvolveStoreClick(row){
      //console.log("clcick row:",row);
      this.eventInvolveItemId = row.row.itemId;
      this.showInvolveTableArea = true;
      this.doGetEventInvolveStores();
    },
    
    /*End巡檢項事件 sec-row*/

    /*事件涉及門店 */
    getInspecStatsItemOverStore(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsItemOverStore(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    async doGetEventInvolveStores(){
      const self = this;
      self.componentsProps_EventCommentList.beginTs = self.params.beginTs;
      self.componentsProps_EventCommentList.endTs = self.params.endTs;
      self.componentsProps_EventCommentList.itemId = self.eventInvolveItemId;
      let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,itemId:self.eventInvolveItemId,storeIds:self.compareIds2 };
      let result = await this.getInspecStatsItemOverStore(params);
      self.eventInvolveTable.itemAllData = [];
      result.data.content.forEach(item=>{
        var obj = {...item};
        obj.id = item.storeId;
        obj.submitter=item.submitters.toString();
        obj.storeRegionStr = item.storeRegion.toString();
        obj.storeBranchTypeStr = item.storeBranchType.toString();
        obj.percentageStr = item.percentage+'%';
        self.eventInvolveTable.itemAllData.push(obj);
      });
      self.eventInvolveTable.total = self.eventInvolveTable.itemAllData.length;
      this.setEventInvolveTable();
    },
    setEventInvolveTable(){
      this.orderAllTableData_eventStores();
      this.eventInvolveTable.table_data = [];
      let page = this.eventInvolveTable.page;
      let sizeNum = this.eventInvolveTable.sizeNum;
      this.eventInvolveTable.table_data = [...this.eventInvolveTable.itemAllData.slice( (page - 1)* sizeNum, page* sizeNum)];
    },
    orderAllTableData_eventStores(){
      let key = this.eventInvolveTable.defaultSort.prop;
      key = key.indexOf('Str') > -1 ? key.substr(0, key.indexOf('Str')) : key;
      this.eventInvolveTable.defaultSort.order === 'descending' ? this.eventInvolveTable.table_data.sort((a,b) => { return b[key] - a[key] })
                                : this.eventInvolveTable.table_data.sort((a,b) => { return a[key] - b[key] });
    },
    export2Excel_eventStores() {
      const self = this;
      if (self.eventInvolveTable.itemAllData.length === 0) {
        util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = [];
        const filterVal =[];
        self.eventInvolveTable.column_data.forEach(item=>{
          tHeader.push(item.label);
          filterVal.push(item.prop);
        });
        //const filterVal = ['province', 'city', 'name', 'percentage', 'numOfStores'];
        const curData = self.eventInvolveTable.itemAllData;
        const data = self.formatJson(filterVal, curData);
        const fileName = 'Store_Inspection item event' + '_' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    
    handlePageAndSizeChange_eventStores(pageObj) {
      const self = this;
      self.eventInvolveTable.page = pageObj.page;
      self.eventInvolveTable.sizeNum = pageObj.size;
      this.setEventInvolveTable()
    },

    handleSortChange_eventStores(order, defaultSort) {
      this.eventInvolveTable.defaultSort = { ...defaultSort };
      this.eventInvolveTable.order = order;
      this.setEventInvolveTable()
    },
    onSwitchMode_eventStores(val){
      this.viewMode_eventStores=val;
      
    },
    /*End 事件涉及門店 */
    
    handleDown() {
      const self = this;
      if (self.eventTableData.length === 0) {
        util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      self.ispdf = true;
      this.$nextTick(() => {
        const img = document.getElementById('imgTest');
        setTimeout(() => {
          html2canvas(img).then(function(canvas) {
            var oGrayImg = canvas.toDataURL('image/jpeg');
            self.pdfSrc = oGrayImg;
          });
          setTimeout(() => {
            self.$print(self.$refs.printPDF);
            self.ispdf = false;
          }, 1000);
        }, 5000);
      });
    },

    adjustChart() {
      this.$refs.pieChartRef && this.$refs.pieChartRef.resize();
      this.$refs.storeEventRef && this.$refs.storeEventRef.resize();
    },
    exportPdf(storeNameStr, groupStr, typeStr) {
      this.storeNameStr = storeNameStr;
      this.storeGroupStr = groupStr;
      this.storeTypeStr = typeStr;
      this.handleDown();
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    setDefaultSortAndPage(paramsObj) {
      this.defaultSort = paramsObj.defaultSort;
      this.order = this.params.order = paramsObj.order;
    },

    barchartClick(bar){
      console.log("barchartClick:",bar);
    }

  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";
  .el-overview-content {
    width: 100%;
    position: relative;
    height: auto;
    font-size: calc(14/1920*100vw);
    padding-bottom: 20px;
    .el-overview {
      padding: 0 calc(24/1440*100vw);
      position: relative;
      .export-header{
        min-height: 100px;
        margin-bottom: 20px;
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
      .amout_row{
        height: 194px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        background-color: #fff;
        border-radius: 5px;
        margin-top: -30px;
        .title{
          height: 67.5px;
          padding-top: 22px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          font-size: 18px;
          text-align: left;
          color: $black;
          border-bottom: solid 1px #acaeb1;
        }
        .amount_region{
          display:flex;
          flex-direction:row;
          height:126.5px;
          align-items:center;
          
          .region-area{
            display: flex;
            flex-direction: row;
            align-items: center;
            height:100%;
            width:calc(274/1440*100vw);
            justify-content: space-between;
            .split-line{
            border:0.5px solid #acaeb1;
            width:1px;
            height:102px;
            margin-top:15px;
            margin-bottom: 25px;
          }
            .img-area{
              height: 100%;
              width:120px;
              display: flex;
              flex-direction: column-reverse;
              align-items: flex-end;
            }
            .num-area{
              display: flex;
              flex-direction: column;
              width: calc(154/1440*100vw);
              margin-left:calc(20/1440*100vw);
              .number{
                height: 57.5px;
                align-self: center;
                font-family: Roboto;
                font-size: 48px;
                color:#484848;
              }
              .description{
                color:#484848;
                font-size: 15px;
                height: 42px;
                font-weight: normal;
                text-align: left;
              }
            }
          }
        }
      }
      .first-row{
        height: auto;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        background-color: #fff;
        border-radius: 5px;
        margin-top: 24px;
        .head{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 67.5px;
          padding-top: 22px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          .title{
            height: 67.5px;
            font-size: 18px;
            text-align: left;
            color: $black;
          }
        }
        .barchart-area{
          height:271px;
          margin-left: calc(36/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          .chart-content {
            width: 100%;
            height: 100%;
          }
        }
        .table-area{
          height:auto;
          margin-top: 20.5px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          .sec-head{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 30px;
            .title{
              height: 30px;
              font-size: 15px;
              text-align: left;
              color: $black;
            }
            .operation-btns{
              align-self: center;
              display: flex;
              flex-direction: row;
              width:calc(355/1440*100vw);
              height: 30px;
              align-items: center;
              padding:0;
              justify-content: space-between;
            }
          }
          .event-table {
            overflow-y: auto;
            height: 717.5px;
            background-color: fff;
            padding-top: 16.5px;
            padding: 16.5 24px ;
            .table{
              margin: 0 calc(24/1920*100vw);
              background-color: #f7f9fa;
              box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
              border: solid 1px #f5f5f5;
            }
          }
        }
        
        .kpi-list{
          height: 100%;
          border-bottom: 1px solid $border;
        }
        
      }
      .second-row {
        height: auto;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        background-color: #fff;
        border-radius: 5px;
        margin-top: 24px;
        .head{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 67.5px;
          padding-top: 22px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          .title{
            height: 67.5px;
            font-size: 18px;
            text-align: left;
            color: $black;
          }
        }
        
        .pie-area{
          width: calc(((300/1440))*100vw)+276;
          height:300px;
          margin-left: calc(36/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          display:flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .pct-panel{
            width: 276px;/*calc(276/1440*100vw);*/
            height: 276px;/*calc(276/1440*100vw);*/
            border-radius: 50%;
            border-color:#dae4eb;
            border-style:dashed dashed dashed dashed; 
            .inner{
                position:absolute;
                height: 150px;
                width: 150px;
                left:382px;
                top:143px;
                border-radius: 50%;
                border-color:#dae4eb;
                border-style:dashed dashed dashed dashed; 
            }
            .chart-content {
              width:100%;
              height:100%;
            }
          }
          .pie-label-area{
            cursor: pointer;
            width: calc(300/1440*100vw);
            height: 40px;
            margin-left:calc(152/1440*100vw);
            display:flex;
            flex-direction: row;
            align-items: center;
            text-align: left;
            .pie-color{
              width:18px;
              height: 18px;
              margin-left: 12px;
            }
            .pei-item-name{
              margin-left:calc(12/1440*100vw);
              color: #484848;
              width:calc(167/1440*100vw);
              height: 18px;
              font-size: 15px;

            }
            .pei-item-num{
              color: #484848;
              width:calc(40/1440*100vw);
              height: 18px;
              font-size: 15px;
              font-family: Roboto;
              font-weight: bold;
              line-height:18px;
            }
          }
          .pie-label-area-active{
            width: calc(280/1440*100vw);
            height: 40px;
            margin-left:calc(152/1440*100vw);
            display:flex;
            flex-direction: row;
            align-items: center;
            background-color: #f2f9fe;
            text-align: left;
            .pie-color{
              width:18px;
              height: 18px;
              margin-left: 12px;
            }
            .pei-item-name{
              margin-left:calc(12/1440*100vw);
              color: #006ab7;
              width:calc(167/1440*100vw);
              height: 18px;
              font-size: 15px;
            }
            .pei-item-num{
              color: #006ab7;;
              width:calc(40/1440*100vw);
              height: 18px;
              font-size: 15px;
              font-family: Roboto;
              font-weight: bold;
              line-height:18px;
            }
          }
        }
        
        .table-area{
          height:auto;
          margin-top: 20.5px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          .sec-head{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 30px;
            .title{
              height: 30px;
              font-size: 15px;
              text-align: left;
              color: $black;
            }
            .operation-btns{
              align-self: center;
              display: flex;
              flex-direction: row;
              width:calc(250/1440*100vw);
              height: 30px;
              align-items: center;
              padding:0;
              justify-content: space-between;
            }
          }
          .event-table {
            overflow-y: auto;
            height: 717.5px;
            background-color: #f7f9fa;
            padding-top: 16.5px;
            padding: 16.5 24px ;
            .table{
              margin: 0 calc(24/1920*100vw);
              background-color: #f7f9fa;
              box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
              border: solid 1px #f5f5f5;
            }
          }
        }
        
        .kpi-list{
          height: 100%;
          border-bottom: 1px solid $border;
        }
      }
    }
    .ja-export-btn,
    .en-export-btn,
    .export-btn{
      background-color: #fff;
      color: #006ab7;
    }
    .tbl-header{
      font-size:'#12px';
      background-color:'#f7f9fa';
      height: '75px';
      border: none;
    }
    
  }
</style>

