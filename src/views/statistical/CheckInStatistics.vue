<template>
  <div class="el-overview-content">
    <div class="statistics-header">
      <div class="header-details">
        <span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('overview.department') }}</span>
        <multi-select
          ref="multiState"
          :selected="departmentIds"
          :alltype="0"
          :options="departmentList"
          style="display:inline;"
          @changeInput="handleDepartmentChange"/>

        <span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('overview.user') }}</span>
        <multi-select
          ref="multiState"
          :selected="userIds"
          :alltype="0"
          :options="userList"
          style="display:inline;"
          @changeInput="handleUserChange"/>

        <span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('overview.position') }}</span>
        <multi-select
          ref="multiState"
          :selected="positionIds"
          :alltype="0"
          :options="positionsList"
          style="display:inline;"
          @changeInput="handlePositionChange"/>

        <span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('remotePatrol.time') }}</span>
        <el-date-picker
          ref="datePicker"
          v-model="dateValue"
          :clearable="false"
          :editable="false"
          :popper-class="poperClass"
          :picker-options="dateOpt"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="$t('overview.startDate')"
          :end-placeholder="$t('overview.endDate')"
          type="daterange"
          range-separator="-"
          size="mini"
          format="yyyy/MM/dd"
          class="date-range"
          unlink-panels
          @change="dateChange"
        />
        <el-tooltip
          class="date-time-tooltip"
          effect="dark"
          placement="right">
          <div slot="content">{{ $t('overview.dataRangeTips') }}</div>
          <i class="iconfont icon-bangzhu iconbangzhu"/>
        </el-tooltip>
        <delay-button
          class="search-button"
          type="primary"
          size="mini"
          @click="searchCheckInList"
        >
          <span>{{ $t('remotePatrol.search') }}</span>
        </delay-button>
      </div>
    </div>
    <div class="contents-container clearfix">
      <div class="items-title">
        <span class="title">{{ $t('overview.checkinList') }}</span>
        <div class="operation-btns">
          <delay-button
            :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
            type="primary"
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
      <div class="items-table">
        <el-table
          ref="table"
          :data="checkinList.slice((currentPage - 1)* pageSize, currentPage * pageSize)"
          :header-cell-class-name="headerClass"
          :cell-class-name="cellClass"
          border
          style="width: 100%"
          class="check-in-table">
          <el-table-column
            v-for="(fixedColumn) in tableFixedColumns"
            :key="fixedColumn.label"
            :prop="fixedColumn.prop"
            :label="fixedColumn.label"
            :min-width="fixedColumn.width"
            align="center"
          />
          <el-table-column
            v-for="(column) in tableColumns"
            :key="column.label"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.width"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                class="table-text text-link"
                @click="toogleExpand(scope.row, scope.column.property)">
                {{ scope.row[column.prop] }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <personal-checkin
                :user-id="props.row.userId"
                :user-name="props.row.userName"
                :select-time="selectTime"
                :date-value="dateValue"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="toolbar pagination">
        <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          small
          layout="jumper,total, prev, pager, next,sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker';
import MultiSelect from '@/components/MultiSelect';
import DelayButton from '@/components/DelayButton';
import { getBrifCheckinList } from '@/api/checkin';
import { titleRESTful, inpectRESTful } from '@/api/index';
import { getUserInfo } from '@/api/login';

export default {
  name: 'CheckInStatistics',
  components: {
    PersonalCheckin: resolve => require(['@/components/PersonalCheckin'], resolve),
    DelayButton,
    MultiSelect,
    DateTimePicker
  },
  data() {
    return {
      lang: this.$i18n.locale,
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      poperClass: 'date-picker-poper',
      elTooltipClass: 'el-tooltip-class',
      departmentIds: [],
      departmentList: [],
      userIds: [],
      userList: [],
      positionIds: [],
      positionsList: [],
      tableFixedColumns: [
        {
          'prop': 'userName',
          'label': this.$t('overview.name'),
          'sortable': false,
          'width': '100',
          'maxWidth': '140'
        },
        {
          'prop': 'department',
          'label': this.$t('overview.department'),
          'sortable': false,
          'width': '100',
          'maxWidth': '140'
        },
        {
          'prop': 'position',
          'label': this.$t('overview.position'),
          'sortable': false,
          'width': '100',
          'maxWidth': '140'
        }
      ],
      tableColumns: [],
      checkinList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      daysList: [],
      exportPng: require('../../../static/img/excel.png'),
      selectTime: 0,
      headerClass: 'header-class',
      cellClass: 'cell-class'
    };
  },
  created() {
    this.getDaysColumn();
    this.getUserList();
    this.getTitleList();
    this.searchCheckInList();
  },

  methods: {
    getUserList() {
      this.userList = [];
      this.userIds = [];
      getUserInfo().then(res => {
        res.data.map(user => {
          const userJson = {};
          userJson.label = user.userName;
          userJson.value = user.userId;
          userJson.roleId = user.roleId;
          this.userList.push(userJson);
        });
        this.userIds = this.userList.map(user => user.value);
      })
        .catch(err => {
          console.log('CheckinStatistics-getUserList: ' + err);
        });
    },

    getTitleList() {
      this.positionsList = [];
      titleRESTful.getUserTitleList().then(res => {
        res.data.map(title => {
          const titleJson = {};
          titleJson.label = title.title;
          titleJson.value = title.id;
          this.positionsList.push(titleJson);
        });
        this.positionIds = this.positionsList.map(position => position.value);
      })
        .catch(err => {
          console.log('CheckinStatistics-getTitleList: ' + err);
        });
    },

    dateChange(val) {
      let start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const daysDiff = this.$moment(end).diff(start, 'days');
      if (daysDiff > 30) {
        this.$message({
          message: this.$t('overview.changeTimeRange'),
          type: 'warning'
        });
        start = end - 3600 * 24 * 30 * 1000;
        start = this.$moment(start).startOf('d').toDate().valueOf();
        this.dateValue = [this.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      } else {
        this.dateValue = [this.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      }
      this.dateValue[1] = this.dateValue[1] + 999;

      this.getDaysColumn();
    },

    getDaysColumn() {
      const startDay = this.$moment(this.dateValue[0]).format('YYYY-MM-DD');
      const endDay = this.$moment(this.dateValue[1]).format('YYYY-MM-DD');
      this.daysList = this.getMonthAndDay(startDay, endDay);
      this.getTableColumns(this.daysList);
    },

    getTableColumns(daysList) {
      const jsonArr = [];
      daysList.map(month => {
        const json = {};
        json.prop = month;
        json.label = month;
        json.width = '50';
        jsonArr.push(json);
      });

      this.tableColumns = [... jsonArr];
    },

    getMonthAndDay(start, end) {
      let date_all = [], i = 0;
      var startTime = this.$moment(start).startOf('d').toDate();
      var endTime = this.$moment(end).startOf('d').toDate();
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        const month = startTime.getMonth() + 1;
        const day = startTime.getDate();
        date_all[i] = month + '/' + day;
        startTime.setDate(startTime.getDate() + 1);
        i += 1;
      }
      return date_all;
    },

    handleDepartmentChange(departmentIds) {
      this.departmentIds = departmentIds;
    },

    handleUserChange(userIds) {
      this.userIds = userIds;
    },

    handlePositionChange(positionIds) {
      this.positionIds = positionIds;
    },

    async searchCheckInList() {
      const parmas = this.generateCallParams();
      const checkinList = await getBrifCheckinList(parmas);
      const checkinData = checkinList.data;
      this.total = checkinData.length;
      const tableData = [];
      const dayAndTimesJson = {};
      this.daysList.map(day => {
        dayAndTimesJson[day] = 0;
      });

      checkinData.forEach(checkin => {
        const tableJson = { ...dayAndTimesJson };
        tableJson.userId = checkin.userId;
        checkin.checkinTimes.forEach(time => {
          const ts = this.$moment(time.ts).format('M/D');
          tableJson[ts] = time.times !== 0 ? time.times : 0;
        });
        tableData.push(tableJson);
      });
      this.checkinList = tableData;
    },

    generateCallParams() {
      const params = {};
      const start = typeof (this.dateValue[0]) === 'object' ? this.dateValue[0].getTime() : this.dateValue[0];
      const end = typeof (this.dateValue[1]) === 'object' ? this.dateValue[1].getTime() : this.dateValue[1];
      params.beginTs = start;
      params.endTs = end;
      params.userIds = this.userIds.filter(userId => userId !== '-1');
      params.order = {
        'direction': 'desc',
        'property': 'ts'
      };
      params.filter = {
        'page': this.currentPage,
        'size': this.pageSize
      };
      return params;
    },

    toogleExpand(row, property) {
      const table = this.$refs.table;
      const year = this.$moment(this.dateValue[0]).format('YYYY');
      const date = `${year}/${property}`;
      const timestamp = this.$moment(date).startOf('day').valueOf();
      this.selectTime = timestamp;
      const tableData = this.checkinList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      tableData.map((item) => {
        if (row.userId !== item.userId) {
          table.toggleRowExpansion(item, false);
        }
      });
      table.toggleRowExpansion(row, true);
    },

    onExpandChange(row, expanded) {
      this.selectTime = this.$moment(this.dateValue[0]).valueOf();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },

    handleCurrentChange(val) {
      this.currentPage = val;
    },

    export2Excel() {
      inpectRESTful.downLoadTemplate().then(res => {
        const reader = new FileReader();
        reader.onload = function() {
          const content = reader.result;
          var bytes = new Uint8Array(content);
          var length = bytes.byteLength;
          let binary = '';
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require('xlsx');

          var workbook = XLSX.read(binary, { type: 'array' });
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['Pass&Fail']);
        }
        reader.readAsBinaryString(res);
      });
    }

  }
};
</script>

<style scoped>
.table-text{
  color:#182752;
}
  .statistics-header{
    margin-bottom: 30px;
    border-bottom: 1px solid #e3e9f4;
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 30px;
    color: #182752;
    text-align: left;
  }

  .header-details{
    padding-right: calc(60/1920*100vw);
  }
  .header-details span{
    font-size: calc(14/1920*100vw);
    margin-right: calc(20/1920*100vw);
    margin-left: calc(20/1920*100vw);
  }
  .contents-container{
    background-color: #fff;
    margin: 0 calc(20/1920*100vw) 20px;
  }

  .items-table{
    margin: 0 calc(30/1920*100vw);
  }

.items-title{
  height: 70px;
  width: 100%;
  font-size: calc(20 / 1920 * 100vw);
  text-align: left;
  color: #182752;
  border-bottom: 1px solid #e3e9f4;
  margin-bottom: 30px;
}

.title {
  padding-top: 30px;
  padding-left: calc(30 / 1920 * 100vw);
  font-size: calc(20 / 1920 * 100vw);
  text-align: left;
  color: #182752;
  display: inline-block;
}

.toolbar{
  float: right;
  margin: 30px calc(30/1920*100vw);
  height:13%;
}
.clearfix::after{
  content: "";
  display: block;
  height: 0;
  clear:both;
  overflow: auto;
}
  .check-in-table{
    /*padding-bottom: 30px;*/
    /*border-bottom: 1px solid #e3e9f4;*/
  }
</style>

<style>
  .check-in-table .header-class.is-center .cell,
  .check-in-table .cell-class.is-center .cell,
  .check-in-table .cell-class.el-table__expand-column .cell,
  .check-in-table .header-class.is-center:first-child .cell{
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .check-in-table .el-table__row{
    height: 40px;
  }

  .check-in-table .el-table--medium td,
  .check-in-table .el-table--medium th{
    padding: 0
  }
</style>
