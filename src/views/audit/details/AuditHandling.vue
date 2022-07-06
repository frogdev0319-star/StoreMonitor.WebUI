<template>

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

					<!-- workflow -->
					<div class="audit-flow-unit">
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
					</div>

					<!-- workflow -->
					<div class="audit-flow-unit ">
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
					</div>

					<!-- workflow -->
					<div class="audit-flow-unit not-yet">
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
						
						
					</div>



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
						<delay-button type="filled">送出</delay-button>
					</div>
				</div>

				<!-- audit body -->
				<div class="audit-flow-body">
          <div class="audit-add-comment">
            <!-- 簽合意見 -->
            <p style="margin-bottom: 10px"><span style="color: #c60957">* </span> 簽合意見</p>
            <div class="comment-btn for-flex">
              <div class="el-radio-details" style="background-color: rgb(0, 106, 183); color: rgb(255, 255, 255); border-color: rgb(0, 106, 183);">同意</div>
              <div class="el-radio-details">駁回</div>
            </div>
            <div class="comment-input">
              <el-input
                :autosize="{ minRows: 3, maxRows: 5 }"
                :placeholder="請輸入訊息"
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
            <div class="upload-data">
              <i class="iconfont el-icon-document-add iconbangzhu"/> 簽名
            </div>
            <div class="upload-imgs">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
            </div>
          </div>

          <div class="l--l"></div>

          <div class="audit-add-files">
            <p style="margin-bottom: 10px">加入附件</p>
            <div class="upload-data">
              <i class="iconfont el-icon-folder-add iconbangzhu"/> 圖片
            </div>
            <div class="upload-imgs">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
                <img src="https://advcloudfiles.advantech.com/cms/1b665e42-c92c-4aa9-8544-fe791ee06795/Resources Featured Image for List Page/Resources-Featured-Image-for-List-Page.jpg" alt="">
            </div>
          </div>


				</div>
			</div> 
		</div>

	</div>

</template>
<script>
import DelayButton from '@/components/DelayButton';
// import SettingTable from '@/components/SettingTable';
// import {getNodeList, updateWorkflow} from "@/api/workflow";
import TableOnly from '@/components/TableOnly';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowDetail',
  components: {
    DelayButton
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

<style lang="sass" scoped>
  .not-yet
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

  .on-audit
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
              img
                margin-top: 10px
                margin-right: 10px
                width: 200px
                border-radius: 4px
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
          width: 120px
          height: 100px
          border-radius: 10px
          margin-bottom: 10px
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




</style>


