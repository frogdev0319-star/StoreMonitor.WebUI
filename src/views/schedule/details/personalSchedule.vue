<template>
    <div class="ScheduleContainer">
        <div class="search-bar">
            <div class='position-area'>
                <div>{{ $t('overview.position')}}</div>
                <date-time-selector class="time-selector" @change="dateChange"/>
            </div>
            <div class='keyword-area'>
                <div class="search-label">{{$t('remotePatrol.keywords')}}</div>
                <el-input
                    v-model="inputSearchValue"
                    size="medium"
                    class="search-input shadow-light"
                    clearable/>
            </div>
            <div style="flex:2"></div>
            <delay-button
              class="search-button"
              type="primary"
              size="mini"
              @click="doSearchScheduleList">
              <span>{{ $t('remotePatrol.search') }}</span>
            </delay-button>
        </div>
        <table-only
            ref="elTP"
            class="table-white"
            table-themes="white"
            :column-data="columnData"
            :table-data="tableData"
            :table-operation ="columnOperationData"
            :highlight-current-row= "false"
            :is-loading-data="isLoadingData"
            :allowRowExpand = "false"
            :showBorder = "false"
            :default-sort = "defaultSort"
            :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
            :tableHeight = "760"
            :cellStyle="{backgroundColor: '#fff !important'}"
            @handleOperation="handleOperation"  
            @sortChange="handleSortChange"                                
        />
        <div style="width:100%; margin-top:12px;height:31px;">
            <tbl-pagination-only
                :btn-style="{backgroundColor:'transparent'}"
                :total="total"
                :current-page="curPage"
                :page-size="curSizeNum"
                layout = "prev,pager, next,sizes,slot"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DateTimeSelector from '@/components/DateTimeSelector';import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import util from '@/common/util';

export default{
    name: 'PersonalSchedule',
    components: {DateTimeSelector,TableOnly,TblPaginationOnly,DelayButton},
    data(){
      return {

      }
    },
    computed: {
      ...mapGetters({ accountChanged: 'accountChanged' })
    },
    created:{

    },
    methods:{

    }
}
</script>

<style scoped lang="scss">

</style>
