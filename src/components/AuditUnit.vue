<template>
    <div>
			
			<div class="audit-flow-unit" v-for="(taskItem, index) in taskInfo" :key="index" :class="{ not__yet: taskItem.tasks[0].taskId == null }">
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
									<div class="audit_disagree" v-else-if="task.comment.result == -2"><i class="iconfont el-icon-info"/> 撤回</div>
								</div>
							</div>
							<!-- description -->
							<div class="audit-description">
								<div class="audit-description-comment" v-if="task.comment !== null " >{{task.comment.description}}</div>
								<div class="audit-description-data" v-if="task.comment !== null ">
									<img :src="blopSign.content" alt="" v-for="blopSign in task.comment.signature" :key="blopSign.ts" style="background: #FFF" >

									<div class="iimg"  v-for="blopImg in task.comment.attachment" :key="blopImg.ts">
										<img :src="blopImg.url" alt="" v-if="blopImg.mediaType == 2">
										<a class="pdfLink" :href="blopImg.url" v-if="blopImg.mediaType == 4"></a>
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
	
	},

	data() {
		return {
		
		};
	},

  methods: {
    
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
						flex-wrap: wrap
						flex-direction: row
						justify-content: flex-start
						align-items: flex-start
						img
							margin-top: 10px
							margin-right: 10px
							width: auto
							height: 120px
							border-radius: 4px
						.pdfLink
							display: block
							margin-top: 10px
							margin-right: 10px
							width: 80px
							height: 120px
							background: #190
							border-radius: 4px
							display: flex
							flex-direction: row
							justify-content: center
							align-items: center
							background: url("~@/../static/img/PDF_file_icon.svg") center
							background-size: contain
							background-repeat: no-repeat
							
</style>
