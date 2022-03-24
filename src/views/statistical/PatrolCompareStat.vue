<template>
    <div>
      <div style="display: none">
        <div class="no-print">
          <delay-button
            id="downloadPdf"
            class="exportbtn"
            type="primary"
            size="mini"
            @click="exportPDF"
          >
            <div class="button-area">
              <i class="iconfont icon-pdf export"/>
              <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
            </div>
          </delay-button>
        </div>
      </div>
      <el-row class="statistics-container">
          <el-col :span="24" class="aaa">
              <search-component
              ref="inspectEvalutionSearch"
              isInspectItem=true
              :showDateSelector = "false"
              path="PatrolCompareStat"
              @emitSearch = "emitSearch"/>
          </el-col>
          <el-col :span="24">
            <div id="imgTest_avg" :class="ispdf ? 'statistics-content-pdf':'statistics-content'" style="height: 735px;" >
                <div class="head">
                    <el-col :span="17">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.averageCompare') }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <AreaDateTimeSelected @emitFilterDateRange="emitFilterDateRange"></AreaDateTimeSelected>
                    </el-col>
                </div>
                <div class="average-cahrt">
                  <div style="height:68px;margin-top: 16px;">
                    <TypeSelectArea
                      path="PatrolCompareStat"
                      :allow-all=false
                      :limit-num=2
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
                  <div v-if="Avg12Num.length>0" class="avg-score" style="background-color:#fdf6f4;justify-content:space-between;">
                    <div class="avg12item" style="width:170px;">
                      <div class="score-item-name">{{Avg12Num[0].name}}</div>
                      <div style="margin-left:10px;">{{$t('statistics.averageScore')}}</div>
                    </div>
                    <div class="avg12item">
                      <div style="font-size:24px;font-weight:600;color: #f57949;">{{Avg12Num[0].score}}</div>
                      <div style="margin-left:10px;margin-right:10px;">{{$t('statistics.score')}}</div>
                    </div>
                  </div>
                  <div v-if="Avg12Num.length>1" class="avg-score" style="background-color:#edf6e8;justify-content:space-between;">
                    <div class="avg12item" style="width:170px;">
                      <div class="score-item-name" >{{Avg12Num[1].name}}</div>
                      <div style="margin-left:10px;">{{$t('statistics.averageScore')}}</div>
                    </div>
                    <div class="avg12item">
                      <div style="font-size:24px;font-weight:600;color: #59ab22;">{{Avg12Num[1].score}}</div>
                      <div style="margin-left:10px;margin-right:10px;">{{$t('statistics.score')}}</div>
                    </div>
                  </div>
                  <div class="pct-panel-pdf" v-if="ispdf && avgChartOption">
                      <div v-show="showNoData" style="position: absolute;margin-top:116px;margin-left:503px;width:90px;height:136px;align-item:center;background-color:'gray'">
                        <img src="../../../static/img/statistics/ic_nodata.svg" style="widht:90px;height:81px;" />
                        <div style="height:55px;display:flex;justify-content:center;flex-direction:column">
                          <div style="height:25px;font-size:18px;color:#b7c7df">{{$t('statistics.noData')}}</div>
                        </div>
                      </div>
                      <v-chart ref="itemsChart1" autoresize :options="avgChartOption" class="chart-content" width="1000px"/>
                    </div>
                  <div else class="pct-panel" v-if="!ispdf && avgChartOption">
                    <div v-show="showNoData" style="position: absolute;margin-top:116px;margin-left:503px;width:90px;height:136px;align-item:center;background-color:'gray'">
                      <img src="../../../static/img/statistics/ic_nodata.svg" style="widht:90px;height:81px;" />
                      <div style="height:55px;display:flex;justify-content:center;flex-direction:column">
                        <div style="height:25px;font-size:18px;color:#b7c7df">{{$t('statistics.noData')}}</div>
                      </div>
                    </div>
                    <v-chart ref="itemsChart1" autoresize :options="avgChartOption" class="chart-content"/>
                  </div>
                  
                </div>
            </div>
            <div id="imgTest_assm" v-if="standardRate!='- -'" :class="ispdf ? 'statistics-content-pdf':'statistics-content'" style="height: 700px;margin-top:24px;">
                <div class="head">
                    <el-col :span="17">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.assessemntCompare') }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <AreaDateTimeSelected @emitFilterDateRange="emitFilterDateRange2"></AreaDateTimeSelected>
                    </el-col>
                </div>
                <div class="average-cahrt">
                  <div style="height:68px;margin-top: 16px;">
                    <TypeSelectArea
                      path="PatrolCompareStat"
                      :allow-all=false
                      :limit-num=2
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
                  <div  class="score-area" style="display:flex;flex-direction:row;height:92px;align-item:center;">
                    <div style="width:145px;border-right:solid 1px #f7f9f9;">
                      <div style="height:70px;font-size:48px;color:#484848;">{{standardRate}}<span style="font-size:15px;">{{$t('statistics.score')}}</span></div>
                      <div style="font-size:15px;">{{$t('statistics.standardScore')}}</div>
                    </div>
                    <div>
                      <div v-if="Ass12Num.length>0" class="avg-score" style="width:260px;background-color:#fdf6f4;justify-content:space-between;margin-left:24px;">
                        <div class="avg12item" style="width:200px;">
                          <el-tooltip effect="light" placement="bottom">
                            <div slot="content">{{Ass12Num[0].name}}</div>
                            <div class="score-item-name" >{{Ass12Num[0].name}}</div>
                          </el-tooltip>
                          <div style="margin-left:10px;width:80px;">{{$t('statistics.standardRate')}}</div>
                        </div>
                        <div class="avg12item">
                          <div style="font-size:24px;font-weight:600;color: #f57949;">{{Ass12Num[0].score}}</div>
                          <div style="margin-left:10px;margin-right:10px;">%</div>
                        </div>
                      </div>
                      <div v-if="Ass12Num.length>1" class="avg-score" style="width:260px;background-color:#edf6e8;justify-content:space-between;margin-left:24px;">
                        <div class="avg12item" style="width:200px;">
                          <div class="score-item-name" >{{Ass12Num[1].name}}</div>
                          <div style="margin-left:10px;width:80px;">{{$t('statistics.standardRate')}}</div>
                        </div>
                        <div class="avg12item">
                          <div style="font-size:24px;font-weight:600;color: #59ab22;">{{Ass12Num[1].score}}</div>
                          <div style="margin-left:10px;margin-right:10px;">%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="ispdf" class="pct-panel-pdf">
                      <div v-show="showNoData2" style="position: absolute;margin-top:116px;margin-left:503px;width:90px;height:136px;align-item:center;background-color:'gray'">
                        <img src="../../../static/img/statistics/ic_nodata.svg" style="widht:90px;height:81px;" />
                        <div style="height:55px;display:flex;justify-content:center;flex-direction:column">
                          <div style="height:25px;font-size:18px;color:#b7c7df">{{$t('statistics.noData')}}</div>
                        </div>
                      </div>
                      <v-chart ref="itemsChart2" autoresize :options="AssChartOption" :class="ispdf?'chart-content':'chart-content-pdf'"/>
                    </div>
                  <div else class="pct-panel">
                    <div v-show="showNoData2" style="position: absolute;margin-top:116px;margin-left:503px;width:90px;height:136px;align-item:center;background-color:'gray'">
                      <img src="../../../static/img/statistics/ic_nodata.svg" style="widht:90px;height:81px;" />
                      <div style="height:55px;display:flex;justify-content:center;flex-direction:column">
                        <div style="height:25px;font-size:18px;color:#b7c7df">{{$t('statistics.noData')}}</div>
                      </div>
                    </div>
                    <v-chart ref="itemsChart2" autoresize :options="AssChartOption" :class="ispdf?'chart-content':'chart-content-pdf'"/>
                  </div>
                </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div id="pdf-area" ref="printPDF" v-if="ispdf" >
              <div class="statistics-content-pdf" style="height: 735px;">
                <div id="img_avg" >
                  <img :src="pdfSrc_avg">
                </div>
              </div>
              <div v-if="standardRate!='- -'" class="statistics-content-pdf" style="height: 700px;margin-top:24px;">
                <div id="img_assm"  class="avg-score" >
                    <img :src="pdfSrc_assm">
                </div>
              </div>
          </div>
          </el-col>
          
          <div v-if="false">
            <el-col :span="24">
            <div id="imgTest_avg1" class="statistics-content-pdf" style="height: 735px;" >
                  <div class="head">
                      <el-col :span="17">
                          <div class="region-titles">
                              <span class="title">
                                  {{ $t('statistics.averageCompare') }}
                              </span>
                          </div>
                      </el-col>
                      <el-col :span="7">
                          <AreaDateTimeSelected @emitFilterDateRange="emitFilterDateRange"></AreaDateTimeSelected>
                      </el-col>
                  </div>
                  <div class="average-cahrt">
                    <div style="height:68px;margin-top: 16px;">
                      <TypeSelectArea
                        path="PatrolCompareStat"
                        :allow-all=false
                        :limit-num=2
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
                    <div v-if="Avg12Num.length>0" class="avg-score" style="background-color:#fdf6f4;justify-content:space-between;">
                      <div class="avg12item" style="width:170px;">
                        <div class="score-item-name">{{Avg12Num[0].name}}</div>
                        <div style="margin-left:10px;">{{$t('statistics.averageScore')}}</div>
                      </div>
                      <div class="avg12item">
                        <div style="font-size:24px;font-weight:600;color: #f57949;">{{Avg12Num[0].score}}</div>
                        <div style="margin-left:10px;margin-right:10px;">{{$t('statistics.score')}}</div>
                      </div>
                    </div>
                    <div v-if="Avg12Num.length>1" class="avg-score" style="background-color:#edf6e8;justify-content:space-between;">
                      <div class="avg12item" style="width:170px;">
                        <div class="score-item-name" >{{Avg12Num[1].name}}</div>
                        <div style="margin-left:10px;">{{$t('statistics.averageScore')}}</div>
                      </div>
                      <div class="avg12item">
                        <div style="font-size:24px;font-weight:600;color: #59ab22;">{{Avg12Num[1].score}}</div>
                        <div style="margin-left:10px;margin-right:10px;">{{$t('statistics.score')}}</div>
                      </div>
                    </div>
                    <div  class="pct-panel-pdf" v-if="avgChartOption">
                      <div v-show="showNoData" style="position: absolute;margin-top:116px;margin-left:503px;width:90px;height:136px;align-item:center;background-color:'gray'">
                        <img src="../../../static/img/statistics/ic_nodata.svg" style="widht:90px;height:81px;" />
                        <div style="height:55px;display:flex;justify-content:center;flex-direction:column">
                          <div style="height:25px;font-size:18px;color:#b7c7df">{{$t('statistics.noData')}}</div>
                        </div>
                      </div>
                      <v-chart ref="itemsChart1" :auto-resize="true" :options="avgChartOption" class="chart-content"/>
                    </div>
                  </div>
            </div>
            </el-col>
            <el-col :span="24">
            <div id="imgTest_assm1" class="statistics-content-pdf" style="height: 700px;margin-top:24px;=">
                  <div class="head">
                      <el-col :span="17">
                          <div class="region-titles">
                              <span class="title">
                                  {{ $t('statistics.assessemntCompare') }}
                              </span>
                          </div>
                      </el-col>
                      <el-col :span="7">
                          <AreaDateTimeSelected @emitFilterDateRange="emitFilterDateRange2"></AreaDateTimeSelected>
                      </el-col>
                  </div>
                  <div class="average-cahrt">
                    <div style="height:68px;margin-top: 16px;">
                      <TypeSelectArea
                        path="PatrolCompareStat"
                        :allow-all=false
                        :limit-num=2
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
                    <div  class="score-area" style="display:flex;flex-direction:row;height:92px;align-item:center;">
                      <div v-show="standardRate!='- -'" style="width:145px;border-right:solid 1px #f7f9f9;">
                        <div style="height:70px;font-size:48px;color:#484848;">{{standardRate}}<span style="font-size:15px;">{{$t('statistics.score')}}</span></div>
                        <div style="font-size:15px;">{{$t('statistics.standardScore')}}</div>
                      </div>
                      <div>
                        <div v-if="Ass12Num.length>0" class="avg-score" style="width:260px;background-color:#fdf6f4;justify-content:space-between;margin-left:24px;">
                          <div class="avg12item" style="width:200px;">
                            <el-tooltip effect="light" placement="bottom">
                              <div slot="content">{{Ass12Num[0].name}}</div>
                              <div class="score-item-name" >{{Ass12Num[0].name}}</div>
                            </el-tooltip>
                            <div style="margin-left:10px;width:80px;">{{$t('statistics.standardRate')}}</div>
                          </div>
                          <div class="avg12item">
                            <div style="font-size:24px;font-weight:600;color: #f57949;">{{Ass12Num[0].score}}</div>
                            <div style="margin-left:10px;margin-right:10px;">%</div>
                          </div>
                        </div>
                        <div v-if="Ass12Num.length>1" class="avg-score" style="width:260px;background-color:#edf6e8;justify-content:space-between;margin-left:24px;">
                          <div class="avg12item" style="width:200px;">
                            <div class="score-item-name" >{{Ass12Num[1].name}}</div>
                            <div style="margin-left:10px;width:80px;">{{$t('statistics.standardRate')}}</div>
                          </div>
                          <div class="avg12item">
                            <div style="font-size:24px;font-weight:600;color: #59ab22;">{{Ass12Num[1].score}}</div>
                            <div style="margin-left:10px;margin-right:10px;">%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="pct-panel-pdf">
                      <div v-show="showNoData2" style="position: absolute;margin-top:116px;margin-left:503px;width:90px;height:136px;align-item:center;background-color:'gray'">
                        <img src="../../../static/img/statistics/ic_nodata.svg" style="widht:90px;height:81px;" />
                        <div style="height:55px;display:flex;justify-content:center;flex-direction:column">
                          <div style="height:25px;font-size:18px;color:#b7c7df">{{$t('statistics.noData')}}</div>
                        </div>
                      </div>
                      <v-chart ref="itemsChart2" :auto-resize="true" :options="AssChartOption" :class="ispdf?'chart-content':'chart-content-pdf'"/>
                    </div>
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
import {getInspectStatsOverviewWithGroup} from '@/api/inspectOverview';
import { GetInspectTagList } from '@/api/inspect';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TablePagination from '@/components/TablePagination';
import DialogPop from '@/components/DialogPop';
import DelayButton from '@/components/DelayButton';
import AreaDateTimeSelected from '@/components/AreaDateTimeSelected';
import AreaSelected from '@/components/AreaSelected';
import TypeSelectArea from '@/components/TypeSelectArea';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { left } from '../../../static/video';
export default {
  name: 'PatrolCompareStat',

  components: {
    DelayButton,
    DialogPop,
    'v-chart': ECharts,
    LimitSelect,
    SearchComponent,
    TablePagination,
    AreaDateTimeSelected,
    AreaSelected,
    TypeSelectArea
  },
  mixins: [resize],
  data() {
    return {
        lang: this.$i18n.locale,
        params: {},
        searchParams:{},
        daysRangeList : [],
        curRegionI : [],
        curRegionII : [],
        regionMode : [],
        timeMode : 1,
        storePatrolLists :[],
        curInspectId:-1,
        curCountry:"-1",
        areaMode:[{key:'area1',value:1},{key:'area2',value:2},{key:'stores',value:0},{key:'storeGroup',value:4},{key:'storeType',value:3}],
        filterDateRange:[],
        compareIds:[],
        comapareLabels:[],
        compareType:'stores',
        Avg12Num:[],
        avgChartOption:null,
        showNoData:true,
        filterDateRange2:[],
        compareIds2:[],
        comapareLabels2:[],
        compareType2:'stores',
        Ass12Num:[],
        AssChartOption:null,
        showNoData2:true,
        standardRate:'- -',
        storeIds:[],
        ispdf:false,
      pdfSrc_avg:'',
      pdfSrc_assm:''
    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        await this.initData();
      }
    }
  },

  async created() {
    await this.initData();
  },

  beforeDestroy() {
    this.$refs.itemsChart && this.$refs.itemsChart.dispose();
    this.$refs.itemsChart2 && this.$refs.itemsChart2.dispose();
  },
  methods: {
    initData() {
        this.params.filter = { page: 0, size: this.sizeNumStore };
        this.getSearchParams();
        let today = Date.now();
        let start = this.$moment(today).startOf('week').format("YYYY/MM/DD");
        let end = this.$moment(today).endOf('week').format("YYYYY/MM/DD");
        let dateRange = this.doGetPre12DateRange(start,end,'week');
        this.filterDateRange = dateRange;
        this.filterDateRange2 = dateRange;
        this.avgChartOption = this.getAverageBarchartOption();
        this.assChartOption = this.getAverageBarchartOption();
        this.doGetAverageScore(dateRange); //預設本周
        this.doGetAssessmentScore(dateRange);
        this.getInspectTagStandardScore();
    },
    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('PatrolCompareStat');
      console.log("!!searchParams:",searchParams);
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      this.params.beginTs = this.dateValue[0].valueOf();
      this.params.endTs = this.dateValue[1].valueOf();
      if (Object.keys(searchParams).length > 0) {
        //this.curCountry = searchParams.curCountry;
        this.params.timeMode = this.timeMode;
        this.params.inspectId = searchParams.inspectId;
        this.params.curCountry = searchParams.curCountry;
        this.timeMode = searchParams.timeMode;
        this.order = searchParams.order;
        this.filter = searchParams.filter;
        this.inspectCatch = searchParams.inspectId;
        this.ifGetParamsFromCash = true;
        this.searchParams = searchParams;
        if(this.params.inspectId!=-1){
          this.doGetAssessmentStandardScore();
        }
      } else {
        this.searchParams = {};
      }
      const daysDiff = this.$moment(this.params.endTs).diff(this.params.beginTs, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
    },
    emitSearch({ searchParams, dateRangeList, regionI, regionII, regionMode, storePatrolLists, timeMode }) {
      console.log("emitSearch:",searchParams);
      this.storeIds = [];
      this.params = searchParams;
      this.storeIds = this.params.storeIds;
      this.daysRangeList = dateRangeList;
      this.curRegionI = regionI;
      this.curRegionII = regionII;
      this.regionMode = regionMode;
      this.timeMode = timeMode;
      this.storePatrolLists = storePatrolLists;
      const searchParamsObj = {
        path: 'PatrolCompareStat',
        params: this.params
      };
      this.ifSaveParams && this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
      this.ifSaveParams = true;
      console.log("emitSearch > params",this.params);
      this.curCountry = this.params.curCountry;
      //console.log("emitSearch > inspectId",this.params.inspectId );
      
      this.searchData();
    },
    async searchData() {
      this.storeDateValue = util.getDates(this.params.beginTs) + '-' + util.getDates(this.params.endTs);
      this.searchParams = SearchConditionUtil.getSearchCondition(this.path);
      //("searchData > this.searchParams:",this.searchParams);
      if (this.params.storeIds.length > 0) {
        //await this.getInspectStatsOverviewOfRegion();
        //wait this.getInspectStatsOverviewOfStore();
        //await this.getInspectStatsLine();
        this.compareIds = this.params.storeIds;
        this.compareType='stores';
        this.compareIds2  = this.params.storeIds;
        this.compareType2='stores',
        this.doGetAverageScore(this.filterDateRange); 
        this.doGetAssessmentScore(this.filterDateRange2);
        if(this.params.inspectId!=-1){
          this.doGetAssessmentStandardScore();
        }
      } else {
        this.compareIds = [];
        this.comapareLabels=[];
        this.compareType='stores';
        this.Avg12Num=[];
        this.avgChartOption=null;
        this.filterDateRange2=[];
        this.compareIds2=[];
        this.comapareLabels2=[];
        this.compareType2='stores',
        this.Ass12Num=[];
        this.AssChartOption=null;
        this.standardRate='- -';
        this.doGetAverageScore(this.filterDateRange); 
        this.doGetAssessmentScore(this.filterDateRange2);
      }
    },
    doGetPre12DateRange(start_date,end_date,range_type){
      var DateRangeFilter = [];
      let addKey = (range_type == "week")?'w':'M';
      for(let i=11; i>=0; i--){
        let start = this.$moment(start_date).add(-1*i,addKey);
        let end = this.$moment(end_date).add(-1*i,addKey);
        DateRangeFilter.push({startDate:start,endDate:end});
      }
      this.filterDateRange=DateRangeFilter;
      return DateRangeFilter;
    },
    /****平均分同比 ****/
    emitFilterDateRange({start_date,end_date,range_type}){
      //console.log("**1."+start_date+", "+end_date);
      this.doGetPre12DateRange(start_date,end_date,range_type);
      //console.log("DateRangeFilter:",DateRangeFilter);
      this.doGetAverageScore(this.filterDateRange);
    },
    emitTypeChanged({compareType,compareArr,selectedLabels,selStoreIdArr}){ //劃分類型選擇
      this.compareType = compareType;
      if(compareType=="area1" || compareType=='area2') this.compareIds = selStoreIdArr;
      else this.compareIds = compareArr;
      this.comapareLabels = selectedLabels;
      this.doGetAverageScore(this.filterDateRange);
    },
    async doGetAverageScore(DateRangeFilter){ //同比時間區間選擇
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      this.Avg12Num = [];
      this.avgChartOption = this.getAverageBarchartOption();
      //console.log("this.comapareLabels:",this.comapareLabels);
      //console.log("this.compareIds:",this.compareIds);
      console.log("this.compareIds:",this.compareIds);
      if(this.comapareLabels.length>0 && this.inspectId!=-1){
        let Average12;
        if(region[0].value<3){ //store, area1, area2
          Average12 = {beginTs:Date.parse(DateRangeFilter[0].startDate),endTs:Date.parse(DateRangeFilter[11].endDate),groupMode:region[0].value,storeIds:this.compareIds};
        }else{ //groupType, storeGroup
          Average12 = {beginTs:Date.parse(DateRangeFilter[0].startDate),endTs:Date.parse(DateRangeFilter[11].endDate),groupMode:region[0].value,groupIds:this.compareIds};
        }
        

        const areaAverage = await this.getInspectStatsDistributionOverRegion(Average12);
        //console.log("**Average12:",areaAverage);
        if(areaAverage.errCode==0){ //上方顯示12周/月 的評均分
          this.doParseAverage12Score(areaAverage.data.content);
        }
        let date_xAxis=[];
        const promisesAvgMap = DateRangeFilter.map((date) =>{
          date_xAxis.push(this.$moment(date.startDate).format("MM/DD")+'-'+
                          this.$moment(date.endDate).format("MM/DD"));
          let params = {};
          if(region[0].value<3){ //store, area1, area2
            params = {beginTs:Date.parse(date.startDate),endTs:Date.parse(date.endDate),groupMode:region[0].value,storeIds:this.compareIds};
          }else{ //groupType, storeGroup
            params = {beginTs:Date.parse(date.startDate),endTs:Date.parse(date.endDate),groupMode:region[0].value,groupIds:this.compareIds};
          }
          return this.getInspectStatsDistributionOverRegion(params);
        });
        console.log('promisesAvgMap:',promisesAvgMap);
        Promise.all(promisesAvgMap).then((result)=>{
          console.log('result:',result);
          let AvgChartDataset = [];
          AvgChartDataset[0] = new Array();
          AvgChartDataset[1] = new Array();
          for(var i=0; i<result.length;i++){
            if(result[i].errCode == 0){
              let resData = result[i].data;
              //("resData:",resData);
              if(resData.content.length>0) {
                this.showNoData = false;
                for(var j=0; j<2;j++){
                  let ds = resData.content.filter(item=>{
                    return item.groupName == this.comapareLabels[j];
                  });
                  if(ds.length>0){
                    AvgChartDataset[j].push(ds[0].averageScore);
                  }else{
                    AvgChartDataset[j].push(0);
                  }
                }
              }else{
                AvgChartDataset[0].push(0);
                AvgChartDataset[1].push(0);
              }
            }else{AvgChartDataset.push(0);}

          }
          //console.log("this.showNoData:",this.showNoData)
          if(this.showNoData || this.Avg12Num.length<0){
            this.avgChartOption.yAxis[0].splitLine.show = false;
          }else{
            this.avgChartOption.xAxis.data = date_xAxis;
            this.avgChartOption.yAxis[0].splitLine.show = true;
            this.avgChartOption.series[0].name= this.Avg12Num[0].name;
            this.avgChartOption.series[0].data = AvgChartDataset[0];
            if(this.Avg12Num.length>1){
              this.avgChartOption.series[1].name= this.Avg12Num[1].name;
              this.avgChartOption.series[1].data = AvgChartDataset[1];
            }
          }
        }).catch(err => {
          console.log('promisesAvgMap - getInspectStatsDistributionOverRegion: ' + err);
        });
      }else{
        //console.log("this.compareIds:",this.compareIds)
        this.showNoData=true;
        this.avgChartOption.yAxis[0].splitLine.show = false;
        this.avgChartOption.series[0].name= "";
          this.avgChartOption.series[1].name= "";
      }
    },
    doParseAverage12Score(avgData){
      const self = this;
      
      this.comapareLabels.forEach(label=>{
        console.log("label:",label)
        let avg = avgData.filter(data=>{
          console.log("data:",data)
          return (data.groupName==label)
        });
        console.log("avg:",avg)
        if(avg.length>0){
          self.Avg12Num.push({name:avg[0].groupName,score:parseInt(avg[0].averageScore).toString()});
        }else{
          self.Avg12Num.push({name:label,score:"- -"});
        }
      })
    },
     /****end for 平均分同比 ****/

     /****考評達標同比同比 ****/
    emitFilterDateRange2({start_date,end_date,range_type}){
      //console.log("**1."+start_date+", "+end_date);
      this.doGetPre12DateRange(start_date,end_date,range_type);
      //console.log("DateRangeFilter:",DateRangeFilter);
      this.doGetAssessmentScore(this.filterDateRange);
    },
    emitTypeChanged2({compareType,compareArr,selectedLabels,selStoreIdArr}){ //劃分類型選擇
      this.compareType2 = compareType;
      if(compareType=="area1" || compareType=='area2') this.compareIds2 = selStoreIdArr;
      else this.compareIds2 = compareArr;
      this.comapareLabels2 = selectedLabels;
      this.doGetAssessmentScore(this.filterDateRange);
    },
    async doGetAssessmentScore(DateRangeFilter){ //同比時間區間選擇
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType2});
      this.Ass12Num = [];
      this.AssChartOption = this.getAverageBarchartOption();
      //console.log("this.comapareLabels2:",this.comapareLabels2);
      
      
      if(this.comapareLabels2.length>0 && this.inspectId!=-1){
        let Assessment={};
        if(region[0].value<3){ //store, area1, area2
          Assessment = {beginTs:Date.parse(DateRangeFilter[0].startDate),endTs:Date.parse(DateRangeFilter[11].endDate),groupMode:region[0].value,storeIds:this.compareIds2};
        }else{ //groupType, storeGroup
          Assessment = {beginTs:Date.parse(DateRangeFilter[0].startDate),endTs:Date.parse(DateRangeFilter[11].endDate),groupMode:region[0].value,groupIds:this.compareIds2};
        }
        console.log("Assessment:",Assessment);

        const areaAverage = await this.getInspectStatsDistributionOverRegion(Assessment);
        //console.log("**Assessment:",areaAverage);
        if(areaAverage.errCode==0){ //上方顯示12周/月 的評均分
          this.doParseAssessment12Score(areaAverage.data.content);
        }
        let date_xAxis=[];
        const promisesAvgMap = DateRangeFilter.map((date) =>{
          date_xAxis.push(this.$moment(date.startDate).format("MM/DD")+'-'+
                          this.$moment(date.endDate).format("MM/DD"));
          let params = {};
          if(region[0].value<3){ //store, area1, area2
            params = {beginTs:Date.parse(date.startDate),endTs:Date.parse(date.endDate),groupMode:region[0].value,storeIds:this.compareIds2};
          }else{ //groupType, storeGroup
            params = {beginTs:Date.parse(date.startDate),endTs:Date.parse(date.endDate),groupMode:region[0].value,groupIds:this.compareIds2};
          }
          return this.getInspectStatsDistributionOverRegion(params);
        });
        
        Promise.all(promisesAvgMap).then(result=>{
          let AssChartDataset = [];
          AssChartDataset[0] = new Array();
          AssChartDataset[1] = new Array();
          for(var i=0; i<result.length;i++){
            if(result[i].errCode == 0){
              let resData = result[i].data;
             //console.log("resData:",resData);

              if(resData.content.length>0) {
                this.showNoData2 = false;
                for(var j=0; j<2;j++){
                  let ds = resData.content.filter(item=>{
                    return item.groupName == this.comapareLabels2[j];
                  });
                  if(ds.length>0){
                    AssChartDataset[j].push(ds[0].numOfStandard);
                  }else{
                    AssChartDataset[j].push(0);
                  }
                }
              }else{
                AssChartDataset[0].push(0);
                AssChartDataset[1].push(0);
              }

            }else{AssChartDataset.push(0);}

          }
          //console.log("this.showNoData2:",this.showNoData2)
          if(this.showNoData2 || this.Ass12Num.length<0){
            this.AssChartOption.yAxis[0].splitLine.show = false;
          }else{
            this.AssChartOption.xAxis.data = date_xAxis;
            this.AssChartOption.yAxis[0].splitLine.show = true;
            this.AssChartOption.series[0].name= this.Ass12Num[0].name;
            this.AssChartOption.series[0].data = AssChartDataset[0];
            if(this.Ass12Num.length>1){
              this.AssChartOption.series[1].name= this.Ass12Num[1].name;
              this.AssChartOption.series[1].data = AssChartDataset[1];
            }
          }
        }).catch(err => {
          console.log('promisesAvgMap - getInspectStatsDistributionOverRegion: ' + err);
        });
      }else{
        //console.log("this.compareIds2:",this.compareIds2)
        this.showNoData2=true;
        this.AssChartOption.yAxis[0].splitLine.show = false;
        this.AssChartOption.series[0].name= "";
        this.AssChartOption.series[1].name= "";
      }
    },
    doParseAssessment12Score(avgData){
      const self = this;
      
      this.comapareLabels2.forEach(label=>{
        //console.log("label:",label)
        let avg = avgData.filter(data=>{
          //console.log("data:",data)
          return (data.groupName==label)
        });
        //console.log("avg:",avg)
        if(avg.length>0){
          self.Ass12Num.push({name:avg[0].groupName,score:parseInt(avg[0].standardRate).toString()});
        }else{
          self.Ass12Num.push({name:label,score:"- -"});
        }
      })
    },
    async doGetAssessmentStandardScore(){
      let tagList = await this.getInspectTagStandardScore();
      //console.log("@@tagList:",tagList);
      let filterTag = tagList.data.filter((tag)=>{
        return tag.id == this.params.inspectId;
      });
      //console.log("@@filterTag:",filterTag);
      if(filterTag.length>0){
        let inspectSet=filterTag[0].inspectSettings.filter((setting)=>{
          return setting.name == "standardScore";
        });

        if(inspectSet.length>0){
          //console.log("@@inspectSettings:",inspectSet[0]);
          if(inspectSet[0].value!=null){
            this.standardRate =inspectSet[0].value;
          }else{
            this.standardRate = "- -";
          }
        }
      }
    },
     /****end for 考評達標同比 ****/

    getInspectStatsDistributionOverRegion(params) { //取得平均分
      params["inspectTagId"] = this.params.inspectId;
      return new Promise((resolve, reject) => {
         getInspectStatsOverviewWithGroup(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getAverageBarchartOption(){
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
          data:[],
        },
        yAxis:[{
          type: 'value',
          min:function (value) {
            if(value.min<0) return value.min;
            else return 0;
          },
          max:function (value) {
            if(!value || value.max==0 ) return 100;
            else return value.max*1.2;
          },
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
          name:'(分)',
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
            color:'#7bd8eb',
            barGap:0,
          },
          {
            name:"",
            type: 'bar',
            barWidth: "16px",
            smooth: true,
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            color:'#b9c6d2',
            barGap:0,
            
          }
        ],
        itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  const colorList = ['#7bd8eb', '#b9c6d2'];
                  return colorList[params.dataIndex];
                }
              }
            }
        
      };
      return chartOption;
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
    exportPDF() {
      const self = this;
      if (self.avgChartOption.series[0].data.length === 0 && self.AssChartOption.series[0].data.length===0) {
        util.notify(self.$t('statistics.emptyInsRecordList'), 'warning', 3000);
        return false;
      }
      self.ispdf = true;
      this.$nextTick(() => {
        const img_avg = document.getElementById('imgTest_avg');
        const img_assm = document.getElementById('imgTest_assm');
        setTimeout(() => {
          html2canvas(img_avg,{backgroundColor: "#FFFFFF"}).then(function(canvas) {
            var oGrayImg1 = canvas.toDataURL('image/jpeg');
            self.pdfSrc_avg = oGrayImg1;
          });
          html2canvas(img_assm,{ backgroundColor: "#FFFFFF"}).then(function(canvas) {
            var oGrayImg2 = canvas.toDataURL('image/jpeg');
            self.pdfSrc_assm = oGrayImg2;
          });
          setTimeout(() => {
            self.$print(self.$refs.printPDF,null,self.$t('route.patrolCompareStat')+ util.getCurrentTime());
            self.ispdf = false;
          }, 1000);
        }, 5000);
      });
    },
  
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";

  .statistics-container{
    .average-cahrt{
      margin-left: calc(24/1440*100vw);
      margin-right: calc(24/1440*100vw);
      width: calc(1048px/1440*100vw);
      height: 667.5px;

      .avg-score{
        margin-top:12.5px;
        width:250px;
        height: 35px;
        margin-left:calc(46/1440*100vw);
        font-size:15px;
        color:#556679;
        border-radius:5px;
        display:flex;
        flex-direction:row;
        align-items: center;
      }
      .avg12item{
        display:flex; 
        flex-direction:row;
        font-size:15px;
        font-weight:600;
        align-items:center;
        justify-content: space-between;
      }
      .score-item-name{
        width:calc(60/1440*100vw);
        margin-left:10px;
        align-self:center;
        font-size:normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pct-panel {
        width: calc(1035px/1440*100vw);
        height: 403px;
        margin-top: 33px;
        
          .chart-content {
            width: 100%;
            height: 100%;
          }
          .chart-content-pdf {
            width: 100%;
            height: 100%;
          }
      }
      .pct-panel-pdf {
        width: calc(1035px/1440*100vw);
        height: 403px;
        margin-top: 33px;
        
          .chart-content {
            width: 100%;
            height: 100%;
          }
          .chart-content-pdf {
            width: 100%;
            height: 100%;
          }
      }

      
    }
  .date-picker .el-input__inner{
    font-size:13px;
  }
  }
  
</style>