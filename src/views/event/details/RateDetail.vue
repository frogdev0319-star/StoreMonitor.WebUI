<template>
    <div class="el-rate-container">
       <div v-for="(item,index) in commentList" :key="index">
            <div class="circle-content" :style="item.showContent?{'background-color':'#FEC0C7'}:{'background-color':'#FB505F'}">
                <div class="circle"></div>
            </div>
           <div class="lside">
               <span v-if="item.showLabel" :class="item.spanStyle">{{item.process}}</span>
           </div>
           <div class="rside">
               <span>{{item.createOr}}</span>
               <div class="speech-content">
                    <div class="speech-info">
                        <i class="el-icon-phone-outline icon-speech"></i>
                    </div>
                    <span class="often-text">{{item.audio.audioOften}}</span>
                </div>
                <div class="source-content">
                    <div class=""
                </div>
           </div>
       </div>
    </div>
</template>
<script>
export default {
    name:'RateDetail',
    props:{
        commentList:Object
    },
    data(){
        return{

        }
    },
    methods:{
        getTheState(){
            let self=this;
            let idarr=[];
            idarr.push(self.eventInfo.id);
            let params={"id":idarr};
            self.state=self.eventInfo.status;
            api.getState(params).then((res)=>{
                console.log(res);
                if(res.errCode=="0"){
                    let comment=res.data[0].comment;
                    let temp=[];
                    comment.forEach((item,index)=>{
                        let obj={};
                        obj.state=item.status;
                        switch(item.status){
                            case 0: 
                                obj.stateTitle="已处理";
                                obj.iconClass="icon-jinggao1";
                                obj.fontColor={'color':'#ff5f5f'};
                            break;
                            case 1: 
                                obj.stateTitle="已结案";
                                obj.iconClass="icon-chulizhong";
                                obj.fontColor={'color':'orange'};
                            break;
                            case 2: 
                                obj.stateTitle="评论追加";
                                obj.iconClass="icon-zhengque";
                                obj.fontColor={'color':'#46E299'};
                            break;
                        }
                        obj.date=new Date(item.ts).getFullYear()+"/"+(new Date(item.ts).getMonth()+1)+"/"+new Date(item.ts).getDate();
                        obj.time=new Date(item.ts).getHours()+":"+new Date(item.ts).getMinutes();
                        obj.description=item.description;
                        if(index==comment.length-1){
                            obj.showContent=true;
                        }
                        else{
                            obj.showContent=false;
                        }
                        temp.push(obj);
                    })
                    self.eventDetail=temp.reverse();
                    self.eventInfo.status=self.eventDetail.map(x=>x.state)[0];
                }
            })
            .catch(err=>{
                console.log("Error:"+err);
            });
           
        },
        checkAgent(){
            let self=this;
            let agentId=this.eventInfo.agentId;
            this.$router.push({name:"设备详情",params:{device:agentId,flag:'eventPage'}});
        },
        addStates(){
            sessionStorage.setItem('event',JSON.stringify(this.eventInfo));
            this.$router.push({name:"详情初始",params:{event:this.eventInfo }});
            this.$route.matched[1].name=this.eventInfo.eventType;
        },
         showMoreInfo(){
            this.showMoreDes=!this.showMoreDes;
        },
        ...mapActions(['changeBread'])
    },
    mounted(){
        this.eventInfo=JSON.parse(sessionStorage.getItem('event'));
        if(this.eventInfo.description.length>=50){
            let deStr=this.eventInfo.description;
            this.showDes=true;
            this.showPart=deStr.substring(0,deStr.indexOf(';')+1);
            this.hidePart=deStr.substring(deStr.indexOf(';')+1,deStr.length);
        }
        else{
            this.showDes=false;
        }
        this.getTheState();
        this.eventType=this.eventInfo.eventTypeId;
        this.$route.matched[1].name=this.eventInfo.eventType; 
    },
    created(){

    },
    update(){ 
        this.$route.matched[1].name=this.eventInfo.eventType;
    }, 
    beforeDestroy(){
        this.$route.matched[1].name=this.eventInfo.eventInfo;
    } 
}
</script>
<style lang="scss" scoped>
    $normal-color: #46E299;
    $error-color: #ff5f5f;
    $abnormal-color:orange;
    .el-rate-container{
        width: 97.46%;
        margin:15px;
        position: relative;
        background-color: #fff;
        .el-rate-header{
            height: auto;
            margin:15px;
            
            background-color: #fff;
            color: #4b5262;
            .event-icon{
                margin-top: 20px;
                margin-left: 15px;
                float: left;
            }
            .event-info-content{
                width: auto;
                height:auto;
                 float: left;
                margin-top: 30px;
                margin-left: 30px;
                .event-type{
                    // float: left;
                    font-size: 22px;
                    margin-right: 15px;
                    color: #4b5262;
                }
                .view-detail{
                    text-decoration: underline;
                    color: #45ACF7;
                    margin-left: 8px;
                    &:hover{
                        cursor: pointer;
                    }
                }
                .device-content{
                    margin-top: 10px;
                    color: #7b8da0;
                    font-size: 13px;
                    .device-name{
                        width: 220px;
                    }
                    .device-type{
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                }
                .event-desr{
                    position: relative;
                    bottom: 10px;
                    color: #7b8da0;
                    font-size: 13px;
                }
                
            }
            .header-hr{
                width: 96.8%;
                position: relative;
                top: 10px;
                margin-left: 17px;
                border:0.5px solid #ddd;
            }
            .add-state-btn{
                float:right;
                margin-right: 40px;
                margin-top: 40px;
            }
        }
        .el-rate-content{
            width: 97.46%;
            margin: 15px;
            height: 76%;
            background-color: #fff;
            .rate-content{
                width: 96.8%;
                margin:0 20px;
                border:1px solid #ddd;
                
                .rate-header{
                    height: 30px;
                    background-color: #F3F7F8;
                    border-bottom: 1px solid #ddd;
                    span{
                        margin-left: 15px;
                        line-height: 30px;
                    }
                }
                .rate-footer{
                    width: 100%;
                    height: auto;
                    padding-bottom: 15px;
                }
            }
            
        }
    }
</style>

