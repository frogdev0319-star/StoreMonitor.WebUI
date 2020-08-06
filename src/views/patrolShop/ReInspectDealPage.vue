<template>
    <div class="el-sucPage-content">
        <div class="page-icon">
            <div class="icon-content">
                <img class='suc-icon' :src='isSuccess?sucSrc:errSrc'/>
                <p :class="isSuccess?'sucInfo':'errInfo'">{{retInfo}}</p>
                <p class="sucret-info" v-if="isSuccess && lang != 'en'">{{curSecond}}s{{generatePatrolLang('return')}}</p>
                <p class="sucret-info" v-if="isSuccess && lang == 'en'">{{generatePatrolLang('return')}} {{curSecond}}s !</p>
            </div>
        </div>
        <div class="page-content" v-if="false" :style="{'min-height':varyWindowHeight-460+'px'}">
             <div class="details">
                <span class="event-label">门店名称：</span>
                <span>{{storeName}}</span>
            </div>
            <div class="table-content" v-if="tableData.length!=0">
                <div class="table-header">
                    <div class="table-details" v-for="(item,index) in headerList" :key="index" :style="{'width':item.width+'%'}">
                        <span>{{item.label}}</span>
                    </div>
                </div>
                <div class="data-rows" v-for="(item,index) in tableData" :key="index" :style="index%2!=0?{'background-color':'#F4F5F9'}:{'background-color':'#fff'}">
                    <div class="item-cols" style="width:20%;">
                        <span>{{item.groupName}}</span>
                    </div>
                    <div class="item-cols" style="width:20%;">
                        <span class="icon-span" :style="item.result==0?{'background-color':'#FDBA40'}:{'background-color':'#6097F3'}">{{item.result==0?'不合格':'合格'}}</span>
                    </div>
                    <div class="item-cols" style="width:20%;">
                        <span>{{item.score}}</span>
                    </div>
                    <div class="item-cols" style="">
                        <span>{{item.totalScore}}</span>
                    </div>
                </div>
            </div>
            <div class="details">
                <span class="event-label">本次忽略{{ignoreCount}}个问题</span>
                <div class="ignore-content">
                    <div class="ignore-details" v-for="(item,index) in ignoreList" :key="index">
                        <div class="icon-point"></div>
                        <span class="ignore-info">{{item.subject}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-err-btn" v-if="!isSuccess">
            <el-button size="mini" type="primary" @click="reTry" class="retry-btn">{{curSecond}}s{{generatePatrolLang('tryAgain')}}</el-button>
        </div>
    </div>
</template>
<script>
  import {generatePatrolLang} from '@/api/i18n'

  export default {
    name:'ReInspectDealPage',
    data(){
        return{
            isSuccess:false,
            sucSrc:require('../../../static/img/succeed_icon.png'),
            errSrc:require('../../../static/img/failed_icon.png'),
            curSecond:10,
            leader:'',
            storeName:'',
            ignoreCount:0,
            headerList:[
                {
                    'name':'groupName',
                    'label':'项目',
                    'width':20
                },
                {
                    'name':'result',
                    'label':'是否合格',
                    'width':20
                },
                {
                    'name':'score',
                    'label':'得分',
                    'width':20
                },
                {
                    'name':'totalScore',
                    'label':'单项总分值',
                    'width':40
                }
            ],
            tableData:[],
            ignoreList:[],
            timeid:0,
            inspectItemList:[],
            varyWindowHeight:window.innerHeight,
            lang: this.$i18n.locale
        }
    },
    computed:{
        retInfo(){
            let msg='';
            if(this.isSuccess){
                if(this.leader!=undefined&&this.leader.length!=0){
                    msg=`${this.$t('remotePatrol.copyFail')}${this.leader}！`;
                }
            }
            else{
                msg= `${this.$t('remotePatrol.sentFail')}`;
            }
            return msg;
        }
    },
    beforeRouteLeave(to, from, next) {
        let self=this;
        clearInterval(self.timeid);
        if(to.name=='remotePatrol'){
            if(this.isSuccess==true){
                to.meta.keepAlive = false;
            }
            else{
                to.meta.keepAlive=true;
            }
        }
        next();
    },
    mounted(){
        let self=this;
        self.getRouterData();
        if(self.isSuccess){
            self.timeid=setInterval(function(){
                self.getBackSecond();
            },1000)
        }
    },
    methods:{
        generatePatrolLang,
        getRouterData(){
            let self=this;
            let routeData=self.$route.params.data;
            console.log(routeData);
            if(self.$route.params.data==undefined){
                routeData=JSON.parse(sessionStorage.getItem('reinspect_submit'));
            }
            if(routeData!=null){
                self.isSuccess=routeData.isSuccess;
            }
            if(self.isSuccess){
                //self.$route.matched[2].name='提交成功';
                self.$route.matched[2].name= self.$t('storeView.successSubmit');
                //self.storeName=routeData.store.storeName;
                if(routeData!=null&&routeData.user.length!=0){
                    self.leader=routeData.user[0].userName;
                }
                //self.tableData=routeData.submitResult;
                //self.ignoreList=routeData.ignoreTemp;
                //self.ignoreCount=routeData.ignoredItems.length;
            }
            else{
                //self.$route.matched[2].name='提交失败';
                self.$route.matched[2].name=self.$t('storeView.failSubmit');
                if(self.isSuccess==false){
                    PubSub.publish('success-page',{changeStyle:true});
                }
            }
        },
        getBackSecond(){
            let self=this;
            self.curSecond--;
            if(self.curSecond==0){
                clearInterval(self.timeid);
                self.$router.push({name:'remotePatrol',params:{from:'submitEvent'}});
            }
        },
        reTry(){
            let self=this;
            self.$router.push({name:"confirmSum"});
        },
    }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/pagination.css';
  $border:#e3e9f4;
  .el-sucPage-content{
    width: 100%;
    height: 100%;
    padding-top: 50px;
    border: 1px solid $border;
    background-color: #fff;
    .page-icon{
        margin-bottom: 40px;
        position: relative;
        .icon-content{
            margin:0 auto;
            .suc-icon{
                height: 80px;
            }
            .sucInfo{
                font-size: 14px;
                color: #6097F3;
            }
            .errInfo{
                font-size: 14px;
                color: #ddd;
            }
            .sucret-info{
                font-size: 12px;
                color: #FB4C5D;
            }
        }
    }
    .page-content{
        margin: 20px;
        background-color: #fafafb;
        width: auto;
        //min-height: 300px;
        height: auto;
        padding: 20px;
        border: 0.5px solid #e3e9f4;
        .details{
            text-align: left;
            margin-top: 10px;
            margin-left: 20px;
            color: #424151;
            font-size: 14px;
            .event-label{
                font-weight: bold;
            }
            .ignore-content{
                margin-top: 15px;
            }
            .ignore-details{
                width: 100%;
                height: 32px;
                line-height: 32px;
                .icon-point{
                    width: 14px;
                    height: 14px;
                    border-radius: 7px;
                    background-color: #DBDBE5;
                    display: inline-block;
                    margin-right: 15px;
                }
                .ignore-info{
                    color: #94a4b4;
                }
            }
        }
        .table-content{
            margin: 20px;
            height: auto;
            border: 1px solid #e3e9f4;
            background-color: #fff;
            .table-header{
                width: 100%;
                height: 39px;
                background-color: #F4F5F9;
                line-height: 32px;
                .table-details{
                    text-align: left;
                    display: inline-block;
                    span{
                        font-size: 12px;
                        margin-left: 30px;
                        color: #94a4b4;
                    }

                }
            }
            .data-rows{
                width: 100%;
                height: 39px;
                line-height: 36px;
                text-align: left;
                .item-cols{
                    height: 39px;
                    float: left;
                    display: block;
                    line-height: 39px;
                    font-size: 12px;
                    font-weight: bold;
                    border-right: 1px solid #e3e9f4;
                    span{
                        margin-left: 20px;
                    }
                    &:last-child{
                        border-width: 0;
                    }
                    &:first-child{
                        span{
                            margin-left: 30px;
                        }
                    }
                    .icon-span{
                        display:inline-block;
                        width: 50px;
                        height:20px;
                        line-height: 20px;
                        color:white;
                        padding-left:5px;
                        padding-right:5px;
                        font-size: 12px;
                        text-align: center;
                        font-weight: normal;
                    }
                }
                &:last-child{
                    border-bottom: 1px solid #e3e9f4;
                    margin-bottom: 20px;
                }
            }
        }
    }
    .page-err-btn{
      margin-bottom: 50px;
      .retry-btn{
        margin-top: 30px;
      }
    }
}
</style>

