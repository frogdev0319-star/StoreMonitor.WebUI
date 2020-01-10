<template>
    <el-row class="sum-content">
        <el-col :span="24" class="sum-submit">
            <div class="submit-header">
                <span>{{generatePatrolLang('summary')}}</span>
                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="sum-btn" type="primary" @click="submit" v-if="inspectList.length!=0">{{generatePatrolLang('submit')}}</el-button>
            </div>
            <div class="submit-content">
                <div class="submit-radio">
                    <span class="el-radio-details" v-for="(item,index) in radioList" :key="index"
                          @click="clickSum(item,index)" :class="item.isActive?'activeClass':''">{{item.name}}</span>
                </div>
                <span class="sug-label"><span>*</span>{{generatePatrolLang('advice')}}</span>
                <el-input type="textarea" resize='none' :autosize="{ minRows: 2, maxRows: 7}" v-model="suggest" class="sug-input"  @input="adviceChanged"
                          :placeholder="generatePatrolLang('adviceInfo')"></el-input>
            </div>
        </el-col>
        <el-col :span="24" class="sum-data">
            <el-row class="divider-content">
                <el-col :span="11">
                    <hr class="divider-hr"/>
                </el-col>
                <el-col :span="2">
                    <span class="divider-text">{{generatePatrolLang('preview')}}</span>
                </el-col>
                 <el-col :span="11">
                     <hr class="divider-hr"/>
                </el-col>
            </el-row>
            <div class="table-content">
                <div class="table-header">
                    <span>
                      <span v-if="lang=='en' "class="en-store-name">{{generatePatrolLang('storeName')}}: </span>
                      <span v-else class="store-name">{{generatePatrolLang('storeName')}}：</span>
                      {{store.storeName}}
                    </span>
                </div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" v-for="(item ,index) in theaderList" :key="index">{{item.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in summary" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                            <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{item.groupName}}</span><span class="count-blag">{{item.count}}</span></td>
                            <td class="icon-td"><div class="icon-blag" :style="item.isQua?{'background-color':'#6097F3'}:{'background-color':'#FDBA40'}">{{item.isQua? pass : fail }}</div></td>
                            <td><span>{{item.numOfExcellentItems}}</span></td>
                            <td><span>{{item.numOfQualifiedItems}}</span></td>
                            <td><span>{{item.numOfUnqualifiedItems}}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <el-row class="row-footer">
                <el-col :span="12" v-for="(item,index) in tempList" :key="index" class="details-content">
                    <div class="details">
                        <div class="item-header">
                            <i class="iconfont icontemp" :class="item.iconSrc"></i>
                            <span class="title-lable">{{item.itemTitleName}}</span>
                            <div class="count-content">
                                <span class="count">{{item.itemCount}}</span>
                                <span class="blag">{{generatePatrolLang('unit')}}</span>
                            </div>
                        </div>
                        <div class="item-content">
                            <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                                <div class="item-details" v-for="_item in item.itemList" :key="_item.id">
                                    <div class="item-blag"></div>
                                    <span class="item-name">{{index!=2?_item.name:_item.subject}}</span>
                                    <!--<span class="item-des">{{_item.description}}</span>-->
                                    <span class="item-des"></span>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>
import {getStorageInfo} from '@/api/event'
import {submitInspectItem1} from '@/api/inspect'
import util from '@/common/util'
import {getCookie} from '@/common/auth'
import {getUserInfo} from '@/api/login'
import {generatePatrolLang} from '@/api/i18n'
import filterString from '@/common/filterString.js'

export default {
    name:'ConfirmAddSum',
    data(){
        return{
            radioList:[],
            resultList: [
              {
                'label': 3,
                'name':this.$t('remotePatrol.good'),
                'isActive':false
              },
              {
                'label': 2,
                'name':this.$t('remotePatrol.pass'),
                'isActive':false
              },
              {
                'label': 1,
                'name':this.$t('remotePatrol.improve'),
                'isActive':false
              },
              {
                'label': 0,
                'name':this.$t('remotePatrol.dangerous'),
                'isActive':false
              },
            ],
            theaderList:[
                {
                    name: this.$t('remotePatrol.item'),
                },
                {
                   name: this.$t('remotePatrol.groupPerfor')
                },
                {
                    name: this.$t('remotePatrol.good')
                },
                {
                   name: this.$t('remotePatrol.pass')
                },
                {
                   name: this.$t('remotePatrol.failed')
                }
            ],
            suggest:'',
            store:{},
            channel:{},
            summary:[],
            tempList:[],
            inspectList:[],
            eventList:[],
            oss:null,
            bucketVideo:'',
            bucketImage:'',
            percentage:0,
            accountId:'',
            curSumIndex:0,
            varyWindowWidth:window.innerWidth,
            pass: this.$t('remotePatrol.pass'),
            fail: this.$t('remotePatrol.failed'),
            lang: this.$i18n.locale
        }
    },
    methods:{
        generatePatrolLang,
        getFileUrl(fileName){
            let self=this;
            let bucketName = self.oss.ossBucketName;
            let endpoint=self.oss.ossEndPoint;
            let key=fileName;
            let url=`http://${bucketName}.${endpoint}/${fileName}`;
            return url;
        },
        upLoadFile(fileItem){
            let self=this;
            self.percentage=0;
            let OSS = require('ali-oss');
            const client = new OSS({
                region: self.oss.ossEndPoint.slice(0,self.oss.ossEndPoint.indexOf('.')),
                accessKeyId: self.oss.ossAccessKeyId,//填入自己的id
                accessKeySecret: self.oss.ossAccessKeySecret,//填入自己的id
                //bucket: 'viumo-'+self.accountId,
                bucket: self.oss.ossBucketName
            })
            let name=fileItem.fileName;
            return new Promise((resolve,reject)=>{
                client.put(name,fileItem.file,{
                progress: function* (percentage, cpt) {
                   self.percentage = percentage
                    }
                })
                .then((results) => {
                    // 上传完成
                    const url = self.getFileUrl(results.name);
                    console.log(url);
                    resolve(url);
                })
                .catch((err) => {
                    console.log(err)
                })
            })
        },
        clickSum(item,index){
            let self=this;
            item.isActive=true;
            self.radioList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isActive=false;
                }
            })
            self.curSumIndex=item.label;
        },
        async submit(){
            let self=this;
            let inspectList=self.inspectList;
            let eventList=self.eventList;
            let status=0;
            let flag=false;
            self.radioList.forEach(item=>{
                if(item.isActive){
                    flag=true;
                }
            })
            if(!flag){
                self.notify(self.$t('remotePatrol.summaryInfo'),'warning',3000);
                return false;
            }
            if(self.suggest.length == 0){
              self.notify(self.$t('remotePatrol.suggestEmpty'),'warning',3000);
              return false;
            }
            let storageParams = {};
            storageParams.storeId = self.store.storeId;
            //上传文件时获取门店对应的BucketName
            await getStorageInfo(storageParams).then(res=>{
              if(res.errCode==0){
                self.oss = res.data;
                console.log(self.oss)
              }
            })
            let temp=[];
            for(let i in inspectList){
                for(let  j in inspectList[i].items){
                    let objItem={};
                    objItem.ts=new Date().getTime();
                    objItem.description=inspectList[i].items[j].inspectInput.trim();
                    objItem.grade=inspectList[i].items[j].isIgnore?-1:inspectList[i].items[j].itemScore;
                    objItem.storeId=self.store.storeId;
                    objItem.inspectItemId=inspectList[i].items[j].id;
                    let tempFileUrl=[];
                    if(!inspectList[i].items[j].isIgnore){
                        for(let k in inspectList[i].items[j].sourceList){
                            let obj={};
                            if(inspectList[i].items[j].sourceList[k].mediaType==2){
                                let url=await self.upLoadFile(inspectList[i].items[j].sourceList[k]);
                                obj.mediaType=2;
                                obj.url=url;
                            }
                            else if(inspectList[i].items[j].sourceList[k].mediaType==1){
                                let url=await self.upLoadFile(inspectList[i].items[j].sourceList[k]);
                                obj.mediaType=1;
                                obj.url=url;
                            }
                            tempFileUrl.push(obj);
                        }
                    }
                    objItem.attachment=tempFileUrl;
                    temp.push(objItem);
                }
            }
            let feedEventList=[];
            console.log(self.eventList);

            for(let i in self.eventList){
                let obj={};
                obj.ts=new Date().getTime();
                obj.storeId=self.store.storeId,

                obj.subject=self.eventList[i].eventName;
                obj.description=self.eventList[i].eventDes;

                let commentTemp=[];
                if(self.eventList[i].sourceObj!=null){ //通过通道创建的反馈问题
                    let url=await self.upLoadFile(self.eventList[i].sourceObj);
                    let commentObj={
                        mediaType:self.eventList[i].sourceObj.mediaType,
                        url:url
                    }
                    commentTemp.push(commentObj);
                    obj.deviceId=self.channel.id;
                }
                else{                        //通过加号创建的问题反馈
                    obj.diviceId=-1;
                }
                obj.attachment=commentTemp;
                feedEventList.push(obj);
            }

            // switch(self.curSumIndex){
            //     case 0: status=2; break;
            //     case 1: status=1; break;
            //     case 2: status=0; break;
            // }
            status = self.curSumIndex;
            let params={
                status:status,
                comment:self.suggest.trim(),
                items:temp,
                feedback:feedEventList
            };
            let routeData=null;
            submitInspectItem1(params).then(res=>{
                if(res.errCode==0){
                    let data=res.data;
                    self.editFlag=true;
                    routeData={
                        isSuccess:true,
                        user:data.notifiedTo
                    };
                }
                else{
                    routeData={
                        isSuccess:false
                    };
                }
                self.$router.push({name:"submitEvent",params:{data:routeData}});
            })
        },
        getRouteData(){
            let self=this;
            //let routeData=JSON.parse(sessionStorage.getItem('routeData_confirm'));
            let routeData=self.$route.params.data;
            console.log(routeData);
            let inspectList=routeData.inspect;
            let eventList=routeData.event;
            let store=routeData.store;
            let channel=routeData.channel;

            self.store=store;
            self.channel=channel;
            self.inspectList=inspectList;
            self.eventList=eventList;
            let summary=[];
            let ignoreTemp=[];
            let feedBackTemp=[];
            let tempList=[];
            let totalExcellent = 0;
            let totalQualified=0;
            let totalUnqualified=0;
            let totalIgnore = 0;
            let totalItems = 0;
            inspectList.forEach((item,index)=>{
                let obj={};
                obj.groupId=item.groupId;
                obj.groupName=item.groupName;
                obj.count=item.items.length;
                let numOfExcellent=0;
                let numOfQualified=0;
                let numOfUnqualified=0;
                let numIgnore=0;
                totalItems += obj.count;
                item.items.forEach((_item,_index)=>{
                    if(_item.isIgnore){
                        numIgnore++;
                        let objIgnore={};
                        objIgnore.id=_item.id;
                        objIgnore.name=_item.subject;
                        ignoreTemp.push(objIgnore);
                    }
                    else{
                        switch(_item.itemScore){
                            case 0: numOfUnqualified++; break;
                            case 1: numOfQualified++; break;
                            case 2: numOfExcellent++; break;
                        }
                    }
                })
                if(numOfUnqualified>0){
                    obj.isQua=false;
                }
                else{
                    obj.isQua=true;
                }
                obj.numOfExcellentItems=numOfExcellent;
                obj.numOfQualifiedItems=numOfQualified;
                obj.numOfUnqualifiedItems=numOfUnqualified;
                totalExcellent += numOfExcellent;
                totalQualified += numOfQualified;
                totalUnqualified += numOfUnqualified
                totalIgnore += numIgnore;
                summary.push(obj);
            })
          console.log(totalIgnore);
          console.log(totalExcellent);
          console.log(totalQualified);
          console.log(totalUnqualified)
          console.log(totalItems)
          let totalScoreItems = totalItems - totalIgnore
            if(totalUnqualified > 0){
              self.radioList = self.resultList.slice(2)
              totalUnqualified/totalScoreItems >= 0.3 ? self.curSumIndex = 0: self.curSumIndex = 1;
              self.curSumIndex == 0 ? self.radioList[1].isActive = true: self.radioList[0].isActive = true;
            }
            else{
              self.radioList = self.resultList.slice(0,2)
              totalExcellent/totalScoreItems >= 0.8 ? self.curSumIndex = 3: self.curSumIndex = 2;
              self.curSumIndex == 3 ? self.radioList[0].isActive = true : self.radioList[1].isActive = true;
            }
            self.summary=summary;
            eventList.forEach((item,index)=>{
                let objFeedBack={};
                objFeedBack.name=item.eventName;
                objFeedBack.description=item.eventDes;
                feedBackTemp.push(objFeedBack);
            })
            tempList[0]={
                itemTitleName: self.$t('remotePatrol.ignored'),
                iconSrc:'icon-hulve',
                itemCount:ignoreTemp.length,
                itemList:ignoreTemp
            }
            tempList[1]={
                itemTitleName:self.$t('remotePatrol.feedbacks'),
                iconSrc:'icon-fankui',
                itemCount:feedBackTemp.length,
                itemList:feedBackTemp
            }
            self.tempList=tempList;
        },
        getAccountId(){
            let self=this;
            let userId=getCookie('UserId');
            return new Promise((resolve,reject)=>{
                getUserInfo().then(res=>{
                    console.log(res);
                    res.data.forEach(item=>{
                        if(item.userId==userId){
                            let accountId=item.accountId.toLowerCase();
                            self.accountId=accountId;
                            localStorage.setItem('oss_bucket',accountId);
                            resolve(accountId);
                        }
                    })
                })
            })
        },
        async getOssInfo(){
            let self=this;
            let accountId=await self.getAccountId();
            console.log(accountId);
            self.accountId=localStorage.getItem('oss_bucket');
            // getStorageInfo().then(res=>{
            //     console.log(res);
            //     if(res.errCode==0){
            //         self.oss=res.data;
            //     }
            // })
        },
        getUpLoadBucketInfo(){
            let self=this;
            self.bucketVideo='video'+'/'+util.getCurDate2Str();
            self.bucketImage='image'+'/'+util.getCurDate2Str();
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
      adviceChanged(val){
        let self = this;
        let content = filterString.all(val,200);
        console.log(content);
        self.suggest = content;
      }
    },
    mounted(){
        let self=this;
        self.getRouteData();
        self.getUpLoadBucketInfo();
        self.getOssInfo();
    }
}
</script>
<style lang="scss" scoped>
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
@function rem($val){
    @return $val/16+rem;
}
@function checkRem($val){
    @if($val==0){
        @return 0;
    }
    @else if($val==auto){
        @return auto;
    }
    @else{
        @return rem($val);
    }
}
@mixin point($poi,$val){
    #{$poi}:checkRem($val);
}
.activeClass{
    background-color: #FDE8EF !important;
    color: $red;
    border-color: $red !important;
}
.sum-content{
    color: $black;
    .sum-submit{
        margin-bottom: calc(30/1920*100vw);
        text-align: left;
        padding-left: calc(30/1920*100vw);
        padding-right: calc(40/1920*100vw);
        border: 1px solid $border;
        padding-bottom: calc(30/1920*100vw);
        background-color: #fff;
        .submit-header{
            text-align: left;
            height: calc(60/1920*100vw);
            line-height: calc(60/1920*100vw);
            overflow: hidden;
            span{
                font-size: calc(20/1920*100vw);
                font-weight: bold;
                float: left;
            }
            .sum-btn{
                float: right;
                margin-top: calc(18/1920*100vw);
                height: calc(36/1920*100vw);
                width: calc(130/1920*100vw);
                line-height: calc(36/1920*100vw);
                font-size: calc(14/1920*100vw);
                padding: 0 0;
                outline: none;
                border-radius: 4px;
            }
        }
        .submit-content{
            padding-left: calc(10/1920*100vw);
            .submit-radio{
                text-align: left;
                margin-bottom: calc(20/1920*100vw);
                .el-radio-details{
                    display: inline-block;
                    border: 1px solid #ddd;
                    padding:6px;
                    font-size: 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    @include point(width,90);
                    @include point(padding,6);
                    text-align: center;
                    margin-right: calc(20/1920*100vw);
                }

            }
            .sug-label{
                font-size: calc(12/1920*100vw);
                display: block;
                margin-bottom: calc(10/1920*100vw);
                span{
                    color: $red;
                }
            }
            .sug-input{
              width: 99.5%;
            }
        }

    }
    .sum-data{
        padding: calc(40/1920*100vw);
        border: 1px solid $border;
        padding-top: calc(20/1920*100vw);
        padding-bottom: calc(20/1920*100vw);
        background-color: #fff;
        min-height: calc(500/1920*100vw);
        .divider-content{
            height: calc(40/1920*100vw);
            line-height: calc(40/1920*100vw);
            .divider-hr{
                border: 0.5px solid $border;
            }
            span{
                font-size: calc(18/1920*100vw);
                font-weight: bold;
                color: $tab;
            }
        }
        .table-content{
            .table-header{
                text-align: left;
                span{
                    font-size: calc(16/1920*100vw);
                    font-weight: bold;
                    color: $tab;
                    .store-name{
                        color: $black;
                    }
                    .en-store-name{
                      margin-right: 20px;
                    }
                }
            }
            .table-bordered{
                font-size: calc(14/1920*100vw);
                margin-top: calc(20/1920*100vw);
                th{
                    color: $tab;
                    text-align: left;
                    background-color: $background;
                    border-bottom-width: 1px;
                    padding: 0.5rem;
                    width: 20%;
                    padding-left: 1rem;
                }
                td{
                    color: $black;
                    padding-top:0.5rem;
                    padding-bottom: 0.5rem;
                    padding-left: 1.2rem;
                    text-align: left;
                    font-weight: bold;
                }
                .count-blag{
                    padding: 2px 12px;
                    width: auto;
                    height: auto;
                    border-radius: 10px;
                    background-color: #D4DBE5;
                    color: $tab;
                    font-size: 12px;
                    margin-left: calc(20/1920*100vw);
                    display: inline-block;
                }
                .icon-blag{
                    display: inline-block;
                    width: calc(100/1920*100vw);
                    padding:3px 6px;
                    text-align: center;
                    color: #fff;
                    font-size: calc(12/1920*100vw);
                    font-weight: normal;
                }
            }
        }
        .row-footer{
            padding-top: calc(20/1920*100vw);
            padding-bottom: calc(10/1920*100vw);
            margin-top: calc(10/1920*100vw);
            .details-content{
                padding-right: calc(30/1920*100vw);
                &:last-child{
                    padding-right:0;
                }
            }
            .details{
                position: relative;
                height: calc(320/1920*100vw);
                border:1px solid $border;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .item-header{
                    position: relative;
                    background-color: $background;
                    height: calc(40/1920*100vw);
                    line-height: calc(40/1920*100vw);
                    border-bottom: 1px solid $border;
                    padding-left: calc(20/1920*100vw);
                    text-align: left;
                    .icontemp{
                        font-size: calc(18/1920*100vw);
                        margin-right: calc(15/1920*100vw);
                        color: $tab;
                    }
                    .title-lable{
                        font-size: calc(14/1920*100vw);
                        font-weight: bold;
                    }
                    .count-content{
                        position:absolute;
                        right: calc(20/1920*100vw);
                        top: 0;
                        .count{
                            font-size: calc(30/1920*100vw);
                        }
                        .blag{
                            font-size: calc(12/1920*100vw);
                        }
                    }
                }
                .item-content{
                    padding-top: calc(20/1920*100vw);
                    height:  calc(280/1920*100vw);
                    .item-details{
                        height: auto;
                        font-size: calc(14/1920*100vw);
                        padding-left: calc(30/1920*100vw);
                        padding-right: calc(20/1920*100vw);
                        margin-bottom:calc(30/1920*100vw);
                        color: #4b5262;
                        text-align: left;
                        .item-blag{
                            width: calc(12/1920*100vw);
                            height: calc(12/1920*100vw);
                            border-radius: 50%;
                            background-color: $tab;
                            display: inline-block;
                            margin-right: calc(16/1920*100vw);
                        }
                        .item-des{
                            display: block;
                            font-size: calc(12/1920*100vw);
                            margin-top: calc(10/1920*100vw);
                            margin-left: calc(35/1920*100vw);
                            color: $tab;
                        }
                    }
                }
            }
        }
    }
}

</style>
<style>
  .el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-textarea__inner{
        font-family: Arial, 'Microsoft YaHei';
    }
</style>
