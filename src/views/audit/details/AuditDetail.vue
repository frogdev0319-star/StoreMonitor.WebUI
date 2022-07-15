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
          <AuditUnit :taskInfo = "taskInfo"/>

        
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
import AuditUnit from '@/components/AuditUnit';


export default {
  name: 'WorkflowDetail',
  components: {
    AuditUnit
  },
  data() {
    return {
      loading: false,
      isLoadingData: false,
      fullscreenLoading: false,

      auditDetail:'',
      taskInfo: [],
  
    }
  },
  mounted() {},
  async created() {
    await this.init()
  },
  methods: {

    goTorReportdetails(){
      var reportId = this.auditDetail.inspectReportId
      console.log("cancancel:",this.auditDetail.cancelable && (this.auditDetail.auditState==2 ||this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7))
        this.$router.push(
          { 
            name: 'auditReportdetails', 
            params: {
              reportId: reportId, 
              isAuditMode: true, 
              canEdit: (this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7),
              canCancel: this.auditDetail.cancelable && (this.auditDetail.auditState==2 ||this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7),
              auditCancelable:this.auditDetail.cancelable
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


</style>


