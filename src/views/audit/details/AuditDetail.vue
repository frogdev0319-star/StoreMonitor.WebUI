<template>
  <div v-loading="isLoadingData" class="setting-details self-loading">
    <div class="page-container report-setting paper " style="height: 100%">
      <div class="audit-section">
        <!-- audit-header -->
        <div class="audit-header">
          <h3>{{auditDetail.reportName}}</h3>
          <div class="goto-report" 
            @click="goToReportdetails"
            v-if="showingBtn "> {{$t('route.reportDetails')}}</div>
        </div>
      
        <div v-loading="isLoadingData" class="setting-details self-loading">
          <!-- audit body -->
          <div class="audit-flow-body">

            <div class="audit-flow-ownerhandling">
              <p style="margin-bottom: 30px"> {{$t('audit.workFlows.auditFlow')}}</p>
              <div class="handling" v-if="!onEditing && auditDetail.auditState < 4"> 
                <div class="withdraw" @click="showDoalogTaskDrawback = true" v-if="auditDetail.submitter == currentUserInfo && auditStates !== 3" >{{customButton[2].text}}</div>
                <div class="l-l" v-if="auditDetail.cancelable && auditDetail.submitter == currentUserInfo && auditStates !== 3"> | </div>
                <div class="cancel" @click="showDoalogTaskCancel = true " v-if="auditDetail.cancelable && auditDetail.submitter == currentUserInfo && auditStates !== 3">{{$t('audit.auditStatus.cancel')}}</div>
              </div>
            </div>
            
            <!-- task -->
            <AuditUnit 
              :taskInfo = "taskInfo"
              :auditStates = auditStates
              />

          </div>
        </div>
      </div>
    </div> 
    <!-- popup -->
    <dialog-pop
      :title=" $t('audit.auditStatus.ifDraback')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showDoalogTaskDrawback"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showDoalogTaskDrawback')"
      @cancelHandler="hideDeleteContentDialog('showDoalogTaskDrawback')"
      @confirmHandler="confirmTaskDrawback()"
    >
      <div class="dialog-slot">
        <div class="dialog-content"> {{$t('audit.auditStatus.confirmDraback')}} </div>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('audit.auditStatus.ifCancel')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showDoalogTaskCancel"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showDoalogTaskCancel')"
      @cancelHandler="hideDeleteContentDialog('showDoalogTaskCancel')"
      @confirmHandler="cancelWorkflow()"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{$t('audit.auditStatus.confirmCancel')}} </div>
      </div>
    </dialog-pop>
  </div>
</template>
<script>
import {
    GetTaskInfo,
    taskDrawback,
    CancelWorkflow,
    getNodeList
  } from '@/api/workflow';

import AuditUnit from '@/components/AuditUnit';
import DialogPop from '@/components/DialogPop';


export default {
  name: 'WorkflowDetail',
  components: {
    AuditUnit,
    DialogPop
  },
  data() {
    return {
      loading: false,
      isLoadingData: false,
      fullscreenLoading: false,

      auditDetail:'',
      taskInfo: [],
      auditStates: 0,
      currentUserInfo: '',
      showingBtn: true,

      flatNodeData: [],
      customButton:[
        {
          "type": 0,
          "text": this.$t('audit.workFlows.agree'),
          "enable": true
        },
        {
          "type": 1,
          "text": this.$t('audit.workFlows.reject'),
          "enable": true
        },
        {
          "type": 2,
          "text": this.$t('audit.workFlows.withdraw'),
          "enable": true
        },
      ],

      onEditing: false,
      showDoalogTaskDrawback : false,
      showDoalogTaskCancel : false
    }
  },
  
  mounted() {},
  async created() {
    await this.init()
    // await this.getNodeList(this.auditDetail.processDefinitionKey) 

    const resulit = await this.$store.dispatch("GetUserAuthorities");
    this.currentUserInfo = resulit.data.userId
  },

  methods: {
    goToReportdetails(){
      var reportId = this.auditDetail.inspectReportId
      var canCancel = (this.auditDetail.submitter == this.currentUserInfo) && this.auditDetail.cancelable && (this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7);
      console.log("canCancel:",canCancel);
      if(this.$router.currentRoute.fullPath == "/auditDetail") {
        this.$router.push(
          { 
            name: 'auditReportdetails', 
            params: {
              reportId: reportId, 
              isAuditMode: true, 
              canEdit: (this.auditDetail.submitter == this.currentUserInfo) && (this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7),
              canCancel: canCancel,
              auditCancelable:this.auditDetail.cancelable
              }
          }
        );
      } else if(this.$router.currentRoute.fullPath == "/waitAuditDetail"){
        this.$router.push(
          { 
            name: 'WaitAuditReportdetails', 
            params: {
              reportId: reportId, 
              isAuditMode: true, 
              canEdit: (this.auditDetail.submitter == this.currentUserInfo) && (this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7),
              canCancel: canCancel,
              auditCancelable:this.auditDetail.cancelable
              }
          }
        );
      } else if(this.$router.currentRoute.fullPath =="/transcriptnotifyAuditDetail"){
        console.log('hahaah :>> ');
        this.$router.push(
          { 
            name: 'transcriptnotifyReportdetails', 
            params: {
              reportId: reportId, 
              isAuditMode: true, 
              canEdit: (this.auditDetail.submitter == this.currentUserInfo) && (this.auditDetail.auditState==3 || this.auditDetail.auditState==6 || this.auditDetail.auditState==7),
              canCancel: canCancel,
              auditCancelable:this.auditDetail.cancelable
              }
          }
        );
      }
      
    },

    hideDeleteContentDialog(key) {
      this[key] = false;
    },

    confirmTaskDrawback(){
      console.log('Let me taskDrawback this task');
      // this.$router.push({name: "SendAuditManage"})
      this.taskDrawback()
    },

    async init(){
      await this.getWorkflowInfo()
      await this.getTaskInfo(this.auditDetail.inspectReportId)
      await this.isEditing()
    },

    getWorkflowInfo(){
      const data = sessionStorage.getItem('auditDetail')
      this.auditDetail = JSON.parse(data)
      // console.log('this.auditDetail 1 ----->> ', this.auditDetail);
    },

    async getTaskInfo(param){
      this.isLoadingData = true
      await GetTaskInfo(param).then(res=>{
        res.data.taskList.forEach(t =>{
          t.startTs = new Date(t.startTs).toLocaleString()
          t.endTs = new Date(t.endTs).toLocaleString()
          t.tasks.forEach(tt =>{
            if(tt.startTs !== null) tt.startTs = new Date(tt.startTs).toLocaleString()
            if(tt.endTs !== null) tt.endTs = new Date(tt.endTs).toLocaleString()
          })
        })
        this.auditStates = res.data.auditStates
        this.taskInfo = res.data.taskList

        console.log('this.auditStates ----->> ', this.auditStates);
        console.log('this.taskInfo ori ----->> ', this.taskInfo);

        // 部門簽核完成時間排序
        this.taskInfo.forEach(item =>{
          if(item.tasks.length > 1 && item.state == 1){
            item.tasks.sort((a,b)=>{
              return a.endTs > b.endTs ? 1 : -1
            })
          }
        })

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },
    
    // get node
    async getNodeList(id){
      await getNodeList(id).then(res=>{
        this.nodeList =  res.data
        // flat data
        this.flattenData(this.nodeList)
        this.flatNodeData.forEach(d=>{
          delete d.nextAuditNode
        })
        // console.log('this.taskInfo 2 ------>> ', this.taskInfo);
        console.log('this.flatNodeData 3 ------>> ', this.flatNodeData);

        const currentNode = this.taskInfo.filter( i => i.state == 2)
        var isSignature  = this.flatNodeData.find(n => n.id == currentNode[0].nodeId)
        this.isSignature = isSignature.signature

        this.taskInfo.forEach(t =>{
          this.flatNodeData.forEach(n =>{
            if(t.nodeId === n.id && t.state == 2 && n.customButton[2] !== undefined){
              this.customButton = n.customButton
            }
          })
        })      
      }).catch(err => {
        console.log('error' + err);
      });
    },

    // flatten Data by Recursive
    flattenData(data, key = 'nextAuditNode') {
      if(data[key] !== null) {
          const d = data[key];
          this.flatNodeData.push(d);
          this.flattenData(data[key]);
      } else {
        return this.flatNodeData;
      }
    },

    taskDrawback(){
      
      const value = {
        "inspectReportId" : this.auditDetail.inspectReportId
        }
      taskDrawback(value).then(res=>{
        this.isLoadingData = false
        var reportId = this.auditDetail.inspectReportId
        this.$router.push({name: "SendAuditManage",params: {curTabIndx:1}})
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    cancelWorkflow(){
      const value = {
        "inspectReportId" : this.auditDetail.inspectReportId
        }
      CancelWorkflow(value).then(res=>{
        this.isLoadingData = false
        this.$router.push({name: "SendAuditManage"})
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    // 判斷駁回取消按鈕顯示
    isEditing(){
      this.taskInfo.forEach(t => {
        if(t.parentId == -1 && t.state == 2){
          this.onEditing = true
          this.auditDetail.auditState = 6
        }
      })
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
        align-items: center
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


