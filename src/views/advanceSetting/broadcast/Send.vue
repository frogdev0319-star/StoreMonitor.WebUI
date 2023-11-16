<template>
  <div>

    <div class="submit_btn" >
      <delay-button type="filled" >
        <div class="button-area" style="width: 80px; height: 20px;">
          <span>發送公告</span>
        </div>
      </delay-button>
    </div>

      <div class="el-table-content" >
        <el-tabs  v-model="activeName" @tab-click="onTabClick">
          <!-- 公告訊息 -->
          <el-tab-pane
            label="公告訊息"
            name="0">
            <div class="send_content">

              <div class="title-name"><span style="color: #c60957">* </span> 發送至</div>
              <div class="subtitle_name" style="margin-top: 20px;">群組對象</div>
              <div class="send_content_row">
                <div class="row_title">門店</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">部門</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">職務</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>

              
              <div class="subtitle_name" style="margin-top: 10px;">特定對象</div>
              <div class="send_content_row">
                <div class="row_title">人員</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>


              <div class="title-name" style="margin-top: 30px;"> 發送訊息</div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 標題</div>
                <el-input
                  style="width: 50%;"
                  ref="nodeName"
                  placeholder="aaa"
                  @input="(val) => itemInputChanged(val, 20)"
                />
              </div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 內容</div>
                <el-input
                  style="width: 50%;"
                  ref="nodeName"
                  placeholder="aaa"
                  type="textarea"
                  resize="none"
                  @input="(val) => itemInputChanged(val, 20)"
                />
              </div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 附件</div>
                <div class="attachments"> 選擇檔案</div>
              </div>


            </div>
          </el-tab-pane>


          <!-- 即時排程 -->
          <el-tab-pane
            label="即時排程"
            name="1">
            <div class="send_content">
              <div class="title-name"> 發送排程</div>
              <!-- <div class="subtitle_name" style="margin-top: 20px;">群組對象</div> -->
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 排程名稱</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 巡檢表</div>
                <el-select 
                  style="width: 25%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
                <el-select 
                  style="width: 25%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title"> <span style="color: #c60957">* </span> 執行日期</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>


              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 提醒時間</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>


              <div class="title-name" style="margin-top: 30px;"><span style="color: #c60957">*</span> 發送至</div>
              <div class="subtitle_name" style="margin-top: 20px;"> <span style="color: #c60957">* </span> 群組對象</div>
              <div class="send_content_row">
                <div class="row_title">門店</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">部門</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">職務</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>

              
              <div class="subtitle_name" style="margin-top: 10px;">特定對象</div>
              <div class="send_content_row">
                <div class="row_title">人員</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
            </div>
          </el-tab-pane>



          <!-- 即時事件 -->
          <el-tab-pane
            label="即時事件"
            name="2">
            <div class="send_content">
            <div class="title-name"><span style="color: #c60957">* </span> 發送對象</div>
              <!-- <div class="subtitle_name" style="margin-top: 20px;">群組對象</div> -->
              <div class="send_content_row">
                <div class="row_title">門店</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">職務</div>
                <el-select 
                  style="width: 50%;"
                  placeholder="aaa" 
                  filterable
                  >
                  <el-option
                    v-for="item in store"
                    :key="item"
                    :label="item"
                    :value="item" 
                    />
                </el-select>
              </div>

              <div class="title-name" style="margin-top: 30px;"><span style="color: #c60957">* </span> 發送事件</div>
              <div class="send_content_row">
                <div class="row_title"> <span style="color: #c60957">* </span>事件名稱</div>
                <el-input
                  style="width: 50%;"
                  />
              </div>
              <div class="send_content_row">
                <div class="row_title"> 附件</div>
                <div class="attachments"> 選擇檔案</div>
              </div>

            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script>
import { fetchLog } from '@/api/reportAndEvent';
import { getUserInfo, getAllUserInfoNoAuth} from '@/api/login';
import { mapGetters } from 'vuex';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowList',
  components: {
    TableOnly,
    DateTimeSelector,
    TblPaginationOnly,
    DelayButton,
    DialogPop
  },
  data() {
    return {
      activeName: 0,
      store: ['aa', 'bb', 'cc']
      

    }
  },
  mounted() {
    
  },
  created() {
    this.init()
  },
  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch:{
    // accountChanged(val) {
    //   val !== 0 && this.init();
    // },

 
  
  },
  methods: {

    
  },
};
</script>

<style lang="sass" scoped>

  .submit_btn
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center

  .send_content
    width: 95%
    margin: 0 auto
    margin-bottom: 40px
    .title-name
      width: 100%
      font-size: calc(18/1920*100vw)
      text-align: left
      padding: 10px 0
      margin-bottom: 10px
      border-bottom: 1px solid #dedede
      font-weight: bolder
    .subtitle_name
      width: 100px
      color: #006ab7
      font-size: calc(16/1920*100vw)
      text-align: left
      padding: 10px 0
      margin-left: 30px
      font-weight: bolder
    .send_content_row
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      margin-left: 30px
      font-size: calc(16/1920*100vw)
      padding: 10px 0
      .row_title
        margin-right: 10px
        width: 6%
        text-align: left
      .attachments
        width: 100px
        height: 30px
        background: #006ab7
        color: #FFF
        border-radius: 3px
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
        cursor: pointer








  



  .log_table
    .table .el-table
      padding: 10px 0
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
    td, th
      padding-left: 0 !important
      .cell
        padding-left: 12px !important
      
    td, th
      &:nth-child(1)
        width: 12% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important
      &:nth-child(3)
        width: 15% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important

    .el-table .cell
      text-align: left !important
      

  .el-table-content
    width: 100%
    background-color: #fff
    border-radius: 5px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
    position: relative
    padding-top: calc(30/1920*100vw)
    .list-table
      .table-white 
        /deep/
        .el-table
          box-shadow: none !important
          border: none !important
          background-color: #fff
          padding-left: 12px
          padding-right: 12px


  .el-audit-header
    .search-button
      float: right
      color:#FFF
      &:hover
        background-color: #3d4854
        color:#FFF






    
  .alert-popup
    .el-dialog__header
      color: #c60957
  .button-area
    height: 23px
    padding: 0 5px

  .tablelist_workflows
    .el-table__header
      width: auto !important

    .el-table__body
      width: auto !important
    

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start
  .el-table
    border: none !important
    
  // .el-button--primary
  //   color: #fff
  //   background-color: #190
  //   border-color: #190



    .forDescription
      position: relative
      &:hover
        .showDescription
          display: block
      .shortdescription
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        width: 200px
      .showDescription
        position: fixed
        width: 500px
        height: fit-content
        font-size: 13px
        line-height: 1.5
        padding: 10px
        background: rgba(0,0,0,.75)
        color: #fff
        border-radius: 3px
        z-index: 1000
        display: none

  .forWorkflowsSwitch
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    
  .width-fit
    width: max-content !important
  
  .pagination_row
    //position: absolute;
    height: 30px
    margin: 30px 0
    margin-right: calc(20/1920*100vw)
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
    


</style>
