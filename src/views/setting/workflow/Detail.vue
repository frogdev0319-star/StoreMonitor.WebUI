<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      流程配置
      <div class="spacer"/>
      <div class="buttons">
        <delay-button
          type="filled"
          class="schedule-btn">
          <div class="button-area">
            <span>保存並發布</span>
          </div>
        </delay-button>
      </div>
    </div>
    <!-- 基本信息 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table table-name="基本信息">
            <template slot="tableDetail">

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">* 流程名稱</div>
                <div class="title-status"> 
                  <el-input
                    :placeholder="infoForm.name"
                    v-model="infoForm.name"
                    
                    />
                </div>

                <div class="title-name">* 流程分類</div>
                <div class="title-status"> 
                  <el-select
                    v-model="curTemplateIndex"
                    class="device-select"
                    :placeholder="infoForm.type"
                    :disabled="true"
                    >
                    <el-option
                      v-for="(item, index) in templateList"
                      :key="index"
                      :label="infoForm.type"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">流程描述</div>
                <div class="title-status"> 
                  <el-input
                    v-model="infoForm.description"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="流程描述"
                    class="storevue-textarea"
                    type="textarea"
                    resize="none"
                  />
                </div>
              </div>
            </template>
          </setting-table>
        </div>

        <!-- 流程配置 -->
        <div class="inspect-basic">
          <!-- btn -->
          <div class="buttons add-node-btn">
            <el-button
              class="storevue-button-outlined"
              size="mini" type="primary">
              <i class="iconfont el-icon-plus"/>
              添加審核節點
            </el-button>
          </div>

          <setting-table table-name="流程配置">
            <template slot="tableDetail" style="padding: 30px">
                <div class="tablelist">
                  <table-only
                    ref="elTP"
                    class="table-white"
                    :column-data="columnData"
                    :table-data="flatNodeData"
                    :table-operation ="columnOperationData"
                    :highlight-current-row= "false"
                    :is-loading-data="isLoadingData"
                    :allowRowExpand = "false"
                    :showBorder = "false"
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                    :tableHeight = "760"
                    :cellStyle="{backgroundColor: '#fff !important'}"
                    :indexType="indexType"
                  />
                </div>
            </template>

            <!-- <template slot="tableDetail" style="padding: 30px">
              <el-table
                :data="flatNodeData"
                style="width: 100%">
                <el-table-column
                  prop="id"
                  label="節點序號"
                  width="100"/>
                <el-table-column
                  prop="name"
                  label="節點名稱"
                  width="230"/>
                <el-table-column
                  prop="auditByUsers"
                  label="審批人"
                  width="180"/>

                <el-table-column
                  label="審批方式">
                  <template slot-scope="{row}">
                    <div class="title-status">
                      <el-radio-group class="storevue-radio" >
                        <el-radio :label="true">會簽</el-radio>
                        <el-radio :label="false">或簽</el-radio>
                      </el-radio-group>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否需要簽名">
                  <template slot-scope="{row}">
                    <div class="title-status">
                      <el-radio-group class="storevue-radio" >
                        <el-radio :label="false">需要</el-radio>
                        <el-radio :label="false">不需要</el-radio>
                      </el-radio-group>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="for_row">
                      <div class="go_up">上移</div>
                      <div class="go_down">下移</div>
                      <img :src="penSrc" class="iconfont icon-gengduo">
                      <img :src="deleteSrc" class="iconfont icon-gengduo">
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template> -->
          </setting-table>

          <!-- row -->
          <div class="setting-config basic-config">
            <div class="title-name">添加流程抄送人</div>
            <div class="title-status">
              <!-- <el-select
                v-model="curTemplateIndex"
                class="device-select"
                size="mini"
                placeholder="大区经理、加盟主…"
                @change="displayTemplateInfo">
                <el-option
                  v-for="(item, index) in templateList"
                  :key="index"
                  :label="swswsws"
                  :value="index"
                />
              </el-select> -->
            </div>
          </div>



        </div>
      </div>
    </div>


  </div>
</template>
<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import {getNodeList } from "@/api/workflow";
import TableOnly from '@/components/TableOnly';
import util from "@/common/util";
export default {
  name: 'WorkflowDetail',
  components: {
    TableOnly,
    
    DelayButton,
    SettingTable,
    
  },
  data() {
    return {
      dataFromRoute: {},
      workflowDetail: {},
      templateList: ['巡檢表單'],
      curTemplateIndex:'',
      basicList: [],
      isLoadingData: false,
      workflowDescription: '',
      infoForm: {},
      nodeList:{},
      flatNodeData:[],
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '134',
        align: 'center',
        operation: [
          {
            lable: '',
            icon: 'icon-copy',
            methods: 'copy'
          },
          {
            lable: '',
            icon: 'icon-setting',
            methods: 'set'
          },
          {
            lable: '',
            icon: 'icon-delete',
            methods: 'delete'
          }
        ]
      },
      columnData: [
        {
          'prop': 'name',
          'label': '節點名稱',
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'auditByUsers',
          'label': '審批人',
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'auditMethod',
          'label': '審批方式',
          'width': 130,
          'maxWidth': 130,
        },
        {
          'prop': 'signature',
          'label': '是否需要簽名',
          'width': 130,
          'maxWidth': 130
        },
        
      ],
      indexType: true,
      penSrc: require('../../../../static/img/table-edit.png'),
      deleteSrc: require('../../../../static/img/table-delete.png')

    };
  },
  created() {
    this.getWorkflowInfo()
    this.getNodeList(this.infoForm.processDefinitionKey)
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
  methods: {
    getWorkflowInfo(){
      const data = sessionStorage.getItem('workflowDetail')
      this.infoForm = JSON.parse(data)
      this.infoForm.type = "巡檢表單"
      
      console.log('this.infoForm  ===>> ', this.infoForm );
      
    },


    getNodeList(id){
      this.isLoadingData = true
      getNodeList(id).then(res=>{
        
        this.nodeList =  res.data

        // get object depth
        const objectDepth = (o) =>
          Object (o) === o ? 1 + Math .max (-1, ... Object .values(o) .map (objectDepth)) : 0
      
        var depth = objectDepth(this.nodeList) - 3
        console.log('level :>> ', depth);

        // flat data
        const needData = []
        const firtData ={
            "name": "提交人",
            "auditByUsers": "提交人",
        }
        needData.push(firtData)

        var {nextAuditNode} = this.nodeList
        needData.push(nextAuditNode)

        for (let index = 1; index < depth; index++) {
          var {nextAuditNode} = nextAuditNode
          needData.push(nextAuditNode)
        }
        
        this.flatNodeData = needData  

        
        // var {nextAuditNode} = this.nodeList.nextAuditNode
        console.log('this.nodeList ======>> ', this.nodeList);
        console.log('flatNodeData ======>> ', this.flatNodeData);




        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });

    },
    // addNode() {
    //   this.$router.push({ name: 'nodeSetting' })
    // },
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
    width: 100px;
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