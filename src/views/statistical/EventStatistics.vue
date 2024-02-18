<template>
  <div>
    <div style="display: none">
      <div class="no-print">
        <delay-button
          id="downloadPdf"
          class="exportbtn"
          type="primary"
          size="mini"
          @click="exportPdf"
        >
          <div class="button-area">
            <i class="iconfont icon-pdf export"/>
            <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
          </div>
        </delay-button>
      </div>
    </div>
    <div class="el-overview-content" :style="ispdf ? {'width':'1024px'}:{}">
      <el-col :span="24">
        <search-component
          ref="eventSearch"
          :default-sort="defaultSort"
          :isInspectItem=true
          path="eventStatistics"
          @emitSearch = "emitSearch"
          @exportPdf = "exportPdf"
          @changeDefaultSort="setDefaultSortAndPage"/>
      </el-col>
      <el-col :span="24" class="el-overview" >
        <el-row class="amout_row" id="imgTest_amount" style="box-shadow:none;">
          <el-col :span="24" class="kpi-list">
            <div class="title">{{ $t('statistics.event.eventProcessStatus') }}</div>
          </el-col>
          <el-col :span="24" class="amount_region">
            <div class="region-area" :style="ispdf ? {'width':'220px'}:{}" v-for="(item,index) in eventKPIs" :key="index">
              <div class="num-area">
                <div style="display:flex;height:84.5px;">
                  <div class="number" :style="ispdf ? {'fontSize':'calc(40/1980*100vw)'}:{}">{{ item.eventNum }}
                    <span v-if="index!=3" style="font-size:calc(15/1980*100vw);margin-left:5px;">{{$t('statistics.event.unit')}}</span>
                    <span v-else style="font-size:calc(15/1980*100vw);margin-left:5px;">%</span>
                  </div>
                </div>
                <div class="description">{{ item.eventTitle}}</div>
              </div>
              <div class="img-area" v-if="!ispdf">
                <img v-if="index==0" src="../../../static/img/statistics/ic_totalEvent.svg" style="width:84.8;height:79.8px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else-if="index==1" src="../../../static/img/statistics/ic_inprocess.svg" style="width:108.5;height:65.6px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else-if="index==2" src="../../../static/img/statistics/ic_processed.svg" style="width:111.8;height:74.5px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else src="../../../static/img/statistics/ic_compeleted.svg" style="width:115.5;height:74px;align-items:flex-end;padding-bottom:10.5px;" />
              </div>
              <div v-if="index!=3" class="split-line"></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="first-row" id="imgTest_first" style="box-shadow:none;">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.eventRank') }}</div>
              <div :style="WindowWidth>1600?{}:{'marginRight':'30px'}">
              <TypeSelectArea
                  path="eventStatistics"
                  :allow-all=true
                  :region-array1="params.curProvince"
                  :region-array2="params.curCity"
                  :cur-store-group="params.curStoreGroup"
                  :cur-store-type="params.curStoreType"
                  :cur-stores="storeIds"
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
            </div>
            <div class="barchart-area">
              <div style="position:absolute;right:24px;top:94px;z-index:10;" @click='changeBarchartSorOrder'>
                  <div class="button-area" >
                      <span style="color:#acaeb1">{{ barchartOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='barchartOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                  </div>
              </div>
              <div v-if="ispdf" style="overflow-x:auto;overflow-y:hidden;height:100%;width:1024px">
                <v-chart ref="itemsChart1" autoresize :options="barchartOption" class="chart-content" width="900px"
                :style="{width:'900px',height:'100%'}"
                @click="barchartClick"/>
              </div>
              <div v-else style="overflow-x:auto;overflow-y:hidden;height:100%;">
                <v-chart ref="itemsChart1" autoresize :options="barchartOption" class="chart-content" :width="barchartWidth"
                  :style="{width:barchartWidth,height:'100%'}"
                @click="barchartClick"/>
              </div>
            </div>
            
            <!-- 地點事件 -->
            <div class="table-area">
              <div class="sec-head">
                <div class="title">{{ $t('statistics.event.storeEvent') }}</div>
                <div class="operation-btns" :class="getLangStyleValue(operationBtnClass)">
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
                    :class="getLangStyleValue(exportBtnClass)"
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
              <div v-if="viewMode==0">
                <div style="margin-top:20.5px;">
                  <p></p>
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
                    :isexportPDF="ispdf"
                    layout = "prev,pager,next,sizes"
                    expand-component = "IncepItemTop5"
                    :expandCompProperties = "componentsProps"
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
              <div v-else style="margin-top:20.5px;border-bottom:none;">
                <div v-if="ispdf" class="barchart-area"  style="overflow-x:hidden;overflow-y:hidden;height:270px;width:1000px">
                  <v-chart ref="ChartViewMode0" autoresize :options="barchartOptionViewMode0" class="chart-content" width="800px"
                  :style="{width:'800px',height:'100%'}"/>
                </div>
                <div v-else class="barchart-area"  style="overflow-x:auto;overflow-y:hidden;height:270px">
                  <v-chart ref="ChartViewMode0" autoresize :options="barchartOptionViewMode0" class="chart-content"
                  :width="barchartWidthMode0"
                :style="{width:barchartWidthMode0}"/>
                </div>

              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 巡檢項事件 -->
        <el-row class="second-row" id="imgTest_second" style="box-shadow:none;">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.incepItemEvent') }}</div>
              <div :style="WindowWidth>1600?{}:{'marginRight':'30px'}">
              <TypeSelectArea
                  path="eventStatistics"
                  :allow-all=true
                  :region-array1="params.curProvince"
                  :region-array2="params.curCity"
                  :cur-store-group="params.curStoreGroup"
                  :cur-store-type="params.curStoreType"
                  :cur-stores="storeIds"
                  :cached-params="params"
                  :cur-country="curCountry"
                  @emitTypeChanged="emitTypeChanged2"
              ></TypeSelectArea>
              </div>
              <!--<AreaSelected
                path="eventStatistics"
                allow-all="true"
                :cached-params="params"
                :cur-country="curCountry"
                @emitTypeChanged="emitTypeChanged2"
              ></AreaSelected>-->
            </div>

            <div class="pie-area">
              <div class="pie-div">
                <div class="inner"/>
                <div class="pct-panel">
                    <v-chart
                        ref="pieChartRef"
                        :auto-resize="true"
                        :options="eventSourceOptions"
                        class="chart-content"
                        @click="piechartClick"
                    />
                </div>
              </div>
              <div style="margin-top: 10px;width:60%;margin-left:calc(152/1440*100vw);height:206px;overflow-y:auto;overflow-x:hidden;">
              <div v-for="(item,index) in sourcePerArray" :key="index">
                <div :class="(item.id==selEventItem) ? 'pie-label-area-active':'pie-label-area'" @click="onClickEventItem(item,index)">
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
                <div class="operation-btns" :class="getLangStyleValue(operationBtnClass)">
                  <delay-button
                    class="export-btn"
                    :class="getLangStyleValue(SeeAllIncepEventClass)"
                    style="margin-left:32px;background-color:#FFF;color:#006ab7;"
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
                    :class="getLangStyleValue(exportBtnClass)"
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
                <table-only
                  ref="elTP"
                  :column-data="eventItemTable.column_data"
                  :table-data="eventItemTable.table_data"
                  :highlight-current-row= "true"
                  :is-event = "false"
                  :default-sort = "defaultSort"
                  :allowRowExpand = "false"
                  :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}"
                  :tableHeight = "726"
                  :isexportPDF="ispdf"
                  @handleChange="handlePageAndSizeChange_eventItem"
                  @sortChange="handleSortChange_eventItem"
                  @onCellClick = "onEvenInvolveStoreClick"
                />
              </div>
              <div style="width:100%; margin-top:12px;height:31px;">
                <tbl-pagination-only
                  :total="eventItemTable.total"
                  :current-page="eventItemTable.page"
                  :page-size="eventItemTable.sizeNum"
                  layout = "prev,pager, next,sizes,slot"
                  @sizeChange="handlePageAndSizeChange_eventItem"
                  @currentChange="handlePageAndSizeChange_eventItem"
                />
              </div>
            </div>
            <div v-if="showInvolveTableArea" style="margin-top:100px;height: auto;">
              <div style="height: 1px;margin-left:calc(36/1440*100vw);margin-right: calc(24/1440*100vw);border-bottom: solid 1px #acaeb1;"></div>
              <div class="table-area" style="">
                <div class="sec-head">
                  <div class="title">{{ selEventItemName+$t('statistics.event.eventInvolveStores') }}</div>
                  <div class="operation-btns" :class="getLangStyleValue(operationBtnClass)">
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
                      :class="getLangStyleValue(exportBtnClass)"
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
                <div v-if="viewMode_eventStores==0">
                  <div style="margin-top:20.5px;">
                    <table-only
                      ref="elTP"
                      :column-data="eventInvolveTable.column_data"
                      :table-data="eventInvolveTable.table_data"
                      :highlight-current-row= "true"
                      :is-event = "false"
                      :default-sort = "eventInvolveTable.defaultSort"
                      :allowRowExpand = "true"
                      :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}"
                      :tableHeight = "ispdf?2000:726"
                      :isexportPDF="ispdf"
                      expand-component = "EventCommentList"
                      :expandCompProperties = "componentsProps_EventCommentList"
                    />
                  </div>
                  <div style="width:100%; margin-top:12px;height:31px;">
                    <tbl-pagination-only
                      :total="eventInvolveTable.total"
                      :current-page="eventInvolveTable.page"
                      :page-size="eventInvolveTable.sizeNum"
                      layout = "prev,pager, next,sizes,slot"
                      @sizeChange="handlePageAndSizeChange_eventStores"
                      @currentChange="handlePageAndSizeChange_eventStores"
                    />
                  </div>
                </div>
                <div v-else style="margin-top:20.5px;border-bottom:none;">
                <div v-if="ispdf" class="barchart-area"  style="overflow-x:hidden;overflow-y:hidden;height:270px;width:1000px">
                  <v-chart ref="ChartViewMode_eventStores" autoresize :options="barchartOptionViewMode_eventStores" class="chart-content" width="800px"
                  :style="{width:'800px',height:'100%'}"/>
                </div>
                <div v-else class="barchart-area"  style="overflow-x:auto;overflow-y:hidden;height:270px">
                  <v-chart ref="ChartViewMode_eventStores" autoresize :options="barchartOptionViewMode_eventStores"
                  class="chart-content"
                  :width="barchartWidth_sec"
                    :style="{width:barchartWidth_sec}"/>
                </div>
              </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </div>
    <div id="pdf-area" ref="printPDF" v-if="ispdf">
      <div class="el-overview-content" style="height: 194px;box-shadow:none;">
        <div id="img_amount" class="amout_row">
          <img :src="pdfSrc_amount">
        </div>
      </div>
      <div class="el-overview-content" style="height: auto;margin-top:24px;box-shadow:none;">
        <div id="img_first"  class="first-row" >
            <img :src="pdfSrc_first">
        </div>
      </div>
      <div class="el-overview-content" style="height: auto;margin-top:24px;box-shadow:none;">
        <div id="img_second"  class="second-row" >
            <img :src="pdfSrc_second">
        </div>
      </div>
    </div>
    <div v-if="false" class="el-overview-content" style="width:1000px;">
      <el-col :span="24" class="el-overview" style="box-shadow:none;">
        <el-row class="amout_row" id="imgTest_amount2" style="box-shadow:none;">
          <el-col :span="24" class="kpi-list">
            <div class="title">{{ $t('statistics.event.eventProcessStatus') }}</div>
          </el-col>
          <el-col :span="24" class="amount_region">
            <div class="region-area" style="width:200px;"  v-for="(item,index) in eventKPIs" :key="index">
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
        <el-row class="first-row" id="imgTest_first2" style="box-shadow:none;">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.eventRank') }}</div>
              <div :style="WindowWidth>1600?{}:{'marginRight':'30px'}">
              <TypeSelectArea
                  path="eventStatistics"
                  :allow-all=true
                  :region-array1="params.curProvince"
                  :region-array2="params.curCity"
                  :cur-store-group="params.curStoreGroup"
                  :cur-store-type="params.curStoreType"
                  :cur-stores="storeIds"
                  :cached-params="params"
                  :cur-country="curCountry"
                  @emitTypeChanged="emitTypeChanged"
              ></TypeSelectArea>
              </div>
              <!--<AreaSelected
                path="eventStatistics"
                allow-all="true"
                :cached-params="params"
                :cur-country="curCountry"
                @emitTypeChanged="emitTypeChanged"
              ></AreaSelected>-->
            </div>
            <div class="barchart-area">
              <div style="position:absolute;right:24px;top:94px;z-index:10;" @click='changeBarchartSorOrder'>
                  <div class="button-area" >
                      <span style="color:#acaeb1">{{ barchartOrder=="desc"?$t('statistics.descOrder'):$t('statistics.ascOrder') }}</span>
                      <img :src='barchartOrder=="desc"?descPng:incPng' style="width:16px;height:16px;margin-left:5px"/>
                  </div>
              </div>
              <div style="overflow-x:auto;overflow-y:hidden;height:100%;">
              <v-chart ref="itemsChart1" :auto-resize="true" :options="barchartOption" class="chart-content" @click="barchartClick"/>
              </div>
            </div>
            <div class="table-area">
              <div class="sec-head">
                <div class="title">{{ $t('statistics.event.storeEvent') }}</div>
                <div class="operation-btns" :class="getLangStyleValue(operationBtnClass)">
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
                    :class="getLangStyleValue(exportBtnClass)"
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
              <div v-if="viewMode==0">
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
                    :isexportPDF="ispdf"
                    layout = "prev,pager,next,sizes"
                    expand-component = "IncepItemTop5"
                    :expandCompProperties = "componentsProps"
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
              <div v-else class="barchart-area" style="margin-top:20.5px;border-bottom:none;overflow-x:auto;overflow-y:hidden;height:100%;">
                <v-chart ref="ChartViewMode0"  :options="barchartOptionViewMode0" class="chart-content"
                :width="barchartWidthMode0"
                :style="{width:barchartWidthMode0}"/>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="second-row" id="imgTest_second1" style="box-shadow:none;">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.incepItemEvent') }}</div>
              <div :style="WindowWidth>1600?{}:{'marginRight':'30px'}">
              <TypeSelectArea
                  path="eventStatistics"
                  :allow-all=true
                  :region-array1="params.curProvince"
                  :region-array2="params.curCity"
                  :cur-store-group="params.curStoreGroup"
                  :cur-store-type="params.curStoreType"
                  :cur-stores="storeIds"
                  :cached-params="params"
                  :cur-country="curCountry"
                  @emitTypeChanged="emitTypeChanged2"
              ></TypeSelectArea>
              </div>
              <!--<AreaSelected
                path="eventStatistics"
                allow-all="true"
                :cached-params="params"
                :cur-country="curCountry"
                @emitTypeChanged="emitTypeChanged2"
              ></AreaSelected>-->
            </div>

            <div class="pie-area">
              <div class="pie-div">
                <div class="inner"/>
                <div class="pct-panel">
                    <v-chart
                        ref="pieChartRef"
                        :auto-resize="true"
                        :options="eventSourceOptions"
                        class="chart-content"
                        @click="piechartClick"
                    />
                </div>
              </div>
              <div style="margin-top: 10px;width:60%;margin-left:calc(152/1440*100vw);height:206px;overflow-y:auto;overflow-x:hidden;">
              <div v-for="(item,index) in sourcePerArray" :key="index">
                <div :class="(item.id==selEventItem) ? 'pie-label-area-active':'pie-label-area'" @click="onClickEventItem(item,index)">
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
                <div class="operation-btns" :class="getLangStyleValue(operationBtnClass)">
                  <delay-button
                    :class="getLangStyleValue(exportBtnClass)"
                    style="margin-left:32px;width:210px;background-color:#FFF;color:#006ab7;"
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
                    :class="getLangStyleValue(exportBtnClass)"
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
                <table-only
                  ref="elTP"
                  :column-data="eventItemTable.column_data"
                  :table-data="eventItemTable.table_data"
                  :highlight-current-row= "true"
                  :is-event = "false"
                  :default-sort = "defaultSort"
                  :allowRowExpand = "false"
                  :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}"
                  :tableHeight = "726"
                  :isexportPDF="ispdf"
                  @handleChange="handlePageAndSizeChange_eventItem"
                  @sortChange="handleSortChange_eventItem"
                  @onCellClick = "onEvenInvolveStoreClick"
                />
              </div>
              <div style="width:100%; margin-top:12px;height:31px;">
                <tbl-pagination-only
                  :total="eventItemTable.total"
                  :current-page="eventItemTable.page"
                  :page-size="eventItemTable.sizeNum"
                  layout = "prev,pager, next,sizes,slot"
                  @sizeChange="handlePageAndSizeChange_eventItem"
                  @currentChange="handlePageAndSizeChange_eventItem"
                />
              </div>
            </div>
            <div v-if="showInvolveTableArea" style="margin-top:100px;height: auto;">
              <div style="height: 1px;margin-left:calc(36/1440*100vw);margin-right: calc(24/1440*100vw);border-bottom: solid 1px #acaeb1;"></div>
              <div class="table-area" style="">
                <div class="sec-head">
                  <div class="title">{{ selEventItemName+$t('statistics.event.eventInvolveStores') }}</div>
                  <div class = "operation-btns" :class="getLangStyleValue(operationBtnClass)">
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
                      :class="getLangStyleValue(exportBtnClass)"
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
                <div v-if="viewMode_eventStores==0">
                  <div style="margin-top:20.5px;">
                    <table-only
                      ref="elTP"
                      :column-data="eventInvolveTable.column_data"
                      :table-data="eventInvolveTable.table_data"
                      :highlight-current-row= "true"
                      :is-event = "false"
                      :default-sort = "eventInvolveTable.defaultSort"
                      :allowRowExpand = "true"
                      :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}"
                      :tableHeight = "ispdf?'2000':'726'"
                      :isexportPDF="ispdf"
                      expand-component = "EventCommentList"
                      :expandCompProperties = "componentsProps_EventCommentList"
                    />
                  </div>
                  <div style="width:100%; margin-top:12px;height:31px;">
                    <tbl-pagination-only
                      :total="eventInvolveTable.total"
                      :current-page="eventInvolveTable.page"
                      :page-size="eventInvolveTable.sizeNum"
                      layout = "prev,pager, next,sizes,slot"
                      @sizeChange="handlePageAndSizeChange_eventStores"
                      @currentChange="handlePageAndSizeChange_eventStores"
                    />
                  </div>
                </div>
                <div v-else class="barchart-area" style="overflow-x:auto;overflow-y:hidden;margin-top:20.5px;border-bottom:none;">
                  <v-chart ref="ChartViewMode_eventStores"  :options="barchartOptionViewMode_eventStores" class="chart-content"
                    :width="barchartWidth_sec"
                    :style="{width:barchartWidth_sec}"
                  />
                </div>
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
      :isWarning="true"
      class="LoadDialog"
    >
      <p>{{ $t('insSettingView.isExportPDF') }}......</p>
    </dialog-pop>
    <DownloadDialogPop
        :title="$t('downloadManagement.message')"
        :visible="showExportMassage"
        :showCancelbtn="false"
        @confirmHandler="showExportMassage = false"
        @goToPage="$router.push({name: 'downloadManagement',});"
        >
    </DownloadDialogPop>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import { mapGetters } from 'vuex';
import util from '@/common/util.js';
import { getEventStatsOverStoreV2, getEventStatsOverStore,getEventStatsOverWithGroup } from '@/api/eventOverview';
import { getInspectItemStatsOverview, getInspectItemStatsOverGroup, getInspectStatsItemOverStore} from '@/api/inspectOverview';
import {
  exportStatisticsEventGroup,
  exportStatisticsInspectOverview,
  exportStatisticsInspectStore
} from '@/api/exportExcel';
import { getBriefStoreList } from '@/api/store';
import html2canvas from 'html2canvas';
import Lodash from 'lodash';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import AreaSelected from '@/components/AreaSelected';
import TypeSelectArea from '@/components/TypeSelectArea';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import vm from '@/main.js';
import PermissionHelper from '@/api/PermissionHelper';
import { message } from '@/common/singleton-message';
import DownloadDialogPop from '@/components/DownloadDialogPop';
export default {
  name: 'EventStatistics',
  components: {
    DialogPop,
    DelayButton,
    'v-chart': ECharts,
    SearchComponent,
    AreaSelected,TypeSelectArea,
    TableOnly,
    TblPaginationOnly,
    DownloadDialogPop
  },
  mixins: [resize],
  data() {
    return {
      storeIds:[],
      ispdf: false,
      pdfSrc_amount: '',
      pdfSrc_first: '',
      pdfSrc_second: '',
      curCountry:"-1",
      compareIds:[],
      comapareLabels:[],
      compareType:'stores',
      areaMode:[{key:'area1',value:1},{key:'area2',value:2},{key:'stores',value:0},{key:'storeGroup',value:4},{key:'storeType',value:3}],
      barchartOption:null,
      viewMode:0,
      barchartOptionViewMode0:null,
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
      barchartOrder:'desc',
      descPng: require('../../../static/img/statistics/orderDesc.png'),
      incPng: require('../../../static/img/statistics/orderInc.png'),
      eventTableData: [],
      eventInfoData: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI') + '一',
          'sortable': false,
          'width': '60',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '60',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'groupName',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'minWidth': '80',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeGroup',
          'label': this.$t('statistics.event.storeGroup'),
          'sortable': false,
          'minWidth': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeType',
          'label': this.$t('statistics.event.storeType'),
          'sortable': false,
          'minWidth': '70',
          'maxWidth': '100',
          'pdfwidth': '11%'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'minWidth': '60',
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
          'minWidth': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'numOfInprocess',
          'label': this.$t('statistics.event.numProcessEvents'),
          'sortable': true,
          'minWidth': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'numOfProcessed',
          'label': this.$t('statistics.event.numClosedEvents'),
          'sortable': 'custom',
          'minWidth': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'numOfRejected',
          'label': this.$t('statistics.event.numReturndEvents'),
          'sortable': true,
          'minWidth': '55',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':true
        },
        {
          'prop': 'completedRateStr',
          'label': this.$t('statistics.event.completedRate'),
          'sortable': 'custom',
          'minWidth': '60',
          'maxWidth': '100',
          'pdfwidth': '12%',
          'isCellClick':false
        },
        {
          'prop': 'detail',
          'label': this.$t('statistics.event.commonEvent'),
          'sortable': 'false',
          'minWidth': '90',
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
      componentsProps:{beginTs:this.$moment().subtract(29, 'days').startOf('d').toDate(),endTs: this.$moment().endOf('d').toDate(),inspectTagIds:[]},
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
      pieColorList : util.getChartColorArray(),
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
      barchartOptionViewMode_eventStores:null,
      eventInvolveItemId:null,
      showInvolveTableArea:false,
      componentsProps_EventCommentList:{},
      gloableEventData:[],
      barActiveName:'-1',
      inspectId:null,
      barchartWidth:'100%',
      barchartWidthMode0:'100%',
      barchartWidth_sec:'100%',
      operationBtnClass:[
        {key:'en',value:'operation-btns-en'},{key:'zh',value:'operation-btns-zh'},{key:'zhtw',value:'operation-btns-zhTW'},
        {key:'ja-JP',value:'operation-btns-ja'},{key:'ko-KR',value:'operation-btns-ko'},{key:'vi-VN',value:'operation-btns-vi'},
        {key:'id-ID',value:'operation-btns-id'},{key:'th-TH',value:'operation-btns-th'}
      ],
      SeeAllIncepEventClass:[
        {key:'en',value:'AllIncepEvent-btns-en'},{key:'zh',value:'AllIncepEvent-btns-zh'},{key:'zhtw',value:'AllIncepEvent-btns-zhTW'},
        {key:'ja-JP',value:'AllIncepEvent-btns-ja'},{key:'ko-KR',value:'AllIncepEvent-btns-ko'},{key:'vi-VN',value:'AllIncepEvent-btns-vi'},
        {key:'id-ID',value:'AllIncepEvent-btns-id'},{key:'th-TH',value:'AllIncepEvent-btns-th'}
      ],
      exportBtnClass:[
        {key:'en',value:'en-export-btn'},{key:'zh',value:'zh-export-btn'},{key:'zhtw',value:'zhTW-export-btn'},
        {key:'ja-JP',value:'ja-export-btn'},{key:'ko-KR',value:'ko-export-btn'},{key:'vi-VN',value:'vi-export-btn'},
        {key:'id-ID',value:'id-export-btn'},{key:'th-TH',value:'th-export-btn'}
      ],
      WindowWidth:util.getWindowWidth(),
      compareGroupAndTypeId:[],
      inspectName : '',
      showExportMassage: false,
      filterData: [],
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
    cellCallbackFuc(){},

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

    getLangStyleValue(langArray){
      /*var lang_style = langArray.find( item => {return item.key==this.$i18n.locale});
      return lang_style.value;*/

      return util.getLangStyleValue(langArray);
    },
    async initData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
      this.getSearchParams();

      let res  = await this.getBriefStoreData();
      if(res.errCode ==0){
          this.storeList = res.data;
      }
      
    },
    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('eventStatistics');
      
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      this.params.beginTs = this.dateValue[0].valueOf();
      this.params.endTs = this.dateValue[1].valueOf();
      if (Object.keys(searchParams).length > 0) {
        this.inspectId = searchParams.inspectId;
        this.inspectName = searchParams.inspectName;
        //console.log(">>>eventstistics > this.inspectName:",this.inspectName);
      } else {
        this.searchParams = {};
      }
    },
    async emitSearch({ searchParams, dateRangeList, regionI, regionII, regionMode, storePatrolLists, timeMode }) {
      //console.log(">>>>eventStatistics > storePatrolLists:",storePatrolLists);
      this.params = searchParams;
      this.storeIds = this.params.storeIds;
      this.compareIds = this.compareIds2 = this.params.storeIds;
      this.daysRangeList = dateRangeList;
      this.curRegionI = regionI;
      this.curRegionII = regionII;
      this.regionMode = regionMode;
      this.timeMode = timeMode;
      this.inspectName = storePatrolLists;
      this.curCountry = this.params.curCountry;

      console.log('this.params ~~~~XXXDDD', this.params)
      if(searchParams.inspectId && searchParams.inspectId!=''){
        //console.log(">>>>eventStatistics > this.params.inspectId:",searchParams.inspectId);
        this.inspectId = searchParams.inspectId;
        this.params['inspectName'] =  storePatrolLists;
      }
      const searchParamsObj = {
          path: 'eventStatistics',
          params: this.params
      };
      this.ifSaveParams && this.$refs.eventSearch.saveSearchParams(searchParamsObj);
        this.ifSaveParams = true;
      this.searchData();
    },
    async searchData() {
      const self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      self.componentsProps.beginTs = self.params.beginTs;
      self.componentsProps.endTs = self.params.endTs;
      self.componentsProps.inspectTagIds = [self.inspectId];
      if (self.params.storeIds.length === 0) {
        self.eventTableData = [];
        self.storeIds = [];
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

        await self.getUpperGloableEventData();
        await self.getEventTableData();
        //await self.getAllEventData();
        await self.getEventBarChartData();
        self.doGetInspecEvenItems();
      }


    },
    emitTypeChanged({compareType,compareArr,selectedLabels,selStoreIdArr}){ //劃分類型選擇
      this.compareType = compareType;
      //console.log("emitTypeChanged > selStoreIdArr :",selStoreIdArr);
      //console.log("compareArr.includ :",compareArr.includes('-1'));
      /*if(selStoreIdArr.includes('-1')){
        selStoreIdArr.shift();
      }*/
      let tempId = [];
      selStoreIdArr.forEach((item)=>{
        if(item!='-1'){
          tempId.push(item);
        }
      });

      this.compareIds = tempId;
      this.compareGroupAndTypeId = compareArr;
      //console.log("1.emitTypeChanged > this.compareIds:",this.compareIds);

      this.comapareLabels = selectedLabels;
      //this.getAllEventData();
      this.getEventTableData();
      this.getEventBarChartData();
    },
    /**取得上方狀態 */
    async getUpperGloableEventData() {
      const params = {};
      params.beginTs = this.params.beginTs;
      params.endTs = this.params.endTs;
      params.storeIds = this.storeIds.filter(storeId => storeId !== '-1');
      params.inspectTagIds = [this.inspectId];
      console.log("getUpperGloableEventData > params.inspectTagIds:",params.inspectTagIds);
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
        totalRejected = item.numOfRejected;
      });
      
      console.log('self.gloableEventData :>> ', self.gloableEventData);
      if(this.storeIds.length == 0){
        self.eventKPIs[0].eventNum = "N/A";
        self.eventKPIs[1].eventNum = "N/A";
        self.eventKPIs[2].eventNum = "N/A";
        self.eventKPIs[3].eventNum = "N/A";
      } else {
        self.eventKPIs[0].eventNum = totalEvents;
        self.eventKPIs[1].eventNum = totalUnprocessed+totalRejected;
        self.eventKPIs[2].eventNum = totalInprocess;
        self.eventKPIs[3].eventNum = (totalEvents==0)? 0 : ((totalProcessed/totalEvents)*100).toFixed(0);
      }

      
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
      params.inspectTagIds = [this.inspectId];
      if(region[0].value<3){ //store, area1, area2
        this.params.storeIds=this.compareIds.filter(storeId => storeId !== '-1')
        params.storeIds = this.compareIds.filter(storeId => storeId !== '-1');
      }else{ //groupType, storeGroup
        this.params.groupIds=this.compareIds.filter(storeId => storeId !== '-1');
        params.groupIds = this.params.storeIds.filter(storeId => storeId !== '-1');
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
            item.completedRateStr = (item.numOfProcessed / numOfTotal * 100).toFixed(0) + '111%';
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
    changeBarchartSorOrder(){
      if(this.barchartOrder == 'desc'){
          this.barchartOrder = 'asc'
      }
      else{
        this.barchartOrder = 'desc'
      }
      this. getEventBarChartData();
    },
    async getEventBarChartData() {
      const self = this;
      self.componentsProps.beginTs = self.params.beginTs;
      self.componentsProps.endTs = self.params.endTs;
      self.componentsProps.inspectTagIds = [self.inspectId];
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      self.params.groupMode = region[0].value;
      let searchCondition = {}
      if(region[0].value<3){ //store, area1, area2
        searchCondition = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,storeIds:self.compareIds.filter(storeId => storeId !== '-1'),
          inspectTagIds : [this.inspectId],
          order:{"direction":this.barchartOrder,"property":"numOfTotal"}
        };
        //console.log("*getEventTableData>searchCondition:",searchCondition);
      }else{ //groupType, storeGroup
        self.params.groupIds=this.compareGroupAndTypeId;
        searchCondition  = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,groupIds:this.compareGroupAndTypeId,
        inspectTagIds : [this.inspectId],
        order:{"direction":this.barchartOrder,"property":"numOfTotal"}
        };
      }
      if(this.compareIds.length>0){
        const eventResult = await self.getEventTableDataInfo(searchCondition);
        //console.log("*getEventTableData>eventResult:",eventResult);
        const ignorePer = 0;
        const errCode = eventResult.errCode;
        if (errCode === 0) {
          const result = eventResult.data.content;
          if (result.length>0) {
            self.eventBarChartData = result;
            this.barActiveName='';
          } else {
            self.eventBarChartData =[];
          }

        }
      }else{
        self.eventBarChartData = [];
      }

      this.doFilterEventListBySelBar( );
      self.setBarchartData()
    },
    getBarchartOption(){
      const self = this;
      const chartOption = {
        width:'100%',
        grid:{
          left:40,
          right:40,
          width:'100%'
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: 'left'
          },
        },
        legend: {
          x: 'right',
          y: 'bottom',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 20,
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
            emphasis: {
              focus:'none',
              itemStyle:{
                  color:'#7bd8eb',
                  borderWidth:'0',
              }
            }
          }
        ],

      };
      return chartOption;
    },
    maxLabel(val) {
        var returnValue = '';
        var byteValLen = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null)
                byteValLen += 2;
            else
                byteValLen += 1;
            if (byteValLen > 10)
            {
                returnValue += '...';
                break;
            }
            returnValue += val[i];
        }
        return returnValue;
    },
    setBarchartData(){
      //this.$ref.itemsChart1.d
      this.barchartOption = {};
      var option = this.getBarchartOption();
      let date_xAxis=[];
      let chart_dataset=[];
      if(this.eventBarChartData.length>0){
        this.eventBarChartData.forEach(item => {
          date_xAxis.push(this.maxLabel(item.groupName));
          chart_dataset.push({value:item.numOfTotal,name:item.groupName,innerId:item.innerId,itemStyle:{color:(item.groupName==this.barActiveName || this.barActiveName=='')?"#7bd8eb":"#D7F3F9"}});
        });
        option.xAxis.data = date_xAxis;
        //this.barchartOption.yAxis.splitLine.show = true;
        //this.barchartOption.series.name= this.Avg12Num[0].name;
        //console.log("chart_dataset:",chart_dataset);
        option.series[0].data = chart_dataset;
        if(date_xAxis.length>18){
          var w = ( date_xAxis.length*90) +'px';

          option.width = w;
          option.grid.width = w;
          this.barchartWidth = w;
        }
        else{
           //option.grid.width = 'calc(1479/1980*100vw)';
            if(this.ispdf){
              option.width = '1024px';
              option.grid.width = '850px';
              option.series[0].barCategoryGap='10',
              option.series[0].barWidth='10',
              this.barchartWidth = '850px';
            }else{
              option.width = 'calc(1479/1980*100vw)';
              option.grid.width = '100%';
              this.barchartWidth = 'calc(1479/1980*100vw)';
            }
          }
        this.barchartOption = option;
        //this.$ref.itemsChart1.on('rendered',()=>{console.log('rendered event fired')});
        //
      }
    },
    /*end 畫barChart */

    /*取得門店事件表 */
    onSwitchMode(val){
      this.viewMode=val;
    },
    doDrawEventChartMode(chartData){

      var option = this.getBarchartOption();
      let date_xAxis=[];
      let chart_dataset=[];
      if(chartData.length>0){
        chartData.forEach(item => {
          date_xAxis.push(this.maxLabel(item.groupName));
          chart_dataset.push({value:item.numOfTotal,name:item.groupName,innerId:item.innerId});
        });
        option.xAxis.data = date_xAxis;
        //this.barchartOption.yAxis.splitLine.show = true;
        //this.barchartOption.series.name= this.Avg12Num[0].name;
        //console.log("chart_dataset:",chart_dataset);
        option.series[0].data = chart_dataset;
        if(date_xAxis.length>25){
          var w = ( date_xAxis.length*90) +'px';

          option.width = w;
          option.grid.width = w;
          this.barchartWidthMode0 = w;
        }
        else{
           //option.grid.width = 'calc(1479/1980*100vw)';
          if(this.ispdf){
            option.width = 'calc(800/1980*100vw)';
              option.grid.width = '800px';
              this.barchartWidthMode0 = 'calc(800/1980*100vw)';
          }else{
            option.width = 'calc(1450/1980*100vw)';
            option.grid.width = '100%';
            this.barchartWidthMode0 = 'calc(1450/1980*100vw)';
          }
        }
        this.barchartOptionViewMode0  = option;
        //
      }

    },

    async getEventTableData() {
      const self = this;
      self.componentsProps.beginTs = self.params.beginTs;
      self.componentsProps.endTs = self.params.endTs;
      //console.log(">>>>self.inspectId:",self.inspectId);
      self.componentsProps.inspectTagIds = (self.inspectId=='')?[]:[self.inspectId];
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      self.params.groupMode = region[0].value;
      self.params.storeIds = self.compareIds.filter(storeId => storeId !== '-1');
      self.params.inspectTagIds = [self.inspectId];
      let searchCondition = {}
      //if(region[0].value<3){ //store, area1, area2
      //console.log("getEventTableData > this.compareIds:",self.compareIds);
      searchCondition = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:0,storeIds:self.compareIds,
          inspectTagIds : (self.inspectId=='')?[]:[this.inspectId]
      };
          //filter:{"page":this.page-1,"size":this.sizeNum},
          //order:this.order
        //};
      //console.log("*getEventTableData>searchCondition:",searchCondition);
      /*}else{ //groupType, storeGroup
        self.params.groupIds=this.compareGroupAndTypeId;
        searchCondition  = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,groupIds:this.compareGroupAndTypeId};
      }*/
      const searchParamsObj = {
        path: 'eventStatistics',
        params: self.params
      };
      //console.log("*getEventTableData>searchParamsObj:",searchParamsObj);
      self.ifSaveParams && self.$refs.eventSearch.saveSearchParams(searchParamsObj);
      self.ifSaveParams = true;
      if(this.compareIds.length>0){
        const eventResult = await self.getEventTableDataInfo(searchCondition);
        console.log('eventResult ~~~~>> ', eventResult);

        const ignorePer = 0;
        const errCode = eventResult.errCode;
        if (errCode === 0) {
          const result = eventResult.data;
          if (result) {
            self.allEventTableData = result.content;
            self.total = Math.ceil(result.totalElements/this.sizeNum);
            //console.log("total page:",self.total)
            self.allEventTableData.forEach(item => {
              const numOfTotal = item.numOfTotal;

              // 已結案＝人工結案＋預期結案
              item.numOfProcessed = item.numOfOverdue + item.numOfProcessed
              
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
      //this.eventTableData = this.allEventTableData;
      //this.getEventTableData();
      this.eventTableData = [];
      //this.eventTableData = [...this.allEventTableData.slice( (this.page - 1)* this.sizeNum, this.page* this.sizeNum)];
      //this.total = Math.ceil(this.eventTableData.length/this.sizeNum);
      this.doFilterEventListBySelBar();
    },
    barchartClick(bar){
      //console.log("barchartClick:",bar);
      if(this.barActiveName == bar.data.name){
        this.barActiveinnerId = '-1';
        this.barActiveName = '';
        this.doFilterEventListBySelBar();
      }else{
        this.barActiveinnerId= bar.data.innerId
        this.barActiveName = bar.data.name;
        this.doFilterEventListBySelBar();
      }
      this.setBarchartData();
      //console.log("***filterResult",filterResult);
    },
    doFilterEventListBySelBar(){
      let name = this.barActiveName;

      console.log("filter name:",name);
      let filterData = name==''? this.allEventTableData:this.allEventTableData.filter(item=>{
        if(this.compareType=="area1"){
          return (item.province == name);
        }else if(this.compareType=="area2"){
          return (item.city == name);
        }else if(this.compareType=="storeGroup"){
          return (item.storeRegion.includes(name));
        }else if(this.compareType=="storeType"){
          return (item.storeBranchType.includes(name));
        }else if(this.compareType=="stores"){
          return (item.groupName == name);
        }
      });
      console.log("filterData:",filterData);
      this.filterData  =  filterData

      this.doDrawEventChartMode(filterData);
      this.total =Math.ceil( filterData.length/this.sizeNum);
      this.eventTableData = [...filterData.slice( (this.page - 1)* this.sizeNum, this.page* this.sizeNum)];

    },
    orderAllTableData(){
      let key = this.defaultSort.prop;
      key = key.indexOf('Str') > -1 ? key.substr(0, key.indexOf('Str')) : key;
      this.defaultSort.order === 'descending' ? this.allEventTableData.sort((a,b) => { return b[key] - a[key] })
                                : this.allEventTableData.sort((a,b) => { return a[key] - b[key] });
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },
    getAllDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day + hour + min + sec
    },
    getDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day 
    },
    getOnlyDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return  month + day 
    },
    
    export2Excel() {
      const that = this;
      if (that.eventTableData.length === 0) {
        util.notify(that.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }

      var needParams = this.params
      const now = new Date()
      var nowTs = this.getAllDate(now)
      var tsbegin = this.getDate(needParams.beginTs)
      var tsEnd = this.getOnlyDate(needParams.endTs)

      needParams.fileName = nowTs + "-Inspection_event-" + tsbegin + tsEnd
      needParams.filter = { page: 0, size: 99999}
      if(this.filterData.length == 1){
        needParams.storeIds = [this.filterData[0].id]
      } else {
        needParams.storeIds = [...this.params.storeIds]
      }
    
      // console.log('this.storeList', this.storeList)
      var tempinspectTagName = []
      if(this.storeList.length == needParams.storeIds.length){
        tempinspectTagName = ["全部"]
      }
      else{
        needParams.storeIds.forEach( i => {
          this.storeList.forEach( n => {
              if(i == n.storeId) tempinspectTagName.push(n.name)
          })
        })
      }

      needParams.conTableName = needParams.inspectName
      needParams.conStoreName = tempinspectTagName.join(', ')
      needParams.requestTs = now.getTime()

      console.log('needParams', needParams)
      this.showExportMassage = true
      exportStatisticsEventGroup(needParams).then(res=>{
        console.log('res :>> ', res);
      })


      // require.ensure([], async() => {
      //   const { export_json_to_excel } = require('@/excel/Export2Excel');
      //   const tHeader = [];
      //   this.eventInfoData.forEach(item=>{
      //     tHeader.push(item.label);
      //   });
      //   const filterVal = ['province', 'city', 'groupName', 'storeGroup', 'storeType','code', 'numOfTotal', 'numOfUnprocessed', 'numOfInprocess',
      //     'numOfProcessed', 'numOfRejected','completedRate'];
      //   const curData = this.allEventTableData;
      //   const data = that.formatJson(filterVal, curData);
      //   const fileName = this.compareType+'_Inspection event' + '_' + util.getCurDateStr();
      //   export_json_to_excel(tHeader, data, fileName);
      // });
    },

    handlePageAndSizeChange(pageObj) { //改變一頁顯示
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.setEventTableData();
    },
    handleCurrentChange(pageObj){ //翻頁
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.setEventTableData();
    },

    handleSortChange(order, defaultSort) {
      this.defaultSort = { ...defaultSort };
      this.order = this.params.order = order;
      this.params.filter = {
        page: this.page - 1,
        size: this.sizeNum
      };
      this.setEventTableData();
    },
    doGetEventSeachParam(row){
      const self = this;
      const params = SearchConditionUtil.getSearchCondition('eventManage');
      const rowItem = row.row;
            //searchParams.searchCondition = JSON.parse(JSON.stringify(this.params))
        params.filterStoreIds=[rowItem.id];
        params.curStore=[rowItem.id];
        params.storeIds=[rowItem.id.filter(storeId => storeId !== '-1')];
        params.curCountry = "-1";
        params.curProvince = [];
        params.curCity = [];
        params.inputSearchValue = "";
        params.curState = [];
        params.activeName = '4';
        params.searchParams.filter ={ page: 0, size: 10 };
        params.beginTs=this.params.beginTs,
        params.endTs=this.params.endTs
        params.searchFrom='EventStatistics';
        return params;
    },
    onEvenListNumClick(row){
      if(!PermissionHelper.enableEventHandle() &&
          !PermissionHelper.enableEventClose() &&
          !PermissionHelper.enableEventAdd() &&
          !PermissionHelper.enableEventReturn()){
        message({
            message: this.$i18n.t('route.noEventAuthority'),
            type: 'error',
            duration: 5 * 1000
          });
        return;
      }
      const self = this;
      var params = SearchConditionUtil.getSearchCondition('eventManage');
      const rowItem = row.row;


      params.filterStoreIds=[rowItem.id];
      params.curStore=[rowItem.id];
      params.storeIds=[rowItem.id];
      params.curCountry = self.params.curCountry;
      params.curProvince = self.params.curProvince;
      params.curCity = self.params.curCity;
      params.inputSearchValue = "";
      params.beginTs=self.params.beginTs;
      params.endTs=self.params.endTs;
      params.inspectTagId = [self.inspectId];
      params.searchFrom='EventStatistics';

      if(row.prop == "numOfTotal"){
        params.activeName = "4";
        params.curState=[];
      }else if(row.prop == "numOfUnprocessed"){
        params.activeName = "0";
        params.curState=[0];
      }else if(row.prop == "numOfInprocess"){
        params.activeName = "1";
        params.curState=[1];
      }else if(row.prop == "numOfProcessed"){
        params.activeName = "2";
        params.curState=[2,4];
      }else if(row.prop == "numOfRejected"){
        params.activeName = "3";
        params.curState=[3];
      }
      params.searchParams = {clause : {storeId:[rowItem.id],status:[]},filter:{ page: 0, size: 10 }};
      params.inputSearchValue="";
      params.sizeNum=10;
      params.page=1;
      params.clause ={storeId:[rowItem.id],storeName:this.barActiveName};

      const searchParamsObj = {
        path: 'eventManage',
        params: params
      };
      //console.log("onEvenListNumClick:",searchParamsObj);
      //this.$refs.eventSearch.saveSearchParams(searchParamsObj);
      SearchConditionUtil.saveSearchCondition(searchParamsObj);
      this.$router.push({ name: 'eventManage', params: params});
    },
    /*巡檢項事件 sec-row*/
    emitTypeChanged2({compareType,compareArr,selectedLabels,selStoreIdArr}){ //劃分類型選擇
      this.showInvolveTableArea = false;
      this.compareType2 = compareType;
      let tempId = [];
      selStoreIdArr.forEach((item)=>{
        if(item!='-1'){
          tempId.push(item);
        }
      });
      this.compareIds2 = tempId;
      /*if(selStoreIdArr.includes("-1")){
        selStoreIdArr.shift();
      }else{
        this.compareIds2 = selStoreIdArr
      }*/
      //console.log("emitTypeChanged2",selStoreIdArr);
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
      self.showInvolveTableArea = false;
      self.eventInvolveTable.table_data = [];
      //console.log("compareIds2",self.compareIds2);
      if(self.compareIds2.length>0 ){
        let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,inspectTagId:self.inspectId,storeIds:self.compareIds2 };
        //console.log("doGetInspecEvenItems:",params);
        const result = await this.getInspecEvenItems(params);

        //self.peiDataSource = result.data;
        self.doGetFirstEventLayer(result.data);
      }else{
        const pieOption = self.getEventBySourcePieOption();
        pieOption.series[0].data = [];
        self.eventSourceOptions = pieOption;
        self.sourcePerArray = [];
        self.eventItemTable.page=1;
        self.eventItemTable.itemAllData=[]
        self.eventItemTable.table_data=[]
      }
    },
    doGetFirstEventLayer(data){
      const childLayer = data.filter(item1 =>{
        return item1.parentId!=-1;
      });
      //console.log("childLayer:",childLayer);
      var sourceData = [];
      if(childLayer.length>0){
        data.forEach((item,index)=>{
          //console.log("data item:",item);
          if(item.parentId == -1 ){ //只抓第一層
            if(item.itemIds.length==0){ //表示他有2類
              const tempLayer = childLayer.filter(layer=>{
              return layer.parentId==item.groupId
              });
              //console.log(" tempLayer:", tempLayer);
              var tagIds = [];//, numOfUnqualified=0, perc=0;
              for(var i=0;i<tempLayer.length;i++){
                tagIds = tagIds.concat(tempLayer[i].itemIds);
                //numOfUnqualified = numOfUnqualified+tempLayer[i].numOfUnqualified
                //perc = perc + tempLayer[i].percentage;
              }
              item.itemIds = tagIds;
              //item.numOfUnqualified = numOfUnqualified;
              //item.percentage = perc/tempLayer.length;
            }
            sourceData.push(item);
          }
        })
        console.log("sourceData:",sourceData);
        this.peiDataSource = sourceData;
            this.getEventBySourcePie();
      }else{
        sourceData = data;
        this.peiDataSource = sourceData;
        this.getEventBySourcePie();
      }

    },
    getEventBySourcePie() {
      const self = this;
      let jsonArray = [];
      let seriesData = [];
      let allItemIds = [];
      //console.log("self.peiDataSource:",self.peiDataSource);
      util.sortArrayByKeyDesc(self.peiDataSource,'numOfUnqualified');
      self.peiDataSource.forEach((item,index) => {
        if(item.numOfUnqualified!=0){

          seriesData.push({value:item.numOfUnqualified,name:item.groupName,id:index,itemIds:item.itemIds});
          jsonArray.push({id:index,itemName:item.groupName,amount:item.numOfUnqualified,percentage:item.percentage,itemIds:item.itemIds});
          allItemIds = allItemIds.concat(item.itemIds);
        }
      });
      this.allEventItemIds=[];
      allItemIds.forEach(id=>{
        if(!this.allEventItemIds.includes(id)) this.allEventItemIds.push(id);
      });
      //this.selEventItem = self.peiDataSource[0].id;
      //this.selEventItemIds = self.peiDataSource[0].itemIds;
      //this.selEventItemName = self.peiDataSource[0].groupName;
      this.selEventItem = -1
      this.selEventItemIds = [];
      this.selEventItemName = self.$t('statistics.event.seeAll');
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
            borderWidth:5,
            borderColor:'#FFF',
            itemStyle: {
              emphasis: {
                borderWidth:10,
                borderColor:'#EDF0F2'
              },
              normal: {
                borderWidth:5,
                borderColor:'#FFF',
                color: function(params) {
                  const colorList = util.getChartColorArray();
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      return pieOption;
    },
    piechartClick(pei){
      //console.log("piechartClick:",pei);
      if(this.selEventItem == pei.data.id){
          this.selEventItem = -1
          this.selEventItemIds = [];
          this.selEventItemName = this.$t('statistics.event.seeAll');
          this.getItemDetail();
      }else{
        this.selEventItem = pei.data.id
        this.selEventItemIds = pei.data.itemIds;
        this.selEventItemName = pei.data.name;
        this.getItemDetail();
      }
    },
    onClickEventItem(item,index){
        //this.showInvolveTableArea = false;
        if(this.selEventItem == item.id){
            this.selEventItem = -1
            this.selEventItemIds = [];
            this.selEventItemName = this.$t('statistics.event.seeAll');
            this.getItemDetail();
        }else{
          this.selEventItem = item.id;//index;
          this.selEventItemIds = item.itemIds;
          this.selEventItemName = item.itemName;
          //console.log("click item>item.itemIds",item.itemIds)
          this.getItemDetail();
        }
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
      self.showInvolveTableArea = false;
      if(this.selEventItem == -1 && self.allEventItemIds.length>0){
        let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,itemIds:self.allEventItemIds,storeIds:self.compareIds2};
        //console.log(params)
        let result = await this.getInspecItemStatsOverview(params);
        self.eventItemTable.itemAllData = result.data;
        self.eventItemTable.total = Math.ceil( self.eventItemTable.itemAllData.length/self.eventItemTable.sizeNum );
        self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
      }
      else if(this.selEventItemIds.length>0){
        //console.log(params)
        let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,itemIds:self.selEventItemIds,storeIds:self.compareIds2};
        let result = await this.getInspecItemStatsOverview(params);
        self.eventItemTable.itemAllData = result.data;
        self.eventItemTable.total = Math.ceil( self.eventItemTable.itemAllData.length/self.eventItemTable.sizeNum );
        self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
      }else{
        self.eventItemTable.page=1;
        self.eventItemTable.itemAllData=[]
        self.eventItemTable.table_data=[]
      }
    },
    async onSeeAllIncepEventClick(){
      const self = this;
      self.showInvolveTableArea = false;
      this.selEventItem =-1;
      self.selEventItemName = self.$t('statistics.event.seeAll');
      let params = {beginTs:self.params.beginTs,endTs:self.params.endTs,itemIds:self.allEventItemIds,storeIds:self.compareIds2 };
      let result = await this.getInspecItemStatsOverview(params);
      self.eventItemTable.itemAllData = result.data;
      self.eventItemTable.total =Math.ceil( self.eventItemTable.itemAllData.length/self.eventItemTable.sizeNum );
      self.eventItemTable.table_data = [...self.eventItemTable.itemAllData.slice((self.eventItemTable.page - 1)* self.eventItemTable.sizeNum, self.eventItemTable.page* self.eventItemTable.sizeNum)];
    },

    export2Excel_eventItem() {
      const self = this;
      if (self.eventItemTable.itemAllData.length === 0) {
        util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      
      const now = new Date()
      var nowTs = this.getAllDate(now)
      var tsbegin = this.getDate(this.params.beginTs)
      var tsEnd = this.getOnlyDate(this.params.endTs)

      this.params.fileName = nowTs + "-"+this.inspectName + "-Inspection_item_event-" + tsbegin + tsEnd
      this.params.itemIds = this.selEventItemIds.length == 0 ? this.allEventItemIds : this.selEventItemIds
      this.params.filter = { page: 0, size: 99999}

      var tempinspectTagName = []
      if(this.storeList.length == this.params.storeIds.length){
        tempinspectTagName = ["全部"]
      }
      else{
        this.params.storeIds.forEach( i => {
          this.storeList.forEach( n => {
              if(i == n.storeId) tempinspectTagName.push(n.name)
          })
        })
      }

      this.params.conTableName = this.params.inspectName
      this.params.conStoreName = tempinspectTagName.join(', ')
      this.params.requestTs = now.getTime()

      this.showExportMassage = true
      console.log('this.params', this.params)
      exportStatisticsInspectOverview(this.params).then(res=>{
        console.log('res :>> ', res);
      })

      // require.ensure([], async() => {
      //   const { export_json_to_excel } = require('@/excel/Export2Excel');
      //   const tHeader = [];
      //   self.eventItemTable.column_data.forEach(item=>{
      //     tHeader.push(item.label);
      //   });
      //   const filterVal = ['groupName', 'itemName', 'numOfUnqualified', 'percentage', 'numOfStore'];
      //   const curData = self.eventItemTable.itemAllData;
      //   const data = self.formatJson(filterVal, curData);
      //   const fileName = (this.selEventItem == -1 ? this.inspectName:this.selEventItemName)+'_Inspection item event' + '_' + util.getCurDateStr();
      //   export_json_to_excel(tHeader, data, fileName);
      // });
    },

    handlePageAndSizeChange_eventItem(pageObj) {
      const self = this;
      self.eventItemTable.page = pageObj.page;
      self.eventItemTable.sizeNum = pageObj.size;
      self.eventItemTable.total = Math.ceil( self.eventItemTable.itemAllData.length/self.eventItemTable.sizeNum );
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
        obj.storeRegionStr = item.storeBranchType.toString();
        obj.storeBranchTypeStr = item.storeRegion.toString();
        obj.percentageStr = item.percentage+'%';
        self.eventInvolveTable.itemAllData.push(obj);
      });
      self.eventInvolveTable.total =Math.ceil( self.eventInvolveTable.itemAllData.length/self.eventInvolveTable.sizeNum);
      this.setEventInvolveTable();
    },
    setEventInvolveTable(){
      this.orderAllTableData_eventStores();
      this.eventInvolveTable.table_data = [];
      let page = this.eventInvolveTable.page;
      let sizeNum = this.eventInvolveTable.sizeNum;
      this.doDrawEventInvolveChartMode(this.eventInvolveTable.itemAllData);
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

      const now = new Date()
      var nowTs = this.getAllDate(now)
      var tsbegin = this.getDate(this.params.beginTs)
      var tsEnd = this.getOnlyDate(this.params.endTs)

      var tempinspectTagName = []
      if(this.storeList.length == this.params.storeIds.length){
        tempinspectTagName = ["全部"]
      }
      else{
        this.params.storeIds.forEach( i => {
          this.storeList.forEach( n => {
              if(i == n.storeId) tempinspectTagName.push(n.name)
          })
        })
      }

      let params = {
        beginTs: this.params.beginTs,
        endTs: this.params.endTs,
        itemId: this.eventInvolveItemId,
        storeIds: this.compareIds2,
        fileName: nowTs + "-Inspection_item_event-" + tsbegin + tsEnd,
        conTableName: this.params.inspectName,
        conStoreName: tempinspectTagName.join(', '),
        requestTs : now.getTime()
      };

      this.showExportMassage = true
      exportStatisticsInspectStore(params).then(res=>{
        console.log('res [6003]:>> ', res);

      })

      // require.ensure([], async() => {
      //   const { export_json_to_excel } = require('@/excel/Export2Excel');
      //   const tHeader = [];
      //   const filterVal =[];
      //   self.eventInvolveTable.column_data.forEach(item=>{
      //     tHeader.push(item.label);
      //     filterVal.push(item.prop);
      //   });
      //   //const filterVal = ['province', 'city', 'name', 'percentage', 'numOfStores'];
      //   const curData = self.eventInvolveTable.itemAllData;
      //   const data = self.formatJson(filterVal, curData);
      //   const fileName = 'Store_Inspection item event' + '_' + util.getCurDateStr();
      //   export_json_to_excel(tHeader, data, fileName);
      // });
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
    doDrawEventInvolveChartMode(chartData){
      var option = this.getBarchartOption();
      let date_xAxis=[];
      let chart_dataset=[];
      if(chartData.length>0){
        chartData.forEach(item => {
          date_xAxis.push(this.maxLabel(item.name));
          chart_dataset.push({value:item.numOfUnqualified,name:item.name,innerId:item.id});
        });
        option.xAxis.data = date_xAxis;
        //this.barchartOption.yAxis.splitLine.show = true;
        //this.barchartOption.series.name= this.Avg12Num[0].name;
        //console.log("chart_dataset:",chart_dataset);
        option.series[0].data = chart_dataset;

        if(date_xAxis.length>28){
          var w = ( date_xAxis.length*90) +'px';

          option.width = w;
          option.grid.width = w;
          this.barchartWidth_sec = w;
        }
        else{
           //option.grid.width = 'calc(1479/1980*100vw)';
           if(this.ispdf){
             option.width = 'calc(800/1980*100vw)';
              option.grid.width = '800px';
              this.barchartWidth_sec = 'calc(800/1980*100vw)';
           }else{
            option.width = 'calc(1479/1980*100vw)';
            option.grid.width = '100%';
            this.barchartWidth_sec = 'calc(1479/1980*100vw)';
           }
        }
        this.barchartOptionViewMode_eventStores = option;

      }

    },
    /*End 事件涉及門店 */
    getBase64(url,width,height,callback){
    //通過建構函式來建立的 img 例項，在賦予 src 值後就會立刻下載圖片，相比 createElement() 建立 <img> 省去了 append()，也就避免了文件冗餘和汙染
      var Img = new Image();

      Img.src=url;
      Img.setAttribute("crossOrigin",'Anonymous')
      Img.onload=function(){ //要先確保圖片完整獲取到，這是個非同步事件
        var canvas = document.createElement("canvas"); //建立canvas元素
        canvas.width=width;
        canvas.height=height;
        canvas.getContext("2d").drawImage(Img,0,0,width,height); //將圖片繪製到canvas中
        let dataURL=canvas.toDataURL('image/jpeg'); //轉換圖片為dataURL
        //console.log("dataURL:",dataURL);
        //return dataURL;
        callback?callback(dataURL):null; //呼叫回撥函式
      };

    },
    handleDown() {
      const self = this;
      if (self.eventTableData.length === 0) {
        util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      self.ispdf = true;
      self.setBarchartData();
      this.$nextTick(async () => {
        const img_amount = document.getElementById('imgTest_amount');
        const img_first = document.getElementById('imgTest_first');
        const img_second = document.getElementById('imgTest_second');
        var attImg = img_second.querySelectorAll('.att-img');
        Promise.all(Array.from(attImg).map((item,i)=>{
            let width = item.width;
            let height = item.height;
            let imgUrl = item.src;
           // var imgElement= item;
            return new Promise((resolve)=>{
              this.getBase64(imgUrl,width,height,(imageURL)=>{
                //console.log("imageURL:",imageURL);
                item.src = imageURL;
                /*var img = document.createElement("img");
                img.src = imageURL;
                img.setAttribute('class', 'att-img');
                img.width = width;
                img.height = height;
                img.id = 'isNeedRemove'+i;
                imgElement['parentNode'].insertBefore(img,imgElement.nextElementSibling);*/
                resolve(true);
              });
            }).then(result=>{
                //console.log("result");
                return result;
              });
            })
        ).then(result=>{
          //console.log("Promise result:",result);
          //if(result.length == attImgcount){
            //console.log("continue print");
            //var img_second2 = document.getElementById('imgTest_second');
            setTimeout(() => {
              html2canvas(img_amount).then(function(canvas) {
                var oGrayImg1 = canvas.toDataURL('image/jpeg');
                self.pdfSrc_amount = oGrayImg1;
              });
              html2canvas(img_first).then(function(canvas) {
                var oGrayImg2 = canvas.toDataURL('image/jpeg');
                self.pdfSrc_first = oGrayImg2;
              });
              html2canvas(img_second).then(function(canvas) {
                var oGrayImg3 = canvas.toDataURL('image/jpeg');
                self.pdfSrc_second = oGrayImg3;
              });
              setTimeout(() => {
                self.$print(self.$refs.printPDF,null,self.$t('route.eventStat')+ util.getCurrentTime());
                /*let removes = document.querySelectorAll("[id^='isNeedRemove']");
                console.log("@@removes:",removes);
                if(removes.length>1){
                  for(var k=0;k<removes.length;k++){
                    removes[k].parentNode.removeChild(removes[k])
                  }
                }*/
                self.ispdf = false;
                self.setBarchartData();
              }, 2000);
            }, 5000);
          //}
        })


      });
    },

    adjustChart() {
      this.$refs.pieChartRef && this.$refs.pieChartRef.resize();
      this.$refs.storeEventRef && this.$refs.storeEventRef.resize();
    },
    exportPdf() {
      this.storeNameStr = this.params.storeStr;
      this.storeGroupStr = this.params.storeGroupStr;
      this.storeTypeStr = this.params.storeTypeStr;
      this.handleDown();
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    setDefaultSortAndPage(paramsObj) {
      this.defaultSort = paramsObj.defaultSort;
      this.order = this.params.order = paramsObj.order;
    },
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
            width: auto;
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
              width:calc(344/1440*100vw);
              height: 30px;
              align-items: center;
              padding:0;
              justify-content: space-between;
            }
            .operation-btns-en{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
            }
            .operation-btns-zh{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
            }
            .operation-btns-zhTW{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
            }
            .operation-btns-ja{
              @media screen and (max-width:1559px) {
                width: 435px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-ko{
              @media screen and (max-width:1559px) {
                width: 425px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-vi{
              @media screen and (max-width:1559px) {
                width: 425px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-th{
              @media screen and (max-width:1559px) {
                width: 425px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-id{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
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
        .AllIncepEvent-btns-en{
          width:210px;
        }
        .AllIncepEvent-btns-zh{
          width:210px;
        }
        .AllIncepEvent-btns-zhTW{
          width:210px;
        }
        .AllIncepEvent-btns-ja{
          width:260px;
          font-size: 13px;
        }
        .AllIncepEvent-btns-ko{
          width:210px;
        }
        .AllIncepEvent-btns-vi{
          width:230px;
          font-size: 13px;
        }
        .AllIncepEvent-btns-th{
          width:230px;
          font-size: 13px;
        }
        .AllIncepEvent-btns-id{
          width:230px;
          font-size: 13px;
        }

        .pie-area{
          height:300px;
          margin-left: calc(36/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          display:flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .pie-div{
            width: 40%;
            height: 276px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: end;
            align-self: center;
            .inner{
              position:absolute;
              height: 150px;
              width: 150px;
              margin-right: 62px;
              top:143px;
              border-radius: 50%;
              border-color:#dae4eb;
              border-style:dashed dashed dashed dashed;
            }
            .pct-panel{
              width: 276px;/*calc(276/1440*100vw);*/
              height: 276px;/*calc(276/1440*100vw);*/
              border-radius: 50%;
              border-color:#dae4eb;
              border-style:dashed dashed dashed dashed;
              align-self: end;

              .chart-content {
                width:100%;
                height:100%;
              }
            }
          }
          .pie-label-area{
            cursor: pointer;
            width: calc(300/1440*100vw);
            height: 40px;
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
            width: calc(300/1440*100vw);
            height: 40px;
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
              height: 30px;
              align-items: center;
              padding:0;
              justify-content: space-between;
            }
            .operation-btns-en{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
            }
            .operation-btns-zh{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
            }
            .operation-btns-zhTW{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(344/1440*100vw);
              }
            }
            .operation-btns-ja{
              @media screen and (max-width:1559px) {
                width: 445px;
              }
              @media screen and(min-width: 1600px){
                width:calc(400/1440*100vw);
              }
            }
            .operation-btns-ko{
              @media screen and (max-width:1559px) {
                width: 425px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-vi{
              @media screen and (max-width:1559px) {
                width: 425px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-th{
              @media screen and (max-width:1559px) {
                width: 425px;
              }
              @media screen and(min-width: 1600px){
                width:calc(374/1440*100vw);
              }
            }
            .operation-btns-id{
              @media screen and (max-width:1559px) {
                width: 410px ;
              }
              @media screen and(min-width: 1600px){
                width:calc(364/1440*100vw);
              }
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
        .barchart-area{
          height:271px;
          margin-left: calc(36/1440*100vw);
          margin-right: calc(24/1440*100vw);
          .chart-content {
            width: 100%;
            height: 100%;
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
