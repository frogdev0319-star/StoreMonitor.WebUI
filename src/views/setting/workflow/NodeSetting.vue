<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      添加審核節點
      <div class="spacer"/>
      <delay-button 
        type="filled" 
        @click="saveNode"
        v-loading.fullscreen.lock="fullscreenLoading"
        >保存</delay-button>

    </div>

    <!-- 基本信息 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table table-name="基本信息">
            <template slot="tableDetail">

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">* 節點名稱</div>
                <div class="title-status">
                  <el-input
                    v-model="nodeData.name"
                    placeholder="请输入节点名称"
                    class="input-name"/>
                </div>

                <div class="title-name">* 添加職務</div>
                <div class="title-status">
                  <el-select v-model="managers" placeholder="請選擇部門">
                    <el-option
                      v-for="item in department"
                      :key="item.defineId"
                      :label="item.defineName"
                      :value="item.defineId">
                    </el-option>
                  </el-select>
                </div>
                <!-- <div class="title-status">
                  <el-select
                    class="device-select"
                    size="mini"
                    placeholder="管理員">
                    <el-option
                      v-for="(item, index) in templateList"
                      :key="index"
                    />
                  </el-select>
                </div> -->
              </div>

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">審批方式</div>
                <div class="flex">
                  <el-radio-group class="storevue-radio" v-model="nodeData.auditMethod">
                    <el-radio :label="1">會簽</el-radio>  
                    <el-tooltip
                      class="date-time-tooltip"
                      effect="light"
                      placement="right">
                      <div slot="content">一人通过，则通过；一人驳回，则驳回</div>
                      <i class="iconfont icon-bangzhu iconbangzhu"/>
                    </el-tooltip>

                    <el-radio :label="0">或簽</el-radio>
                    <el-tooltip
                      class="date-time-tooltip"
                      effect="light"
                      placement="right">
                      <div slot="content">一人通过，则通过；一人驳回，则驳回</div>
                      <i class="iconfont icon-bangzhu iconbangzhu"/>
                    </el-tooltip>
                  </el-radio-group>
                </div>
              </div>

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">審批按鈕</div>
                <div class="approve">
                    <div class="approve_row">
                      <el-radio-group class="storevue-radio" v-model="nodeData.customButton[0].type">
                        <el-radio :label="1">同意</el-radio>  
                        <el-radio :label="0">自定義名稱</el-radio>
                        <el-input
                          placeholder="//自定义属性名称，如通过"
                          class="input-name"/>
                      </el-radio-group>
                    </div>

                    <div class="approve_row">
                      <el-radio-group class="storevue-radio" v-model="nodeData.customButton[1].type">
                        <el-radio :label="1">拒绝</el-radio>  
                        <el-radio :label="0">自定義名稱</el-radio>
                        <el-input
                          placeholder="//自定义属性名称，如通过"
                          class="input-name"/>
                      </el-radio-group>
                    </div>
                  





                  <!-- <div class="approve_row" v-for="(item, index) in nodeData.customButton" :key="item.index">
                    <el-checkbox
                      v-model="nodeData.customButton[index].enable"
                      class="storevue-checkbox-outlined"
                      :label="item.text"/>
                    <el-input
                      placeholder="//自定义属性名称，如通过"
                      class="input-name"/>
                  </div> -->


                  <!-- <div class="approve_row">
                    <el-checkbox
                      v-model="this.nodeData.customButton[0].enable"
                      class="storevue-checkbox-outlined"
                      label="同意"/>
                    <el-input
                      placeholder="//自定义属性名称，如通过"
                      class="input-name"/>
                  </div>
                  <div class="approve_row">  
                    <el-checkbox
                      v-model="this.nodeData.customButton[1].enable"
                      class="storevue-checkbox-outlined"
                      label="拒絕"/>
                    <el-input
                      placeholder="//自定义属性名称，如通过"
                      class="input-name"/>
                  </div>
                  <div class="approve_row">  
                    <el-checkbox
                      class="storevue-checkbox-outlined"
                      label="撤回"/>
                    <el-input
                      placeholder="//自定义属性名称，如通过"
                      class="input-name"/>
                  </div> -->
                </div>
              </div>

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">簽名</div>
                <div class="title-status">
                  <el-checkbox
                    v-model="nodeData.signature"
                    class="storevue-checkbox-outlined"
                    label="簽名"/>
                </div>
              </div>


              <!-- row -->
              <!-- <div class="setting-config basic-config">
                <div class="title-name">流程描述</div>
                <div class="title-status">
                  <el-input
                    v-model="workflowDescription"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="流程描述"
                    size="mini"
                    class="storevue-textarea"
                    type="textarea"
                    resize="none"
                  />
                </div>
              </div> -->
            </template>
          </setting-table>
        </div>

      </div>
    </div>

    <!-- 節點停留時間 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table table-name="節點停留時間">
            <template slot="tableDetail">

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-status">
                  <el-checkbox
                    class="storevue-checkbox-outlined"
                    label="超時發送訊息提醒"/>
                </div>
              </div>
              
              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-status">
                  停留超過
                  <el-input
                    placeholder=""
                    class="input-name_short"/>
                  天
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
import {updateWorkflow} from "@/api/workflow";
import {getDepartmentList } from '@/api/checkin';


import util from "@/common/util";
export default {
  name: 'WorkflowDetail',
  components: {
    DelayButton,
    SettingTable
  },
  data() {
    return {
      nodeData: [],
      infoForm: {},
      apiData: {},

      dataFromRoute: {},
      workflowDetail: {},
      department: [],
      managers: '',
      fullscreenLoading: false,
      basicList: [],
      isLoadingData: false,
      workflowDescription: '',
      aa:''
    };
  },
  mounted() {
    // this.dataFromRoute = { ...this.$route.params.data }
    // getWorkflowInfo({
    //   processDefinitionKey: this.dataFromRoute.processDefinitionKey
    // }).then(res => {
    //   function getNodes (nodes, data) {
    //     if (data.nextAuditNode) {
    //       nodes.push(data.nextAuditNode)
    //       getNodes(nodes, data.nextAuditNode)
    //     } else return
    //   }
    //   let nextNodes = [];
    //   this.workflowDetail = { ...res.data }
    //   getNodes(nextNodes, this.workflowDetail)
    //   this.workflowDetail['nextNodes'] = nextNodes;
    // })
  },
  async created() {
    await this.init()
  },
  methods: {
    async init(){
      await this.getNodeInfo() 
      await this.getWorkflowInfo()
      await this.getDepartmentList()
    }, 

    // get getDepart
    async getDepartmentList(){
      await getDepartmentList({ type: 0 }).then(res=>{
        this.department = res.data
      }).catch(err => {
        console.log('error' + err);
      });
    },


    getWorkflowInfo(){
      const data = sessionStorage.getItem('workflowDetail')
      this.infoForm = JSON.parse(data)
      this.infoForm.type = "巡檢表單"
    },
    
    getNodeInfo(){
      const data = sessionStorage.getItem('workflowNode')
      const apiData = sessionStorage.getItem('nodeDataToApi')

      this.nodeData = JSON.parse(data)
      this.apiData = JSON.parse(apiData)
      console.log('this.nodeData :>> ', this.nodeData);
      console.log('this.apiData :>> ', this.apiData);
    },

    saveNode(){
      console.log('this.nodeData Adjust:>> ', this.nodeData)
      this.fullscreenLoading = true
      if(this.nodeData.id == undefined){
        this.apiData.orderedAuditNodeArray = [...this.apiData.orderedAuditNodeArray, this.nodeData]
      }else{
        // edit
        console.log("this is Editing")
        var apiDataIndex = this.apiData.orderedAuditNodeArray.findIndex(i => i.id == this.nodeData.id)
        console.log('apiDataIndex :>> ', apiDataIndex);
        this.apiData.orderedAuditNodeArray.splice(apiDataIndex, 1 , this.nodeData)
        sessionStorage.setItem('workflowNode', JSON.stringify(this.nodeData))
      }
    
      // call api
      updateWorkflow(this.apiData).then(res=>{
        console.log('res :>> ', res);
        this.$router.push({name: 'workflowDetail'})
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    // submit() {
    //   let array = this.workflowDetail.nextNodes;
    //   let object = { ...array[0] };
    //   let i = array.length - 1;
    //   while(i >= 0) {
    //     object['nextAuditNode'] = { ...array[i].nextAuditNode };
    //     i--;
    //   }
    //   let nextAuditNode = JSON.parse(JSON.stringify(object));
    //   updateWorkflow({
    //     ...this.workflowDetail,
    //     nextAuditNode
    //   }).then(res => {
    //     console.log(res);
    //   });
    // }
  }
};
</script>

<style lang="sass">

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start

  .setting-titles
    display: flex
    justify-content: space-between
    border-bottom: 1px solid #e3e9f4
  .setting-details
    margin: 30px
  .storevue-textarea
    width: 50vw
  .device-select
    .el-input__inner
        height: 30px
  .icon-gengduo
    width: 24px
    height: 24px
    vertical-align: middle
    cursor: pointer
    margin-left: 20px
  .for_row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .go_up
      margin-right: 20px
      color: #006ab7
    .go_down
      color: #006ab7
  .add-node-btn
    position: absolute
    right: 1%
    top: 3px
  .approve
    width: 60vw
  .approve_row
    background-color: #f7f9fa
    padding: calc(15/1920*100vw) calc(20/1920*100vw)
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .el-input
      margin-left: 10px
</style>

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
  .input-name.el-input--medium >>> .el-input__inner{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .input-name_short{
    width: 100px;
    height: 30px;
  }
  .input-name_short.el-input--medium >>> .el-input__inner{
    height: 30px;
    line-height: 30px;
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
    /* border-bottom: 1px solid #e3e9f4; */
    padding-left: calc(30/1920*100vw);
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: 15%;
    text-align: left;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    width: 20%;
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
    /* width: 90px !important; */
    margin-right: 20px;
  }
  .el-tooltip{
    margin-right: 30px;
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
    color: #424151;
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