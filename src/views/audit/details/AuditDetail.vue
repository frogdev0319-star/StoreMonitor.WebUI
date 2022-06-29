<template>
  <div class="page-container report-setting paper" style="height: 100%">
    <p>aaa</p> 
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>

    <!-- 基本信息 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table :table-name="$t('audit.workFlows.basicInformation')">
            <template slot="tableDetail">
              <!-- row -->
              <div class="setting-config">
                <!-- 基本信息 -->
                <div class="flex-row" style="margin-right: 30px">
                  <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.basicInformation')}}</div>
                </div>
              </div>
            </template>
          </setting-table>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
// import {getNodeList, updateWorkflow} from "@/api/workflow";
import TableOnly from '@/components/TableOnly';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowDetail',
  components: {
    SettingTable
    
  },
  data() {
    return {
      loading: false,
      isLoadingData: false,
      fullscreenLoading: false,
  
    }
  },
  mounted() {},
  async created() {
    // await this.init()
  },
  methods: {
    // async init(){
    //   await this.getWorkflowInfo() 
    // },


  }
}
</script>



<style scoped>
  .report-setting{
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
  }
  /* .setting-titles{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  } */
  .setting-tabs{
    display: flex;
    justify-content: flex-start;
  }
  .setting-name{
    cursor: pointer;
    width: 120px;
    color: #7d8cad;
    padding: 15px calc(20/1920*100vw) 0 calc(20/1920*100vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .click-setting-btn{
    color: #f31d65;
    border-bottom: 4px solid #f31d65;
  }

  .save-btn{
    text-align: left;
    margin-top: 20px;
  }

  .title-info{
    text-align: left;
    padding-bottom: calc(20/1920*100vw);
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .left-item, .right-item{
    display: inline-flex;
    align-items: center;
    margin-right: 100px;
  }

  .input-name{
    width: 200px;
    height: 30px;
  }
  .input-name .el-input--medium >>> .el-input__inner{
    height: 36px;
    line-height: 36px;
    font-size: 12px;
  }

  .span-font{
    font-size: 14px;
    color:#424151;
    /* width: 200px; */
    text-align: left;
  }
  .name-font{
    color:#424151;
    text-align: left;
    margin-right: calc(45/1920*100vw);
  }
  .enable-font{
    margin-right: 20px;
  }

  .name-tips{
    display:flex; 
    flex-direction:column;
    
  }
  .error-text{
    font-size: 12px;
    color: red;
    position: relative;
  }
  .error-text span{
    position: absolute;
  }
  .setting-config, .table-header{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* height: 60px; */
    padding: 15px 0;

  }
  .table-header{
    color: #424151;
    border: 1px solid #e3e9f4;
    border-bottom: none;
    font-weight: bold;
    background-color: #fff;
  }

  .detail-setting{
    /* padding: 0 calc(30/1920*100vw); */
  }
  .radio-setting{
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: center;
    margin-top: 20px;
  }
  .radio-setting .el-radio{
    height: 30px;
  }
  .setting-config{
    /* border-bottom: 1px solid #e3e9f4; */
    height: auto;
  }

  .setting-config:hover{
    cursor: pointer;
  }
  .basic-config, .basic-header{
    border: none;
    border-bottom: 1px solid #e3e9f4;
    /* padding-left: calc(30/1920*100vw); */
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: fit-content;
    text-align: left;
    margin-right: 20px;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    /* width: 60%; */
    text-align: left;
  }

  .title-operation{
    /* width: 20%; */
  }

  .sortable-ghost{
    color: #424151 !important;
    background: rgba(243, 19, 101, 0.1) !important;
    border: 1px solid #f31d65;
  }

  .statis-item{
    display: flex;
    height: 40px;
    align-items: center;
  }
  .el-radio{
    width: 100px;
    margin-right: 0px
  }

  /* .setting-details{
    margin: 0 30px;
  } */
  .content-titles{
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 12px;
  }
  .template-select-area{
    display:flex; 
    flex-direction:row;
    height:calc(30/1920*100vw);
    width:200px;
    align-items:center;
    background-color:#f4f6f7;
    border-radius:5px;
    font-size: 13px;
    margin-right: 20px;
  }
  .template-select-label{
      color:#556679;
      font-family: NotoSansCJKtc;
      font-size: 13px;
      width:75px;
      margin-left:16px;
      line-height: 15px;
    }
  .inspect-basic{
    margin-bottom: 30px;
    position: relative;
  }

  .el-radio{
    color: #424151;
  }
  >>> .el-radio__input.is-checked + .el-radio__label{
    color: #514d41;
  }
  .detail-table{
    /* border: 1px solid #e3e9f4;
    padding-bottom: 20px; */
    background-color: #f7f9fa
  }
  .promot-info{
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 12px;
    color: #7d8cad;
  }
</style>

<style lang="sass">
  .audit-user-row
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    .audit-user
      margin-right: 10px
  
  .el-table__row
    &:first-child
      .el-table_1_column_6
        .cell
          display: none !important
</style>