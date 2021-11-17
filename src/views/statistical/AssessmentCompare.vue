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
            <div class="statistics-content" style="height: 735px;">
                <div class="head">
                    <el-col :span="17">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.averageCompare') }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <AreaDateTimeSelected></AreaDateTimeSelected>
                    </el-col>
                </div>
            </div>
            <div class="statistics-content" style="height: 620px;margin-top:24px;">
                <div class="head">
                    <el-col :span="17">
                        <div class="region-titles">
                            <span class="title">
                                {{ $t('statistics.assessemntCompare') }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="7">
                    </el-col>
                </div>
            </div>
        </el-row>
    </div>          
</template>
<script>
import { mapGetters } from 'vuex';
import LimitSelect from '@/components/LimitSelect';
import ECharts from 'vue-echarts';
import util from '@/common/util.js';
import {
  getInspectStatsOverRegion,
  getInspectStatsOverviewWithRegionV2
} from '@/api/inspectOverview';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TablePagination from '@/components/TablePagination';
import DialogPop from '@/components/DialogPop';
import DelayButton from '@/components/DelayButton';
import AreaDateTimeSelected from '@/components/AreaDateTimeSelected';
export default {
  name: 'PatrolEvaluationSta',

  components: {
    DelayButton,
    DialogPop,
    'v-chart': ECharts,
    LimitSelect,
    SearchComponent,
    TablePagination,
    AreaDateTimeSelected
  },
  mixins: [resize],
  data() {
    return {
        params: {},
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
    this.$refs.itemsPie && this.$refs.itemsPie.dispose();
    this.$refs.storeChart && this.$refs.storeChart.dispose();
  },
  methods: {
      initData() {
      this.params.filter = { page: 0, size: this.sizeNumStore };
    },
  }
}
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

    
  }
</style>