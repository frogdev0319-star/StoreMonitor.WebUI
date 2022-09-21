<template>
    <div>
		<div class="audit-flow-unit" v-for="(taskItem, index) in taskInfo" :key="index" :class="{ not__yet: taskItem.tasks[0].taskId == null }">
			<div class="check" v-if="taskItem.state == 0"><i class="iconfont el-icon-success iconbangzhu"/></div>
			<div class="check" v-else-if="taskItem.state == 1"><i class="iconfont el-icon-success iconbangzhu"/></div>
			<div class="check" v-else-if="taskItem.state == 2 || taskItem.state == 4 || taskItem.state == 6 || taskItem.state == 8"><i class="iconfont el-icon-time iconbangzhu"/></div>
			<div class="check" v-else-if="taskItem.state == 3 || taskItem.state == 7"><i class="iconfont el-icon-more iconbangzhu need_grey"/></div>
			
			<!-- audit task wrapper -->
			<div class="audit-task-wrapper" :class="{ on_audit : taskItem.state == 2 }" >
				<div class="audit-workflow-name">{{taskItem.nodeName}}</div>
				<div class="audit-flow-content"  v-for=" task in taskItem.tasks" :key="task.taskId">
					<!-- name -->
					<div class="for-flex justify-content_space-between" style="margin-bottom: 10px">
						<div class="audit-name">
							
							<div class="audit-user-name" v-if="taskItem.state == 1 && task.comment.result == 0">{{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.parentId == -1"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 1 && task.comment.result == 1"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 1 && task.comment.result == -999"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 5 && task.comment.result == -1"> {{task.auditByUsers[0].titleName}} -- {{task.auditByUsers[0].userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 5 && task.comment.result == 1 "> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 5 && task.comment.result == 0 "> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>

							<div class="audit-user-name" v-else-if="taskItem.state == 2 && task.comment == null"> {{task.auditByUsers[0].titleName}} -- {{task.auditByUsers[0].userName}} <span>({{taskItem.startTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 2 && task.comment !== null"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{taskItem.startTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 3"> {{taskItem.auditTargetName}}</div>
							
							<div class="audit-user-name" v-else-if="taskItem.state == 6 && task.comment.result == -2"> {{task.auditByUsers[0].titleName}} -- {{task.auditByUsers[0].userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 6 && task.comment.result == 1"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>
							<div class="audit-user-name" v-else-if="taskItem.state == 6 && task.comment.result == 0"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span></div>

							<div class="audit-user-name" v-else-if="taskItem.state == 7 && task.assignee == null"> <span>({{task.endTs}})</span> </div>
							<div class="audit-user-name" v-else-if="taskItem.state == 8 && task.comment.result == 0"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span> </div>
							<div class="audit-user-name" v-else-if="taskItem.state == 8 && task.comment.result == 1"> {{task.assignee.titleName}} -- {{task.assignee.userName}} <span>({{task.endTs}})</span> </div>
							<div class="audit-user-name" v-else-if="taskItem.state == 8 && task.comment.result == -999"> {{task.auditByUsers[0].titleName}} -- {{task.auditByUsers[0].userName}} <span>({{task.endTs}})</span> </div>
						</div>
						<div class="audit-situation"  v-if="taskItem.parentId !== -1 ">
							<div class="audit_agree" v-if="taskItem.state == 1 &&  task.comment.result == 0"><i class="iconfont el-icon-check"/> 同意</div>
							<div class="audit_agree" v-if="task.assignee !== null && taskItem.state == 2 && task.comment.result == 0"><i class="iconfont el-icon-check"/> 同意</div>
							<div class="audit_agree" v-if="taskItem.state == 5 && task.comment.result == 0"><i class="iconfont el-icon-check"/> 同意</div>
							<div class="audit_agree" v-if="taskItem.state == 6 && task.comment.result == 0"><i class="iconfont el-icon-check"/> 同意</div>
							<div class="audit_agree" v-if="taskItem.state == 8 && task.comment.result == 0"><i class="iconfont el-icon-check"/> 同意</div>

							<div class="audit_disagree" v-if="taskItem.state == 5 && task.comment.result == 1"><i class="iconfont el-icon-close"/> 駁回</div>
							<div class="audit_disagree" v-else-if="taskItem.state == 1 && task.comment.result == 1"><i class="iconfont el-icon-close"/> 駁回</div>
							
							<div class="audit_disagree" v-else-if="task.assignee !== null && taskItem.state == 2 && task.comment.result == 1"><i class="iconfont el-icon-close"/> 駁回</div>
							<div class="audit_disagree" v-else-if="taskItem.state == 8 && task.comment.result == 1"><i class="iconfont el-icon-close"/> 駁回</div>
							<div class="audit_cancel" v-else-if="taskItem.state == 6 && task.comment.result == -2"><i class="iconfont el-icon-info"/> 撤回</div>
							<div class="audit_disagree" v-else-if="taskItem.state == 6 && task.comment.result == 1"><i class="iconfont el-icon-close"/> 駁回</div>

							<div class="audit_cancel" v-else-if="taskItem.state == 5 && task.comment.result == -1"><i class="iconfont el-icon-info"/> 取消</div>
							<div class="audit_cancel" v-else-if="taskItem.state == 7 && task.comment.result == -3"><i class="iconfont el-icon-info"/> 系統撤回</div>
						</div>
					</div>
					<!-- description -->
					<div class="audit-description">
						<div class="audit-description-comment" v-if="task.comment !== null " >{{task.comment.description}}</div>
						<div class="audit-description-data" v-if="task.comment !== null ">

							<!-- <img :src="blopSign.content" alt="" v-for="blopSign in task.comment.signature" :key="blopSign.ts" 
							style="background: #FFF;" 
							:preview-src-list = "getImgSrcSign(index, blopSign)"
							> -->
							<div class="iimg" v-for="(blopSign, index) in task.comment.signature" :key="blopSign.ts">
								<el-image
									style="background: #FFF;" 
									:src="blopSign.content"
									v-if="blopSign.type == 1"
									:preview-src-list = "getImgSrcSign(index, blopSign)"
									/>
							</div>
							
							<div class="iimg" v-for="(blopImg, index) in task.comment.attachment" :key="blopImg.ts">
								<el-image
									:src="blopImg.url"
									v-if="blopImg.mediaType == 2"
									:preview-src-list = "getImgSrc(index, blopImg)"
									/>
								<a class="pdfLink" :href="blopImg.url" v-if="blopImg.mediaType == 4">
																	<p class="pdf_name" v-if="blopImg.mediaType == 4">{{blopImg.fileName}}</p>

								</a>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
export default {
	name: 'AuditUnit',

	props: {
		taskInfo: {
			type: Array,
			required: true
		},
		auditStates:{
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			imgListAry: [],
			urlList: [],
			urlSign: []
		};
	},
	mounted() {},
	methods: {
		getImgSrcSign(index, blopSign){
			console.log('blopSign :>> ', blopSign);
			var signArr = []
			signArr.push(blopSign.content)
			return this.urlSign = signArr

		},
		getImgSrc(index, blopImg){
			var arr = []
			arr.push(blopImg.url)
		
			// if(this.taskInfo[index].tasks.length > 1){
			// 	this.taskInfo[index].tasks.forEach( t => {
			// 		var rulResult = t.comment.attachment.map( i => i = i.url )
			// 		arr.push(rulResult[0])
			// 	});
			// }
			// else 
			
			// if(this.taskInfo[index].tasks.length === 1){
				
			// 	var rulResult = this.taskInfo[1].tasks[0].comment.attachment.map( i => i = i.url )
			// 	arr = rulResult

			// 	// this.taskInfo[index].tasks.forEach( t => {
			// 	// 	if(this.taskInfo[index].parentId !== -1 && t.comment !== null){
			// 	// 		var rulResult = t.comment.attachment.map( i => i = i.url )
			// 	// 		arr = rulResult
			// 	// 	}
			// 	// });
			// } 
			// console.log('arr :>> ', arr);
			return this.urlList = arr
		},
	}
};
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
		padding-top: 10px !important

	.for-flex
		display: flex
		flex-direction: row
		justify-content: flex-start 
		align-items: flex-end
	.justify-content_space-between
		justify-content: space-between

	.audit-flow-unit
		color: #556679
		border-left: 2px dotted #ddd
		margin-left: 20px
		padding: 0px 10px 30px 30px
		position: relative
		&:nth-child(1)
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
				margin-bottom: 30px
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
						margin-top: -10px
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
						margin-top: -10px
					.audit_cancel
						width: 120px
						height: 27px
						border-radius: 3px
						color: #ffffff
						background: #ff3300
						font-size: 14px
						display: flex
						flex-direction: row
						justify-content: center
						align-items: center
						margin-top: -10px
				.audit-description
					background: #f7f9fa
					padding: 20px
					.audit-description-comment
						font-size: 14px
						word-wrap: break-word

					.audit-description-data
						display: flex
						flex-wrap: wrap
						flex-direction: row
						justify-content: flex-start
						align-items: flex-start
						.iimg
							.el-image
								height: 120px
								margin-top: 10px
								margin-right: 10px
								border-radius: 4px
								img
									width: auto
									height: 120px
									border-radius: 4px
									cursor: pointer !important
						
						img
							margin-top: 10px
							margin-right: 10px
							border-radius: 4px
							width: auto
							height: 120px
							border-radius: 4px
							cursor: pointer !important
						.pdfLink
							display: block
							margin-top: 10px
							margin-right: 10px
							width: 80px
							height: 120px
							text-decoration: none
							background: #190
							border-radius: 4px
							display: flex
							flex-direction: row
							justify-content: center
							align-items: flex-end
							background: url("~@/../static/img/PDF_file_icon.svg") top
							background-size: contain
							background-repeat: no-repeat
							.pdf_name
								text-align: center
								font-size: 12px
								overflow: hidden
								text-overflow: ellipsis
								white-space: nowrap
								width: 80px
								text-decoration: none
								color: #888

</style>
<style lang="sass">
.el-image-viewer__img
	background: #FFF
	max-width: 600px !important
	

</style>
