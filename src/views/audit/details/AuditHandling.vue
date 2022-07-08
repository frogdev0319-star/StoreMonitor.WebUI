<template>
  <div v-loading="isLoadingData" class="setting-details self-loading">
	<div class="for-flex justify-content_space-between">

		<!-- 簽核巡檢表 -->
		<div class="page-container report-setting paper" style="height: 100%; width:49.5%">
			<div class="audit-section">
				<!-- audit-header -->
				<div class="audit-header">
					<h3>簽核巡檢表</h3>
					<div class="goto-report">報告詳情</div>
				</div>
        

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
                <div class="audit-description-comment" v-if="taskItem.state == 0 || taskItem.state == 1">{{taskItem.tasks[0].comment.description}}</div>
                <div class="audit-description-data" v-if="taskItem.state == 0 || taskItem.state == 1">
                  <img :src="blopImg.url" alt="" v-for="blopImg in taskItem.tasks[0].comment.attachment" :key="blopImg.ts">
                </div>
              </div>
            </div>
        </div>
					<!-- workflow -->
					<!-- <div class="audit-flow-unit">
						<div class="check"><i class="iconfont el-icon-success"/></div>
						<div class="audit-flow-content">
							<div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
								<div class="audit-name">
									<div class="audit-workflow-name">送出簽核</div>
									<div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
								</div>
								<div class="audit-situation">
									<div class="audit-agree">同意</div>
								</div>
							</div>
							<div class="audit-description">
								<div class="audit-description-comment">這是一個很長很長的故事～</div>
								<div class="audit-description-data">
								</div>
							</div>
						</div>
					</div> -->

					<!-- workflow -->
					<!-- <div class="audit-flow-unit ">
						<div class="check"><i class="iconfont el-icon-time"/></div>
						<div class="audit-flow-content on-audit">
							<div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
								<div class="audit-name">
									<div class="audit-workflow-name">主管簽核</div>
									<div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
								</div>
								<div class="audit-situation">
									<div class="audit-agree">同意</div>
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
					</div> -->

					<!-- workflow -->
					<!-- <div class="audit-flow-unit not-yet">
						<div class="check"><i class="iconfont el-icon-more iconbangzhu"/></div>

						<div class="audit-flow-content">
							<div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
								<div class="audit-name">
									<div class="audit-workflow-name">送出簽核</div>
									<div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
								</div>
								<div class="audit-situation">
									<div class="audit-agree">同意</div>
								</div>
							</div>
							<div class="audit-description">
								<div class="audit-description-comment">這是一個很長很長的故事～</div>
								<div class="audit-description-data">
								</div>
							</div>
						</div>
						<div class="audit-flow-content on-audit">
							<div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
								<div class="audit-name">
									<div class="audit-workflow-name">送出簽核</div>
									<div class="audit-user-name">管理員 Albert <span>(2022/06/29 11:23:39)</span></div>
								</div>
								<div class="audit-situation">
									<div class="audit-agree">同意</div>
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
									<div class="audit-agree">同意</div>
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

		<!-- edit and comment -->
		<div class="page-container report-setting paper" style="height: 100%; width:49.5%">
			<div class="audit-section">
				<!-- audit-header -->
				<div class="audit-header">
					<h3>填寫簽合意見</h3>
					<div class="buttons">
						<delay-button type="filled" @click="taskSummit">送出</delay-button>
					</div>
				</div>
				<!-- audit body -->
				<div class="audit-flow-body">
          <div class="audit-add-comment">
            <!-- 簽合意見 -->
            <p style="margin-bottom: 10px"><span style="color: #c60957">* </span> 簽合意見</p>
            <div class="comment-btn for-flex">
              <div class="el-radio-details" :class="{agree : agree == true}" @click="agreeNode">同意</div>
              <div class="el-radio-details" :class="{reject : agree == false}" @click="rejectNode">駁回</div>
            </div>
            <div class="comment-input">
              <el-input
                v-model="commentsToApi.comment.description"
                :autosize="{ minRows: 3, maxRows: 5 }"
                placeholder="請輸入訊息"
                class="storevue-textarea"
                type="textarea"
                resize="none"
                maxlength="600"
                show-word-limit
              />
            </div>
          </div>

          <!-- 加入檔案 & 簽名 -->
          <div class="audit-add-files">
            <p style="margin-bottom: 10px">加入簽名</p>
            <div class="upload-data" @click="showSignaturePad = true">
              <i class="iconfont el-icon-document-add iconbangzhu"/> 簽名
            </div>
            
            <div class="upload-imgs"></div>
          </div>

          <div class="l--l"></div>

          <div class="audit-add-files">
            <p style="margin-bottom: 10px">加入附件</p>
            <!-- 新增附件 -->
            <div class="attach-area" >
              <div v-for="(imgItem,index) in imgFileList" :key="'img'+index" class="source-details" >
                <div class="img-content">
                  <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                  <el-image
                    :src="imgItem.src"
                    style="width:auto;height:100px"
                    :preview-src-list="getAuditImgList(index)"/>
                </div>
              </div>
              <div v-if="auditFileCount < 10" class="attach-add" @click="$refs.auditfile.click()">
                <input type="file" style="display: none" accept="image/png,image/jpeg,application/pdf" max-size="2" @change="doAddAttachment" ref="auditfile" />
                <div style="height:16px;display: flex;flex-direction: row;align-items: center;">
                  <img src="../../../../static/img/icon_attachment.svg" widht="16px" height="16px" style="border-radius:10px;"/>
                  <div class="att-txt">{{ $t('audit.inceptionRpt.attachment') }}</div>
                </div>
              </div>
            </div>

            <!-- <div class="upload-data">
              <i class="iconfont el-icon-folder-add iconbangzhu"/> 圖片
            </div>
            <div class="upload-imgs">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
            </div> -->
          </div>


				</div>
			</div> 
		</div>


    <!-- popup -->
    <dialog-pop
      title="請簽名"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showSignaturePad"
      @cancelHandler="clearSignature"
      @confirmHandler="signSave"
    >
      <div style="padding: 0 20px; height: 300px">
        <VueSignaturePad 
          id="signature"
          ref="signaturePad" />
      </div>
    </dialog-pop>

  </div>
	</div>

</template>
<script>
import {
    GetTaskInfo,
    taskSummit,
  } from '@/api/workflow';
import { getStorageInfo } from '@/api/event';
import { getCookie } from '@/common/auth';
import DelayButton from '@/components/DelayButton';
import util from '@/common/util';
import { getUserInfo } from '@/api/login';
import DialogPop from '@/components/DialogPop';

// import SettingTable from '@/components/SettingTable';
// import {getNodeList, updateWorkflow} from "@/api/workflow";
import TableOnly from '@/components/TableOnly';

export default {
  name: 'WorkflowDetailHandling',
  components: {
    DelayButton,
    DialogPop
  },
  data() {
    return {
      loading: false,
      isLoadingData: false,
      fullscreenLoading: false,

      auditDetail:'',
      taskInfo:'',
      agree: true,
      description:'',
      pdfFileList:[],
      imgFileList:[],
      signatureFileList:[],
      
      auditFileCount:0,
      oss: null,
      totalnumOfPic: 0,
      uploadingnumOfPic: 0,
      showSignaturePad: false,

      commentsToApi: {
        "taskId": "",
        "comment": {
            "description": "",
            "signature": [
                {
                    "type": 0,
                    "content": ""
                }
            ],
            "attachment": []
        },
        "result": 0
      }
    }
  },
  mounted() {},
  async created() {
    await this.init()
    
  },
  watch:{
    // pdfFileList(){
    //   this.auditFileCount = this.pdfFileList.length+this.imgFileList.length;
    //   console.log('this.auditFileCount :>> ', this.auditFileCount);
    //   console.log('this.pdfFileList :>> ', this.pdfFileList);
    // },
    imgFileList(){
      this.auditFileCount = this.signatureFileList.length+this.imgFileList.length;
      console.log('this.auditFileCount :>> ', this.auditFileCount);
      console.log('this.imgFileList :>> ', this.imgFileList);
    },
    signatureFileList(){
      this.auditFileCount = this.signatureFileList.length+this.imgFileList.length;
      console.log('this.auditFileCount :>> ', this.auditFileCount);
      console.log('this.signatureFileList :>> ', this.signatureFileList);
    },

    
  },
  methods: {

    signSave() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(isEmpty);
      console.log(data);
      // if(isEmpty !== true){
      //   this.signatureFileList.push(data)
      // }
      
    },

    signUndo() {
      this.$refs.signaturePad.undoSignature();
    },

    clearSignature(){
      this.$refs.signaturePad.clearSignature()
      this.showSignaturePad = false
    },



    async init(){
      await this.getWorkflowInfo()
      await this.getTaskInfo(this.auditDetail.inspectReportId)
      await this.getOssInfo();
    },

    getWorkflowInfo(){
      const data = sessionStorage.getItem('auditDetailHandling')
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


    agreeNode(){
      this.agree = true
      this.commentsToApi.result = 0
      console.log('this.commentsToApi :>> ', this.commentsToApi);
    },
    rejectNode(){
      this.agree = false
      this.commentsToApi.result = 1
      console.log('this.commentsToApi :>> ', this.commentsToApi);
    },

    async taskSummit(){
      // this.isLoadingData = true
      const self = this;
      const currentNode = this.taskInfo.filter( i => i.state == 2)
      this.commentsToApi.taskId = currentNode[0].tasks[0].taskId

      console.log('currentNode----->> ', currentNode);
      console.log('taskSummit this.commentsToApi----->> ', this.commentsToApi);


      const storageParams = {};
      await getStorageInfo(storageParams).then(res => {
        if (res.errCode === 0) {
          self.oss = res.data;
        }
      });

      //上傳簽核附件
      var auditAttachment = [];
      if(self.imgFileList.length>0){
        for(let idx=0; idx <self.imgFileList.length; idx++){
          await self.upLoadFile(self.imgFileList[idx]).then((url) => {
            console.log("upload file url:",url);
            self.uploadingnumOfPic++;
            const auditImgObj = {
              mediaType: 2,
              url: url,
              ts: Date.now()
            };
            this.commentsToApi.comment.attachment.push(auditImgObj);
          }).catch((err) => {
            console.log("uploade file error:",err)
            upload++;
          });
        }
      }

      console.log('this.commentsToApi ready to Api -------->> ', this.commentsToApi);
      taskSummit(this.commentsToApi).then(res=>{
        console.log('res :>> ', res);
        this.isLoadingData = false
        this.$router.push({ name: 'WaitAuditManage'});

      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },


    
    getAccountId() {
      const self = this;
      const userId = getCookie('UserId');
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          self.userDataList = res.data;
          res.data.forEach(item => {
            if (item.userId === userId) {
              const accountId = item.accountId.toLowerCase();
              self.accountId = accountId;
              localStorage.setItem('oss_bucket', accountId);
              resolve(accountId);
            }
          });
        });
      });
    },

    async getOssInfo() {
      const self = this;
      const accountId = await self.getAccountId();
      self.accountId = localStorage.getItem('oss_bucket');
    },

    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
      self.bucketPdf = 'pdf' + '/' + util.getCurDate2Str();
    },



    
    doAddAttachment(e){
      const self = this;
      const maxSize = 4*1024*1024; //不能超過4MB
      var files = e.target.files || e.dataTransfer.files;
      //console.log("choose file:",files);
      if (!files.length)
        return;
      if(self.auditFileCount==10){
        util.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
        return;
      }
      if(files[0].type.includes("pdf") && files[0].size > maxSize){
        util.notify(self.$t('audit.inceptionRpt.maxFileSizeAlert'), 'warning', 3000);
        return;
      }
      if(files[0].type.includes("image")){
        var objImg={
          fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_ooo_${files[0].name}`,
          src:'',
          file:'',
          type:files[0].type,
          size:files[0].size
        };
        self.createFile(files[0],objImg);
        self.imgFileList.push(objImg);
      }else if(files[0].type.includes("pdf")){
        var objpdf={
          fileName:`${self.bucketPdf}/inspect_${util.getCurTimeStr()}_ooo_${files[0].name}`,
          src:'',
          file:'',
          type:'pdf',
          size:files[0].size,
        }
        self.createFile(files[0],objpdf);
        self.pdfFileList.push(objpdf);
      }
    },
    createFile(file, objFile) {
      //var image = new Image();
      var reader = new FileReader();

      reader.onload = (e) => {
        objFile.src = e.target.result;
        objFile.file = util.base64ToBlob(e.target.result);
        console.log(objFile.file);
      };
      reader.readAsDataURL(file);
    },
    deleteImg({item, index}) {
      const self = this;
      if(item.type==='pdf')
        self.pdfFileList.splice(index, 1);
      else
        self.imgFileList.splice(index, 1);
    },
    getAuditImgList(index) {
      const arr = [];
      let i = 0;
      for (i; i < this.imgFileList.length; i++) {
        arr.push(this.imgFileList[i + index]);
        if (i + index >= this.imgFileList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.map(source => source.src);
    },

    getImgList(index, sourceList) {
      const arr = [];
      let i = 0;
      for (i; i < sourceList.length; i++) {
        arr.push(sourceList[i + index]);
        if (i + index >= sourceList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.filter(source => source.mediaType === 2).map(source => source.src);
    },
    
    getFileUrl(fileName) {
      const self = this;
      const bucketName = self.oss.ossBucketName;
      const endpoint = self.oss.ossEndPoint;
      const key = fileName;
      if (self.oss.ossVendor === 2) {
        return `https://${endpoint}/${bucketName}/${fileName}`;
      } else {
        return `http://${bucketName}.${endpoint}/${fileName}`;
      }
    },

    upLoadFile(fileItem) {
      const self = this;
      self.percentage = 0;
      if (self.oss.ossVendor === null) {
        self.oss.ossVendor = 1; // 1 -aliyun  2-azure
      }
      if (self.oss.ossVendor === 1) {
        const OSS = require('ali-oss');
        const client = new OSS({
          region: self.oss.ossEndPoint.slice(0, self.oss.ossEndPoint.indexOf('.')),
          accessKeyId: self.oss.ossAccessKeyId,
          accessKeySecret: self.oss.ossAccessKeySecret,
          // bucket: 'viumo-'+self.accountId,
          bucket: self.oss.ossBucketName
        });
        const name = fileItem.fileName;
        return new Promise((resolve, reject) => {
          client.put(name, fileItem.file, {
            progress: function * (percentage, cpt) {
              self.percentage = percentage;
            }
          })
            .then((results) => {
              const url = self.getFileUrl(results.name);
              resolve(url);
            })
            .catch((err) => {
              reject(err);
            });
        });
      } else {
        const url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
        const containerURL = new azblob.ContainerURL(url, azblob.StorageURL.newPipeline(new azblob.AnonymousCredential()));
        const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, fileItem.fileName);
        return new Promise((resolve, reject) => {
          azblob.uploadBrowserDataToBlockBlob(azblob.Aborter.none, fileItem.file, blockBlobURL)
            .then((results) => {
              const url = self.getFileUrl(fileItem.fileName);
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
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
  .l--l
    height: 1px
    background: #ddd
    margin: 30px 0
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
    align-items: flex-start 
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
            .audit-agree
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
                width: 200px
                border-radius: 4px



      // comments
      .audit-add-comment
        .comment-btn
          margin-bottom: 10px
          .el-radio-details
            width: calc(160 / 1920 * 100vw)
            height: calc(40 / 1920 * 100vw)
            margin: 0 calc(16 / 1920 * 100vw) 0 0
            line-height: calc(40 / 1920 * 100vw)
            border: solid 1px #e6e6e6
            cursor: pointer
            border-radius: 5px
            text-align: center
            font-size: 14px
        .comment-input
          margin-bottom: 30px
      .audit-add-files
        margin-left: 10px
        p 
          font-weight: 900
        .upload-data
          height: 100px
          width: 160px
          border-radius: 10px
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          cursor: pointer
          
          font-size: 13px
          color: #006ab7
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2)
          cursor: pointer
          i 
            color: #006ab7
            font-size: 15px
            margin-right: 3px
        .upload-imgs
          img
            margin-top: 10px
            margin-right: 10px
            width: 200px
            border-radius: 4px

  .agree
    background-color: rgb(0, 106, 183)
    color: rgb(255, 255, 255)
    border-color: rgb(0, 106, 183)
  .reject
    color: #fa4600
    background: #ffefeb
    border: 1px solid #fa4600 !important

  .attach-area
    display: flex
    align-content: flex-start
    align-self: flex-start
    .attach-add
      height: 100px
      width: 160px
      border-radius: 10px
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2)
      display: flex
      flex-direction: row
      justify-content: center
      align-items: center
      cursor: pointer
      .att-txt
        font-size: 14px
        color: #006ab7
        margin-left: 3px
    .source-details
      display: inline-block
      margin-right: 15px
      position: relative
      .icondelete
        position: absolute
        font-size: 14px
        right: 5px
        margin-top: 8px
        z-index: 2
        color: #fff
        cursor: pointer
        background-color: rgba(0,0,0, 0.8)
        border-radius: 50%
      
      .img-content
        width: 100%
        height: 100%
        position: relative
      
      .pdf-content
        width: 140px
        height: 30px
        padding: 1px 0px 1px 12px
        border-radius: 5px
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1)
        background-color: #fff
        display: flex
        flex-direction: row
        align-items: center
        justify-content: flex-start
        span
          display: block
          width: 110px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          font-size: 12px



      
  #signature
    width: 500px
    height: 500px
    border: 1px solid #ddd
    border-radius: 5px
    // background-image: linear-gradient(white, white)
    // background-origin: border-box
    // background-clip: content-box, border-box




</style>


