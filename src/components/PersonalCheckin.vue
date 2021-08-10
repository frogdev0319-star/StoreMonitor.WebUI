<template>
  <div style="width: 100%">
    <div class="checkin-header">
      <div class="checkin-title">{{ $t('overview.personalCheckinList', {userName: userName}) }}</div>
      <div class="time-btns">
        <el-button type="text" icon="el-icon-arrow-left" @click="subtractDate"/>
        <span class="date-string">{{ formatSelectTime(date) }}</span>
        <el-button type="text" @click="addDate"><i class="el-icon-arrow-right el-icon--right"/></el-button>
      </div>
    </div>
    <el-table
      :data="personalCheckinList"
      :highlight-current-row="true"
      :header-cell-class-name="insideHeaderClass"
      :row-class-name="insideRowClass"
      :cell-class-name="insideCellClass"
      align="left"
      stripe
      border
      style="width: 100%"
      size="mini"
      class="personal-check-in-table">
      <el-table-column
        v-for="(header) in checkinTableHeader"
        :key="header.label"
        :prop="header.prop"
        :label="header.label"
        :class-name="header.className"
        :min-width="header.width"
        :formatter="header.formatter"/>
      <el-table-column
        :label="$t('eventView.enclosure')"
        class-name=""
        min-width="">
        <template v-if="scope.row.attachment.length" slot-scope="scope">
          <div v-for="(attach, index) in scope.row.attachment" :key="index" class="attachment-column">
            <div v-if="attach.mediaType === 2" class="img-content">
              <el-image
                :src="attach.url"
                :preview-src-list="getImgList(index, scope.row.attachment)"
                class="img-little"/>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCheckinList } from '@/api/checkin';
import util from '@/common/util'

export default {
  name: 'PersonalCheckin',

  props: {
    userName: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    selectTime: {
      type: Number,
      default: 0
    },
    dateValue: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      personalCheckinList: [],
      checkinTableHeader: [
        {
          'prop': 'place',
          'label': this.$t('overview.checkinAddress'),
          'sortable': false,
          'width': '300'
        },
        {
          'prop': 'ts',
          'label': this.$t('overview.time'),
          'sortable': false,
          'width': '120',
          'formatter': function(row, column, cellValue) {
            return util.formDatetime(cellValue);
          }
        },
        {
          'prop': 'description',
          'label': this.$t('deviceView.comment'),
          'sortable': false,
          'width': '440'
        }
      ],
      insideCellClass: 'inside-cell-class',
      insideHeaderClass: 'header-class',
      insideRowClass: 'inside-row-class',
      daysList: [],
      date: this.selectTime
    };
  },

  computed: {
    formatSelectTime() {
      return function(val) {
        return val ? this.$moment(val).format('YYYY/MM/DD'): '';
      };
    }
  },

  watch: {
    date() {
      this.getPersonCheckinList();
    },
    selectTime() {
      this.date = this.selectTime;
    }
  },

  created() {
    this.getPersonCheckinList();
    this.getDateList();
  },

  methods: {
    async getPersonCheckinList() {
      this.personalCheckinList = [];
      const params = this.generateCallParams();
      const checkinList = await getCheckinList(params);
      this.personalCheckinList = checkinList.data.content;
    },

    generateCallParams() {
      const params = {};
      const start = this.$moment(this.date).startOf('d').valueOf();
      const end = start + 1 * 24 * 60 * 60 * 1000 + 999;
      params.beginTs = start;
      params.endTs = end;
      params.userIds = [this.userId];
      return params;
    },

    getImgList(index, sourceList) {
      const arr = [];
      let i = 0;
      for (i; i < sourceList.length; i++) {
        arr.push(sourceList[i + index]);
        if (i + index >= sourceList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.filter(source => source.mediaType === 2).map(source => source.url);
    },

    getDateList() {
      const startDay = this.$moment(this.dateValue[0]).format('YYYY-MM-DD');
      const endDay = this.$moment(this.dateValue[1]).format('YYYY-MM-DD');
      this.daysList = this.getMonthAndDay(startDay, endDay);
    },

    getMonthAndDay(start, end) {
      let date_all = [], i = 0;
      var startTime = this.$moment(start).startOf('d').toDate();
      var endTime = this.$moment(end).startOf('d').toDate();
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        const year = startTime.getFullYear();
        const month = startTime.getMonth() + 1;
        const day = startTime.getDate();
        date_all[i] = this.$moment(year + '/' + month + '/' + day).format('YYYY/MM/DD');
        startTime.setDate(startTime.getDate() + 1);
        i += 1;
      }
      return date_all;
    },

    subtractDate() {
      const date = this.$moment(this.date).format('YYYY/MM/DD');
      const index = this.daysList.findIndex(day => date === day);
      this.date = index > 0 ? this.daysList[index - 1] : this.daysList[index];
    },

    addDate() {
      const date = this.$moment(this.date).format('YYYY/MM/DD');
      const index = this.daysList.findIndex(day => date === day);
      this.date = index === this.daysList.length - 1 ? this.daysList[index] : this.daysList[index + 1];
    }
  }

};
</script>

<style scoped>

  .checkin-header{
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #7d8cad;
    border-bottom: 1px solid #e3e9f4;
  }
  .checkin-title{
    width: 50%;
    text-align: left;
  }
  .time-btns{
    width: 50%;
    display: inline-flex;
    align-items: center;
    text-align: left;
    color: #7d8cad;
  }
  .date-string{
    margin: 0 calc(50/1920*100vw);
  }
  .personal-check-in-table{
    margin-top: 20px;
  }
  .attachment-column{
    padding: 10px 0;
  }
  .img-content{
    margin-right: calc(20/1920*100vw);
    height: calc(80/1920*100vw);
  }
  .img-little{
    width: calc(120/1920*100vw);
    height: calc(80/1920*100vw);
  }
</style>
<style>
  .personal-check-in-table .el-table__expanded-cell[class*=cell]{
    padding: 24px calc(35/1920*100vw) 30px !important;
  }
  .personal-check-in-table .inside-cell-class .cell,
  .personal-check-in-table .header-class:first-child .cell{
    padding-left: 20px !important;
  }
  .el-icon-arrow-left, .el-icon-arrow-right{
    color: #7d8cad;
    font-weight: bold;
  }
</style>
