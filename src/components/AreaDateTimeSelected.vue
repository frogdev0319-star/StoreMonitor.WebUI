<template>
    <div class="content">
        <div class="rang-pick">
            <img :src="DatePickIconSrc"/>
            <div>{{$t('statistics.dateChoose')}}</div>
            <el-select class="dropdown-select" v-model="dateRange" value-key="value">
                <el-option 
                  v-for="item in dateRangeItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
    name: 'AreaDateTimeSelected',
    data() {
        return {
            DatePickIconSrc: require('../../static/img/statistics/ic_edit.svg'),
            dateRange:'week',
            dateRangeItems:[{value:'week',label:this.$t('statistics.weekCompare')},{value:'month',label:this.$t('statistics.monthCompare')}],
        }
  },
  computed: {
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
  methods: {
      initData() {
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/stastical.scss";
.content{
    width:307px;
    height:35px;
    margin-top: 17px;
    display:flex;
    flex-direction:row;
    background-color:#f7f9fa;
    float: right;
    .rang-pick{
        display:flex;
        flex-direction:row;
        img{
            width:24;
            height:24px;
            margin-left: 10px;
            align-self: center;
        }
        div{
            width: 52px;
            height: 18px;
            margin: 2px 0 4px 4px;
            font-family: NotoSansCJKtc;
            font-size: 13px;
            text-align: left;
            color: #006ab7;
            align-self: center;
        }
        .dropdown-select{
            width:72px;
            height:18px;
            border: none;
            color: #2b2b2b;
            
        }
        .el-select {
                border:none;
                border-radius: none;
                opacity: 1;
                height: 40px;
                width: 200px;
                font-size: 13px;
                margin-left: 10px;
                ::v-deep.el-input__icon {
                        margin-right: 13px;
                        margin-top: 17px;
                        width: 10px;
                        height: 6px;
                }
                ::v-deep.el-input__inner{
                    color: #2b2b2b;
                }
        }
        
    }
    
}
        
</style>