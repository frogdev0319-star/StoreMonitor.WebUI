<template>
  <div class="toolbar pagination">
    <el-button class="btnArrow" :style="btnStyle" icon="el-icon-arrow-left" :disabled="currentPage==1" @click="handlePrevClick"></el-button>
    <div class="pageNum">{{currentPage}}</div>
    <el-button class="btnArrow" :style="btnStyle" icon="el-icon-arrow-right" :disabled="currentPage==total" @click="handleNextClick"></el-button>
    <div v-if="showPageSize" class="pageSizeTitle">{{$t('overview.pageSize')}}</div>
    <div v-if="showPageSize" class="pageSize-select" :class="getLangStyleValue(pageSelectClass)">
          <el-select
            v-model="pagesize"
            size="medium"
            class="el-pagesize"
            @change="handleSizeChange">
            <el-option
              v-for="item in pageSizeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
    <!--<el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagesize"
      :total="pagesize"
      :layout="layout"
      background
      small
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    >
    </el-pagination>-->
  </div>
</template>

<script>
import util from '@/common/util.js';
export default {
  
  name:'TblPaginationOnly',
  props: {
    total: {
      type: Number,
      default: 0,
      required: false
    },
    pagesize: {
      type: Number,
      default: 10,
      required: false
    },
    currentPage: {
      type: Number,
      default: 1,
      required: false
    },
    layout: {
      type: String,
      default: 'jumper,total, prev,pager, next,sizes'
    },
    btnStyle:{
      type:Object,
      default: () => {}
    },
    showPageSize:{
      type:Boolean,
      default:true,
      required: false
    },
    pageSizeArray:{
      type:Array,
      default: () => [],
      required: false
    }
  },
  computed:{
    pageSizeOption(){
      console.log("pageSizeArray:",this.pageSizeArray)
      if(this.pageSizeArray.length>0){
        console.log("pageSizeArray:",this.pageSizeArray)
        return this.pageSizeArray;
      }else{
        return this.pageSizeList;
      }
    }
  },
  watch:{
    total:{
      immediate: false, 
      deep: true,
      handler (val) {
          this.total = val;
          this.currentPage;
      }
    }
  },
  data() {//,{value:'position',label:this.$t('overview.position')},{value:'users',label:this.$t('overview.user')}
    return {
      lang:this.$i18n.locale,
      pageSizeList: [
        {value:10,label:"10 "+this.$t('overview.pageSizeUnit')}, 
        {value:20,label:"20 "+this.$t('overview.pageSizeUnit')}, 
        {value:50,label:"50 "+this.$t('overview.pageSizeUnit')}, 
        {value:100,label:"100 "+this.$t('overview.pageSizeUnit')}
        ],
      pageSelectClass:[
        {key:'en',value:'en-pageSize-select'},{key:'zh',value:'zh-pageSize-select'},{key:'zhtw',value:'zhTW-pageSize-select'},
        {key:'ja-JP',value:'ja-pageSize-select'},{key:'ko-KR',value:'ko-pageSize-select'},{key:'vi-VN',value:'vi-pageSize-select'},
        {key:'id-ID',value:'id-pageSize-select'},{key:'th-TH',value:'th-pageSize-select'}
      ]
    }
  },
  methods:{
    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    handleCurrentChange(currentPage) { 
      const pageObj = {
        page: currentPage,
        size: this.pagesize
      };
      this.$emit('currentChange', pageObj);
    },

    handleSizeChange(pageSize) {
      console.log("handleSizeChange:",pageSize);
      
      const pageObj = {
        page: 1,
        size: pageSize
      };
      this.$emit('sizeChange', pageObj);
    },
    handlePrevClick(){
      if(this.currentPage>1){
        this.handleCurrentChange(this.currentPage-1)
      }
    },
    handleNextClick(){

      if(this.currentPage<this.total){
        this.handleCurrentChange(this.currentPage+1)
      }
    }
  }
}
</script>
<style lan="scss">
  .toolbar{
    float: right;
    margin: 24px calc(24/1920*100vw);
    margin-right: 24px;
    height:31px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .btnArrow{
    width:18px;
    height:31px;
    align-self: center;
    border: none;
  }
  .pageNum{
    width: 48px;
    height: 31px;
    padding-top: 8px;
    border-radius: 5px;
    background-color: #edf0f2;
    color:#2b2b2b;
    font-family: Roboto;
    font-size: 13px;
    margin-left: 16px;
    text-align: center;
  }
  .pageSizeTitle{
    height: 31px;
    padding-top: 8px;
    background-color: transparent;
    color:#484848;
    font-family: NotoSansCJKTC;
    font-size: 13px;
    margin-left: 18px;
    text-align: center;
  }
  .pageSize-select{
    height: 31px;
    border-radius: 5px;
    background-color: #edf0f2;
    margin-left: 16px;
    
  }
  .en-pageSize-select{
    width:103px;
  }
  .id-pageSize-select{
    width:113px;
  }
  .ja-pageSize-select{
    width:150px;
  }
  .ko-pageSize-select{
    width:150px;
  }
  .th-pageSize-select{
    width:150px;
  }
  .vi-pageSize-select{
    width:250px;
  }
  .zh-pageSize-select{
    width:103px;
  }
  .zhTW-pageSize-select{
    width:103px;
  }
  .el-pagesize{
    /deep/
    .el-input__icon{
      line-height: 31px;
    }
  } 
  
</style>
<style>
  @import "../assets/css/pagination.css";
  .btnArrow.el-button:active {
    color: #484848;
    border: none;
    outline: 0;
}
.btnArrow.el-button:focus, .btnArrow.el-button:hover {
    color: #006ab7;
    border: none;
    background-color: #FFF;
}
.btnArrow.el-button:disabled {
    color: #acaeb1;
    border: none;
    outline: 0;
}
.el-pagesize.el-select .el-input--medium .el-input__suffix{
  top:0px !important;
}
.el-pagesize.el-select .el-input--medium .el-input__inner {
    height: 31px;
    font-size: 13px;
    text-align: left;
    border: none;
    background-color: #edf0f2;
    color: #2b2b2b;
    border-radius: 5px;
}

</style>