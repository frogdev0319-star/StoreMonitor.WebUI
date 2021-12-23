<template>
    <div class="content">
        <div class="head">{{$t('statistics.event.eventCommand')}}</div>
        <div class="comment-list" v-for="(item,index) in CommentList" :key="index">
            <div class="comment">
                <div class="account">
                    <div>
                        <span>{{item.title+' '}}</span>
                        <span>{{item.name+' '}}</span>
                        <span>{{'('+item.date+')'}}</span>
                    </div>
                    <div class="tag">{{item.sourceType}}</div>
                </div>
                <div v-for="(att,index) in item.attachment" :key="index" style="margin-top:10px;">
                    <div class="att-content" v-if="att.mediaType==3">
                        <span>{{att.url}}</span>
                    </div>
                    <div v-else-if="att.mediaType==0 && att.showAudio" class="att-content">
                        <audio-vue
                            v-if="att.showAudio"
                            :is-export-pdf="isexportPDF"
                            :audio-list = "att.audioList"
                        />
                    </div>
                    <div v-else-if="att.mediaType==1" class="att-content">
                        <video controls>
                            <source :src="att.url" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
            <div class="attachment" > 
                <div  v-for="(att,index) in item.attachment" :key="index">
                    <img v-if="att.mediaType==2" class="att-img" :src="att.url" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {GetEventAndCommentList} from '@/api/event';
import TablePagination from '@/components/TablePagination';
import util from '@/common/util';
import AudioVue from '@/components/AudioVue';
export default {
    name:'IncepItemTop5',
    components: {
        'table-pagination':TablePagination,
        AudioVue
    },
    props:{
        storeId:{
            type: String,
            required: true
        },
        beginTs:{
            type: Number,
            required:true
        },
        endTs:{
            type:Number,
            required: true
        },
        itemId:{
            type:Number,
            require:true
        }
    },
    data(){
        return{
            clause:{storeId:this.storeId,itemId:this.itemId},
            CommentList:[],
            isexportPDF:false
        };
    },
    created(){
        this.getCommentList();
    },
    methods:{
        doGetEventAndCommentList(params) { 
            return new Promise((resolve, reject) => {
                GetEventAndCommentList(params).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        async getCommentList(){
            let params={beginTs:this.beginTs,endTs:this.endTs,clause:this.clause};
            const result = await this.doGetEventAndCommentList(params);
            //console.log("result:",result);
            const commentData = result.data.content;
            //console.log("eventData:",this.eventData);
            this.CommentList = [];
            commentData.forEach((detail)=>{
                var source = this.doMapSourceType(detail.sourceType);
                detail.comment.forEach(item=>{
                    let obj = {};
                    obj.title = item.accountTitle;
                    obj.name = item.accountName;
                    obj.date = this.$moment(item.ts).format("YYYY/MM/DD");
                    obj.sourceType = source 
                    let attachment = [];
                    let audioList = [];
                    item.attachment.forEach(att=>{
                        let attObj = {...att}
                        if(att.mediaType==0){
                            let audio = {}
                            audio .audioSrc = att.url;
                            audio .audioRef = 'audioRef' + detail.id + att.ts;
                            audio .isPlaying = false;
                            audio .audioOftenText = '';
                            audio .hasNotPlayAudio = true;
                            audioList.push(audio);
                            attObj.showAudio = true;
                            attObj.audioList = audioList;
                        }else{
                            attObj.showAudio = false;
                        }
                        attachment.push(attObj);
                    });
                    console.log("attachment:",attachment);
                    obj.attachment=attachment;
                    this.CommentList.push(obj);
                });
            });
            util.sortArrayByKeyDesc(eventItem,"num");
        },
        doMapSourceType(type){
            if(type==0){
                return this.$t('overview.storeMonitor');
            }else if(type==1){
                return this.$t('overview.remotePatrol');
            }else if(type==2){
                return this.$t('overview.onsitePatrol');
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.content{
    background-color: #edf0f2;
    margin-right: 16px;
    .head{
        width: calc(125/1440*100vw);
        height: 28px;
        font-family: NotoSansCJKTC;
        font-size: 13px;
        font-weight: bold;
        text-align: left;
        color: #556679;
    }
    .comment-list{
        border-top: solid 1px #dadada;
        height: auto;
        width: calc(968/1440*100vw);
        display: flex;
        flex-direction: row;
        .comment{
            width: calc(400/1440*100vw);
            margin-top: 16px;
            .account{
                width: calc(400/1440*100vw);
                height: 30px;
                display: flex;
                flex-direction: row;
                font-family: Roboto;
                font-size: 13px;
                font-weight: bold;
                color: #556679;
                align-items: center;
                .tag{
                    height: 30px;
                    border-radius: 5px;
                    background-color:#f7f9fa;
                    padding: 5px 11px 7px;
                    margin-left: 8px;
                }
            }
            .att-content{
                width: calc(400/1440*100vw);
                font-family: NotoSansCJKtc;
                font-size: 15px;
                color:#484848;
                word-break:keep-all;
            }
        }
        .attachment{
            margin-top: 16px;
            width: calc(568/1440*100vw);
            display: flex;
            flex-direction: row;
            margin-top: 21px;
            align-items: flex-start;
            .att-img{
                width: 132px;
                height: 91px;
                border-radius: 5px;
                margin-right: 7px;
            }
        }
    }
}
    
</style>
