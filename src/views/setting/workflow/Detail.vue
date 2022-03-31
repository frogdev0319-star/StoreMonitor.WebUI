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
                <div class="title-name">* 流程名称</div>
                <div class="title-status">
                  <el-select
                    v-model="curTemplateIndex"
                    class="device-select"
                    size="mini"
                    placeholder="模板一"
                    @change="displayTemplateInfo">
                    <el-option
                      v-for="(item, index) in templateList"
                      :key="index"
                      :label="swswsws"
                      :value="index"
                    />
                  </el-select>
                </div>

                <div class="title-name">* 流程分類</div>
                <div class="title-status">
                  <el-select
                    v-model="curTemplateIndex"
                    class="device-select"
                    size="mini"
                    placeholder="模板一"
                    @change="displayTemplateInfo">
                    <el-option
                      v-for="(item, index) in templateList"
                      :key="index"
                      :label="swswsws"
                      :value="index"
                    />
                  </el-select>
                </div>
              </div>
              <!-- row -->
              <div class="setting-config basic-config">
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
              <el-table
                :data="detailData"
                style="width: 100%">
                <el-table-column
                  prop="node"
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

              <!-- <div class="setting-config basic-config">
                <div class="title-name">* 流程名称</div>
                <div class="title-status">
                  <el-radio-group class="storevue-radio" >
                    <el-radio :label="true">會簽</el-radio>
                    <el-radio :label="false">或簽</el-radio>
                    <el-radio :label="false">需要</el-radio>
                    <el-radio :label="false">不需要</el-radio>
                  </el-radio-group>
                </div>
                
                <div class="title-operation">
                  <div class="flex-center" style="background-color: #f7f9fa; padding: 12px">
                    <div class="flex-center">
                      <span class="span-font" style="margin-right: 20px">{{ $t('titleView.statisIndex') }}</span>
                      <div>
                        <el-radio-group class="storevue-radio" >
                          <el-radio :label="0">{{ $t('overview.pass') }}</el-radio>
                          <el-radio :label="1">{{ $t('overview.failed') }}</el-radio>
                        </el-radio-group>
                      </div>
                    </div>
                    <div class="flex-center">
                      <span class="span-font" style="margin-right: 20px;margin-left: 60px">{{ $t('titleView.displayofStatisticalResults') }}</span>
                      <el-radio-group class="storevue-radio" >
                        <el-radio :label="0">{{ $t('titleView.radar') }}</el-radio>
                        <el-radio :label="1">{{ $t('titleView.pie') }}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div> -->

            </template>
          </setting-table>

          <!-- row -->
          <div class="setting-config basic-config">
            <div class="title-name">添加流程抄送人</div>
            <div class="title-status">
              <el-select
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
              </el-select>
            </div>
          </div>



        </div>
      </div>
    </div>

<!--   
    <el-button
      class="storevue-button-filled"
      size="mini" type="primary" @click="submit">
      保存並發布
    </el-button>
    <el-button
      class="storevue-button-outlined"
      size="mini" type="primary" @click="addNode">
      新增節點
    </el-button> -->
    <!-- <el-table
      :data="workflowDetail.nextNodes"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="節點名稱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="auditByUsers"
        label="審批人"
        width="180">
      </el-table-column>
      <el-table-column
        label="審批方式">
        <template slot-scope="{row}">
          <span>{{row.rowdata}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否需要簽名">
        <template slot-scope="{row}">
          <span>{{row.rowdata}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{row}">
          <span>{{row.rowdata}}</span>
        </template>
      </el-table-column>
    </el-table> -->



  </div>
</template>
<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import { getWorkflowInfo, updateWorkflow, } from "@/api/workflow";
import util from "@/common/util";
export default {
  name: 'WorkflowDetail',
  components: {
    DelayButton,
    SettingTable
  },
  data() {
    return {
      dataFromRoute: {},
      workflowDetail: {},
      templateList: [],
      basicList: [],
      isLoadingData: false,
      workflowDescription: '',
      detailData: [
        {
          'node': 1,
          'name': 'TEST',
          'auditByUsers': 'Albert',
        },
        {
          'node': 2,
          'name': 'Super Test',
          'auditByUsers': 'Albert',
        },
        {
          'node': 3,
          'name': 'this TEST',
          'auditByUsers': 'Albert',
        },
        {
          'node': 4,
          'name': 'OKOKOK',
          'auditByUsers': 'Albert',
        },

      ],
      penSrc: require('../../../../static/img/table-edit.png'),
      deleteSrc: require('../../../../static/img/table-delete.png')

    };
  },
  mounted() {
    this.dataFromRoute = { ...this.$route.params.data }
    getWorkflowInfo({
      processDefinitionKey: this.dataFromRoute.processDefinitionKey
    }).then(res => {
      function getNodes (nodes, data) {
        if (data.nextAuditNode) {
          nodes.push(data.nextAuditNode)
          getNodes(nodes, data.nextAuditNode)
        } else return
      }
      let nextNodes = [];
      this.workflowDetail = { ...res.data }
      getNodes(nextNodes, this.workflowDetail)
      this.workflowDetail['nextNodes'] = nextNodes;
    })
  },
  methods: {
    addNode() {
      this.$router.push({ name: 'nodeSetting' })
    },
    submit() {
      let array = this.workflowDetail.nextNodes;
      let object = { ...array[0] };
      let i = array.length - 1;
      while(i >= 0) {
        object['nextAuditNode'] = { ...array[i].nextAuditNode };
        i--;
      }
      let nextAuditNode = JSON.parse(JSON.stringify(object));
      updateWorkflow({
        ...this.workflowDetail,
        nextAuditNode
      }).then(res => {
        console.log(res);
      });
    }
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