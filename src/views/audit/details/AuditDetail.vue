<template>
  <div v-loading="isLoadingData" class="setting-details self-loading">
  <div class="page-container report-setting paper " style="height: 100%">
    <div class="audit-section">
      <!-- audit-header -->
      <div class="audit-header">
        <h3>簽核巡檢表</h3>
        <div class="goto-report" @click="goTorReportdetails">報告詳情</div>
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
            
            <!-- audit task wrapper -->
            <div class="audit-task-wrapper" :class="{ on_audit : taskItem.state == 2 }" >
              <div class="audit-workflow-name">{{taskItem.nodeName}}</div>
              <div class="audit-flow-content"  v-for=" task in taskItem.tasks" :key="task.taskId">
                <!-- name -->
                <div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
                  <div class="audit-name">
                    <div class="audit-user-name" v-if="task.assignee !== null && task.auditByUsers.length == 0 ">{{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.startTs}})</span></div>
                    <div class="audit-user-name" v-else-if="task.assignee == null && task.auditByUsers.length > 0"> {{task.auditByUsers[0].titleName}} -- {{task.auditByUsers[0].userName}} <span>({{taskItem.tasks[0].startTs}})</span></div>
                  </div>
                  <div class="audit-situation"  v-if="taskItem.state == 1">
                    <div class="audit_agree" v-if="task.comment.result == 0 && task.comment.result !== null"><i class="iconfont el-icon-check"/> 同意</div>
                    <div class="audit_disagree" v-else-if="task.comment.result == 1 && task.comment.result !== null"><i class="iconfont el-icon-close"/> 駁回</div>
                  </div>
                </div>
                <!-- description -->
                <div class="audit-description">
                  <div class="audit-description-comment" v-if="task.comment !== null " >{{task.comment.description}}</div>
                  <div class="audit-description-data" v-if="task.comment !== null ">
                    <img :src="blopSign.content" alt="" v-for="blopSign in task.comment.signature" :key="blopSign.ts" style="background: #FFF">
                    <img :src="blopImg.url" alt="" v-for="blopImg in task.comment.attachment" :key="blopImg.ts">
                  </div>
                </div>
              </div>
            </div>
          </div>

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

    goTorReportdetails(){
      var reportId = this.auditDetail.inspectReportId
      console.log("cancancel:",this.auditDetail.cancelable && (this.auditDetail.auditState==2 ||this.auditDetail.auditState==3 || this.auditDetail.auditState==6))
        this.$router.push(
          { 
            name: 'auditReportdetails', 
            params: {
              reportId: reportId, 
              isAuditMode: true, 
              canEdit: (this.auditDetail.auditState==3 || this.auditDetail.auditState==6),
              canCancel: this.auditDetail.cancelable && (this.auditDetail.auditState==2 ||this.auditDetail.auditState==3 || this.auditDetail.auditState==6)
              }
          }
        );
    },

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
        padding: 0px 10px 30px 30px
        position: relative
        &:nth-child(2)
          .audit-task-wrapper
            padding-top: 0px
          .check
            top: 0
        .check
          background: #FFF
          position: absolute
          top: 10px
          left: -12px
        .audit-task-wrapper
          padding-top: 10px
          margin-bottom: 20px
          .audit-workflow-name
              font-size: 15px
              font-weight: 900
              margin-bottom: 3px
              

          .audit-flow-content
            // padding-top: 0px !important
            margin-bottom: 10px
            .audit-name
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
                display: flex
                flex-direction: row
                justify-content: flex-start
                align-items: flex-start
                img
                  margin-top: 10px
                  margin-right: 10px
                  width: auto
                  height: 120px
                  border-radius: 4px
</style>


