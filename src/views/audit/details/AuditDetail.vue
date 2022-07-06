<template>
  <div v-loading="isLoadingData" class="setting-details self-loading">
  <div class="page-container report-setting paper " style="height: 100%">
    <div class="audit-section">
      <!-- audit-header -->
      <div class="audit-header">
        <h3>簽核巡檢表</h3>
        <div class="goto-report">報告詳情</div>
      </div>
      
      <div v-loading="isLoadingData" class="setting-details self-loading">
        <!-- audit body -->
        <div class="audit-flow-body">

          <div class="audit-flow-ownerhandling">
            <p>簽核流程</p>
            <div class="handling">
              <div class="withdraw">撤回</div>
              <div class="l-l"> | </div>
              <div class="cancel">取消</div>
            </div>
          </div>

          <!-- task -->
          <div class="audit-flow-unit" v-for="taskItem in taskInfo" :key="taskItem.nodeId" :class="{ not__yet: taskItem.tasks[0].taskId == null }">
            <div class="check" v-if="taskItem.state == 0"><i class="iconfont el-icon-success iconbangzhu"/></div>
            <div class="check" v-else-if="taskItem.state == 1"><i class="iconfont el-icon-success iconbangzhu"/></div>
            <div class="check" v-else-if="taskItem.state == 2"><i class="iconfont el-icon-time iconbangzhu"/></div>
            <div class="check" v-else-if="taskItem.state == 3"><i class="iconfont el-icon-more iconbangzhu need_grey"/></div>

              <div class="audit-flow-content" :class="{ on_audit : taskItem.state == 2 }">
                <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                  <div class="audit-name">
                    <div class="audit-workflow-name">{{taskItem.nodeName}}</div>
                    <div class="audit-user-name" v-if="taskItem.tasks[0].assignee !== null && taskItem.tasks[0].auditByUsers.length == 0 ">{{taskItem.tasks[0].assignee.titleName}} -- {{taskItem.tasks[0].assignee.userName}} <span>({{taskItem.tasks[0].startTs}})</span></div>
                    <div class="audit-user-name" v-else-if="taskItem.tasks[0].assignee == null && taskItem.tasks[0].auditByUsers.length > 0"> {{taskItem.tasks[0].auditByUsers[0].titleName}} -- {{taskItem.tasks[0].auditByUsers[0].userName}} <span>({{taskItem.tasks[0].startTs}})</span></div>
                  </div>
                  <div class="audit-situation"  v-if="taskItem.state == 1">
                    <div class="audit_agree" v-if="taskItem.tasks[0].comment.result == 0 && taskItem.tasks[0].comment.result !== null"><i class="iconfont el-icon-check"/> 同意</div>
                    <div class="audit_disagree" v-else-if="taskItem.tasks[0].comment.result == 1 && taskItem.tasks[0].comment.result !== null"><i class="iconfont el-icon-close"/> 駁回</div>
                  </div>
                </div>
                <div class="audit-description">
                  <div class="audit-description-comment" v-if="taskItem.state == 1">{{taskItem.tasks[0].comment.description}}</div>
                  <div class="audit-description-data">
                  </div>
                </div>
              </div>
          </div>
      
          <!-- workflow static div-->
          <!-- <div class="audit-flow-unit">
            <div class="check"><i class="iconfont el-icon-success iconbangzhu"/></div>
            <div class="audit-flow-content">
              <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                <div class="audit-name">
                  <div class="audit-workflow-name">送出簽核</div>
                  <div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
                </div>
                <div class="audit-situation">
                  <div class="audit_agree">同意</div>
                </div>
              </div>
              <div class="audit-description">
                <div class="audit-description-comment">這是一個很長很長的故事～</div>
                <div class="audit-description-data">
                </div>
              </div>
            </div>
          </div>

          <div class="audit-flow-unit ">
            <div class="check"><i class="iconfont el-icon-time iconbangzhu"/></div>
            <div class="audit-flow-content on_audit">
              <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                <div class="audit-name">
                  <div class="audit-workflow-name">主管簽核</div>
                  <div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
                </div>
                <div class="audit-situation">
                  <div class="audit_agree">同意</div>
                  <div class="audit_disagree">駁回</div>
                </div>
              </div>
              <div class="audit-description">
                <div class="audit-description-comment">這是一個很長很長的故事～</div>
                <div class="audit-description-data">
                  <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                  <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                  <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                </div>
              </div>
            </div>
          </div>

          <div class="audit-flow-unit not__yet">
            <div class="check"><i class="iconfont el-icon-more iconbangzhu"/></div>

            <div class="audit-flow-content">
              <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                <div class="audit-name">
                  <div class="audit-workflow-name">送出簽核</div>
                  <div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
                </div>
                <div class="audit-situation">
                  <div class="audit_agree">同意</div>
                </div>
              </div>
              <div class="audit-description">
                <div class="audit-description-comment">這是一個很長很長的故事～</div>
                <div class="audit-description-data">
                </div>
              </div>
            </div>
            <div class="audit-flow-content on_audit">
              <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                <div class="audit-name">
                  <div class="audit-workflow-name">送出簽核</div>
                  <div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
                </div>
                <div class="audit-situation">
                  <div class="audit_agree">同意</div>
                </div>
              </div>
              <div class="audit-description">
                <div class="audit-description-comment">這是一個很長很長的故事～</div>
                <div class="audit-description-data">
                </div>
              </div>
            </div>
            <div class="audit-flow-content">
              <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                <div class="audit-name">
                  <div class="audit-workflow-name">送出簽核</div>
                  <div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
                </div>
                <div class="audit-situation">
                  <div class="audit_agree">同意</div>
                </div>
              </div>
              <div class="audit-description">
                <div class="audit-description-comment">這是一個很長很長的故事～</div>
                <div class="audit-description-data">
                </div>
              </div>
            </div>
          </div> -->

        </div>
      </div>

    </div> 
  </div>
  </div>
</template>
<script>
import {
    GetTaskInfo,
  } from '@/api/workflow';

import DelayButton from '@/components/DelayButton';
// import SettingTable from '@/components/SettingTable';
// import {getNodeList, updateWorkflow} from "@/api/workflow";
// import TableOnly from '@/components/TableOnly';
// import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowDetail',
  components: {
    
  },
  data() {
    return {
      loading: false,
      isLoadingData: false,
      fullscreenLoading: false,

      auditDetail:'',
      taskInfo:'',
  
    }
  },
  mounted() {},
  async created() {
    await this.init()
  },
  methods: {
    async init(){
      await this.getWorkflowInfo()
      await this.getTaskInfo(this.auditDetail.inspectReportId)
    },

    getWorkflowInfo(){
      const data = sessionStorage.getItem('auditDetail')
      this.auditDetail = JSON.parse(data)
      console.log('this.auditDetail 1 ----->> ', this.auditDetail);
    },

    async getTaskInfo(param){
      this.isLoadingData = true
      await GetTaskInfo(param).then(res=>{
        res.data.forEach(t =>{
          t.startTs = new Date(t.startTs).toLocaleString()
          t.endTs = new Date(t.endTs).toLocaleString()
          t.tasks.forEach(tt =>{
            tt.startTs = new Date(tt.startTs).toLocaleString()
            tt.endTs = new Date(tt.endTs).toLocaleString()
          })
        })

        this.taskInfo = res.data
        console.log('this.taskInfo 2 ----->> ', this.taskInfo);

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },
  }
}
</script>

<style lang="sass" scoped>
  .not__yet
    color: #c0c0c0 !important
  .iconbangzhu 
    color: #556679
    font-size: 23px
  .need_grey
    color: #c9c9c9 !important

  h3 
    margin: 0
    font-size: calc(18/1920*100vw)
  p
    margin: 0
    font-size: 15px

  .on_audit
    border-top: 2px solid #006ab7
    border-bottom: 2px solid #006ab7

  .for-flex
    display: flex
    flex-direction: row
    justify-content: flex-start 
    align-items: flex-end
  .justify-content_space-between
    justify-content: space-between
  
  .report-setting
    height: 100%
    position: relative
    font-size: calc(18/1920*100vw)
    box-sizing: border-box
  .audit-section
    text-align: left
    .audit-header
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center
      border-bottom: 1px solid #e3e9f4
      padding: calc(20/1920*100vw)
      .goto-report
        font-size: 15px
        color: #006ab7
        cursor: pointer
        &:hover
          color: #17537e
          transition: all .3s

    .audit-flow-body
      padding: calc(30/1920*100vw)
      .audit-flow-ownerhandling
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: cente
        .handling
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          margin-right: 20px
          margin-bottom: 30px
          .withdraw, .cancel
            font-size: 14px
            font-weight: 900
            color: #006ab7
            cursor: pointer
            &:hover
              color: #17537e
              transition: all .3s
          .l-l
            margin: 0 10px
            font-size: 14px
            color: #006ab7


      .audit-flow-unit
        color: #556679
        border-left: 2px dotted #ddd
        margin-left: 20px
        padding: 0px 20px 30px 30px
        position: relative
        &:nth-child(2)
          .audit-flow-content
            padding-top: 0px
          .check
            top: 0
        .check
          background: #FFF
          position: absolute
          top: 10px
          left: -12px
        
        .audit-flow-content
          padding-top: 8px
          margin-bottom: 20px

            // padding-top: 0px !important

          .audit-name
            .audit-workflow-name
              font-size: 15px
              font-weight: 900
              margin-bottom: 3px
            .audit-user-name
              font-size: 12px
          .audit-situation
            i 
              margin-right: 5px
            .audit_agree
              width: 120px
              height: 27px
              border-radius: 3px
              color: #59ab22
              background: #e8f6de
              font-size: 14px
              display: flex
              flex-direction: row
              justify-content: center
              align-items: center
            .audit_disagree
              width: 120px
              height: 27px
              border-radius: 3px
              color: #fa4600
              background: #ffefeb
              font-size: 14px
              display: flex
              flex-direction: row
              justify-content: center
              align-items: center
            
          .audit-description
            background: #f7f9fa
            padding: 20px
            .audit-description-comment
              font-size: 14px
            .audit-description-data
      
              img
                margin-top: 10px
                margin-right: 10px
                width: 200px
                border-radius: 4px

</style>


