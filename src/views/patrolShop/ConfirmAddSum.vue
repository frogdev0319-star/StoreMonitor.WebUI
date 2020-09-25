<template>
    <el-row class="sum-content">
        <el-col :span="24" class="sum-submit">
            <div class="submit-header">
                <span>{{generatePatrolLang('summary')}}</span>
                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="sum-btn" type="primary" @click="submit">{{generatePatrolLang('submit')}}</el-button>
            </div>
            <div class="submit-content">
                <div class="submit-radio">
                    <span v-for="(item,index) in resultList" :key="index">
                        <span class="el-radio-details" v-if="item.isShow"
                          @click="clickSum(item,index)" :class="item.isActive?'activeClass':''">{{item.name}}</span>
                    </span>
                </div>
                <span class="sug-label"><span>*</span>{{generatePatrolLang('advice')}}</span>
                <el-input type="textarea" resize='none' :autosize="{ minRows: 2, maxRows: 7}" v-model="suggest" class="sug-input"  @input="adviceChanged"
                          :placeholder="generatePatrolLang('adviceInfo')" @blur="notShowInputRuleTips"></el-input>
                <span class="rules" v-if="adviceInfoRuletip">{{generatePatrolLang('comentRuletip')}}</span>
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
                    <div class="header-store-name">
                      <span v-if="lang=='en' " class="en-store-name">{{generatePatrolLang('storeName')}}: </span>
                      <span v-else class="store-name">{{generatePatrolLang('storeName')}}：</span>
                      {{store.storeName}}
                    </div>
                    <div class="header-score">
                        <span class="span-1">{{generatePatrolLang('getscore')}}：</span>
                        <span class="span-2">{{scorecount}} <span>{{generatePatrolLang('scorecount')}}</span></span>
                        <span class="span-3">({{generatePatrolLang('scorerule')}})</span>
                    </div>
                </div>
                <table class="table table-bordered" v-for="(s_item,s_index) in summary" :key="s_index">
                    <thead>
                        <tr>
                            <th scope="col" v-for="(t_item ,t_index) in s_item.tHeader" :key="t_index" :style="t_item.width">{{t_item.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td :rowspan="s_item.inspectList.length+1">
                                <span class="sheet_title" :style="'line-height:'+s_item.height*s_item.inspectList.length+'px;'">{{s_item.label}}</span>
                            </td>
                        </tr>
                        <tr v-for="(item,index) in s_item.inspectList" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                            <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{item.groupName}}</span><span class="count-blag">{{item.items.length}}</span></td>
                            <td v-if="s_item.type==0||s_item.type==2"><span>{{item.numOfQualified}}</span></td>
                            <td v-if="s_item.type==0||s_item.type==2"><span>{{item.numOfUnqualified}}</span></td>
                            <td v-if="s_item.type==1"><span>{{item.itemScore}}</span></td>
                            <td><span>{{item.numIgnore}}</span></td>
                            <td v-if="s_item.type==1||s_item.type==2"><span>{{item.itemgetScore}}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <el-row class="row-detail" v-for="(item,index) in tempList" :key="index">
                <el-col v-if="item.itemList.length!=0">
                    <div class="item-header">
                        <i class="iconfont icontemp" :class="item.iconSrc"></i>
                        <span class="title-lable">{{item.itemTitleName}}</span>
                        <span style="float:right;" class="count-content"><span class="count">{{item.itemCount}}</span><span class="blag">{{$t('remotePatrol.unit')}}</span></span>
                    </div>
                    <div class="item-content">
                        <div style="margin-bottom:20px;">
                            <div class="content-detail" v-for="(_item,_index) in item.itemList" :key="_index">
                                <div class="content-detail-title">
                                    <div class="detail-title">
                                        <p class="title1">{{_index+1}}.{{_item.subject}}</p>
                                        <p class="title2">{{_item.description}}</p>
                                    </div>
                                    <div class="ignore-btn" v-if="item.detailType==1">{{$t('remotePatrol.ignored')}}</div>
                                    <div class="title-btn" v-if="(_item.type==0||_item.type==2)&&item.detailType!=1">{{$t('remotePatrol.scoreUnit')}}<span>{{$t('remotePatrol.failed')}}</span></div>
                                    <div class="title-btn" v-if="_item.type==1&&item.detailType!=1">{{$t('remotePatrol.scoreUnit')}}<span><span>{{_item.itemgetScore}}</span><span v-if="lang!='en'">{{$t('remotePatrol.scorecount')}}</span></span></div>
                                </div>
                                <div class="content-detail-main" style="padding-bottom: 20px;" v-if="_item.sourceList!=null&&_item.sourceList.length!=0||_item.inspectInput!=null&&_item.inspectInput!=''">
                                    <p class="cdm-title">{{$t('remotePatrol.commentDetail')}}</p>
                                    <div class="cdm-word" v-if="_item.inspectInput!=null&&_item.inspectInput!=''">
                                        <span>{{_item.inspectInput}}</span>
                                    </div>
                                    <div class="cdm-pic" v-if="_item.sourceList!=null&&_item.sourceList.length!=0">
                                        <div v-for="(sourceitem,sourceindex) in _item.sourceList" :key="sourceindex" class="source-details" :height="imgHeight+'px'">
                                            <div v-if="sourceitem.mediaType==2" class="img-content">
                                                <img class="imgLittle imgInner" :title="imgTitle"
                                                :src="sourceitem.src" :height="imgHeight+'px'" :onerror='deafultImg'
                                                @click="openOuter(sourceitem,$event)"/>
                                            </div>
                                            <div  v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,sourceindex)">
                                                <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                                <img class="imgLittle" :src="videoImgSrc" :height="imgHeight+'px'"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-dialog  :title="$t('eventView.view')" :visible.sync="dialogCommentVideo" :close-on-click-modal="false"
                        v-if="dialogCommentVideo" width="850px" top="12%" @close="stopCommentVideo" class='rate-video-dialog'>
                            <div class="video-dialog-content" style="overflow:hidden;">
                                <hr class="dialog-hr"/>
                                <div class="video-content" >
                                    <video  height=83% width=90% id="previewVideo" prload  controls
                                        class="video-js vjs-fill">
                                    </video>
                                </div>
                            </div>
                        </el-dialog>
                        <transition name="fade">
                            <el-dialog :title="$t('eventView.view')"
                            :visible.sync="showOuter" :close-on-click-modal="false" v-if="showOuter" width="850px" top="12%">
                            <div class="video-dialog-content" style="overflow:hidden;text-align:center;">
                                <hr class="dialog-hr"/>
                                <div class="dialog-source-content">
                                    <img v-if="showImg" :src="checkImgSrc"/>
                                </div>
                            </div>
                            </el-dialog>
                        </transition>
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
            dialogCommentVideo:false,
            showOuter:false,
            showImg:false,
            checkImgSrc:'',
            scorecount:0,
            radioList:[],
            imgTitle:'',
            resultList: [
              {
                'label': 2,
                'name':this.$t('overview.echartGood'),
                'isActive':false,
                'isShow':true
              },
              {
                'label': 1,
                'name':this.$t('remotePatrol.improve'),
                'isActive':false,
                'isShow':true
              },
              {
                'label': 0,
                'name':this.$t('remotePatrol.dangerous'),
                'isActive':false,
                'isShow':true
              },
            ],
            startIcon:require('../../../static/img/pic_play_icon.png'),
            videoImgSrc:require('../../../static/img/image_videoThumbnail.png'),
            deafultImg:'this.src="' + require('../../../static/img/pic2.png') + '"',
            theaderPassFail:[
                {name: '',width:'width:11%;'},
                {name: this.$t('remotePatrol.item'),width:'width:20%;'},
                {name: this.$t('remotePatrol.pass'),width:'width:20%;'},
                {name: this.$t('remotePatrol.failed'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableIgnore'),width:'width:20%;'}
            ],
            theaderScore:[
                {name: '',width:'width:11%;'},
                {name: this.$t('remotePatrol.item'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableTotal'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableIgnore'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableGet'),width:'width:20%;'}
            ],
            theaderOther:[
                {name: '',width:'width:11%;'},
                {name: this.$t('remotePatrol.item'),width:'width:20%;'},
                {name: this.$t('remotePatrol.pass'),width:'width:15%;'},
                {name: this.$t('remotePatrol.failed'),width:'width:15%;'},
                {name: this.$t('remotePatrol.TableIgnore'),width:'width:15%;'},
                {name: this.$t('remotePatrol.TableGet'),width:'width:15%;'}
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
            lang: this.$i18n.locale,
            adviceInfoRuletip:false
        }
    },
    computed: {
      imgHeight(){
            let height=0;
            if(this.varyWindowWidth>1800){
                height= this.varyWindowWidth*0.039;
            }
            else if(this.varyWindowWidth>1400){
                height= this.varyWindowWidth*0.035;
            }
            else{
                height=75;
            }
            return height;
        }
    },
    beforeRouteLeave(to, from, next){
        let self = this
        if(to.name !='remotePatrol' ){
            self.$store.dispatch('setPatrolHistory',null);
            self.$store.dispatch('setPatrolComment',null);
            next();
        }else{
            self.$store.dispatch('setPatrolComment',self.suggest);
            next();
        }
    },
    methods:{
        generatePatrolLang,
        stopCommentVideo(){
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.pause();
        },
        playCommentVideo(item,index){
            let self=this;
            self.dialogCommentVideo=true;
            self.$nextTick(function(){
                var video = document.getElementById("previewVideo");
                this.previewplayer = videojs(video);
                this.previewplayer.src({src:item.url});
                this.previewplayer.play();
            })

        },
        openOuter(item,$ev){
            let self=this;
            console.log(item);
            console.log($ev.target.onerror);
            if(item!=null){
                self.showOuter=true;
                self.checkImgSrc=item.src;
                self.showImg=true;
            }
        },
        getFileUrl(fileName){
            let self=this;
            let bucketName = self.oss.ossBucketName;
            let endpoint=self.oss.ossEndPoint;
            let key=fileName;
            if (self.oss.ossVendor == 2){
              return `https://${endpoint}/${bucketName}/${fileName}`;
            }
            else {
              return `http://${bucketName}.${endpoint}/${fileName}`;
            }
        },
        upLoadFile(fileItem){
            let self=this;
            self.percentage=0;
            if(self.oss.ossVendor == null){
              self.oss.ossVendor = 1; //1 -aliyun  2-azure
            }
            if(self.oss.ossVendor == 1){
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
                      reject(err)
                    console.log(err)
                  })
              })
            }
            else{
              let url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
              let containerURL = new azblob.ContainerURL(url, azblob.StorageURL.newPipeline(new azblob.AnonymousCredential));
              let blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, fileItem.fileName);
              return new Promise((resolve,reject)=>{
                azblob.uploadBrowserDataToBlockBlob(azblob.Aborter.none, fileItem.file, blockBlobURL)
                  .then((results) => {
                    // 上传完成
                    const url = self.getFileUrl(fileItem.fileName);
                    console.log(url);
                    resolve(url);
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              })
            }
        },
        clickSum(item,index){
            let self=this;
            item.isActive=true;
            self.resultList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isActive=false;
                }
            })
            self.curSumIndex=item.label;
        },
        async submit(){
            let self=this;
            let upload=0
            let inspect=self.inspectList;
            let eventList=self.eventList;
            let status=0;
            let flag=false;
            self.resultList.forEach(item=>{
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
            for(let i in inspect){
                for(let  g in inspect[i].inspectList){
                    for(let  j in inspect[i].inspectList[g].items){
                        let objItem={};
                        objItem.ts=new Date().getTime();
                        objItem.description=inspect[i].inspectList[g].items[j].inspectInput.trim();
                        if(inspect[i].type==0||inspect[i].type==2){
                            objItem.grade=inspect[i].inspectList[g].items[j].isIgnore?-1:(inspect[i].inspectList[g].items[j].isQualified ? 1 :0);
                        }else{
                            objItem.grade=inspect[i].inspectList[g].items[j].isIgnore?-1:inspect[i].inspectList[g].items[j].itemgetScore;
                        }
                        
                        objItem.storeId=self.store.storeId;
                        objItem.inspectItemId=inspect[i].inspectList[g].items[j].id;
                        let tempFileUrl=[];
                        if(!inspect[i].inspectList[g].items[j].isIgnore){
                            for(let k in inspect[i].inspectList[g].items[j].sourceList){
                                let obj={};
                                let url=''
                                await self.upLoadFile(inspect[i].inspectList[g].items[j].sourceList[k]).then((url)=>{
                                    url=url
                                }).catch((err)=>{
                                    upload++
                                })
                                if(inspect[i].inspectList[g].items[j].sourceList[k].mediaType==2){
                                    obj.mediaType=2;
                                    obj.url=url;
                                    obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                                }
                                else if(inspect[i].inspectList[g].items[j].sourceList[k].mediaType==1){
                                    obj.mediaType=1;
                                    obj.url=url;
                                    obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                                }
                                tempFileUrl.push(obj);
                            }
                        }
                        objItem.attachment=tempFileUrl;
                        temp.push(objItem);
                    }
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
                    let url=''
                    await self.upLoadFile(self.eventList[i].sourceObj).then((url)=>{
                        url=url
                    }).catch((err)=>{
                        upload++
                    })
                    // let url=await self.upLoadFile(self.eventList[i].sourceObj);
                    let commentObj={
                        mediaType:self.eventList[i].sourceObj.mediaType,
                        url:url,
                        deviceId: self.eventList[i].sourceObj.deviceId
                    }
                    commentTemp.push(commentObj);
                    obj.deviceId = self.eventList[i].sourceObj.deviceId;
                }
                else{                        //通过加号创建的问题反馈
                    //obj.diviceId=-1;
                }
                obj.attachment=commentTemp;
                feedEventList.push(obj);
            }
            status = self.curSumIndex;
            let params={
                status:status,
                comment:self.suggest.trim(),
                items:temp,
                feedback:feedEventList
            };
            let routeData=null;
            upload==0 && submitInspectItem1(params).then(res=>{
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
            }).catch(err=>{
                self.notify(self.$t('remotePatrol.sentFail'),'error',3000);
                return false;
            })

            upload!=0 && self.notify(self.$t('remotePatrol.sentFail'),'error',3000);
        },
        getRouteData(){
            let self=this;
            let PatrolComment = self.$store.getters.PatrolComment;
            if(PatrolComment!=null){
                self.suggest=PatrolComment
            }
            let routeData=self.$route.params.data;
            let inspect=routeData.inspect;
            let eventList=routeData.event;
            let store=routeData.store;
            let channel=routeData.channel;
            self.store=store;
            self.inspectList=routeData.inspect;
            self.eventList=routeData.event;
            let tempList=[],feedBackTemp=[],ignoreTemp=[],UnqualifiedTemp=[],dealType=[]
            let getscoreTotal=0,allscoreTotal=0,otherGetscoreTotal=0,getpassfailQualifiedTotal=0,allpassfailCount=0
            inspect.forEach(p_item=>{
                if(p_item.dealCount!=0){
                    dealType.push(p_item.type)
                }
            })
            let Tab0Status=false
            inspect.forEach(p_item=>{
                var CurItemgetScore=0,CurNotIgnoreTotalscore=0,CurOtherTotalScore=0,CurPassfailQualified=0,CurpassfailCount=0
                p_item.inspectList.forEach(item=>{
                    let QualifiedArr=[],UnqualifiedArr=[],IgnoredArr=[]
                    let totalScore=0,totalGetscore=0,notIgnoreTotalscore=0
                    item.items.forEach(s_item=>{
                        if(s_item.isIgnore){
                            IgnoredArr.push(s_item)
                            ignoreTemp.push(s_item)
                        }else{
                            if((p_item.type==0||p_item.type==2)&&!s_item.isQualified){
                                UnqualifiedArr.push(s_item)
                                UnqualifiedTemp.push(s_item)
                            }else if((p_item.type==0||p_item.type==2)&&s_item.isQualified){
                                QualifiedArr.push(s_item)
                            }else if(p_item.type==1&&(s_item.itemgetScore<s_item.qualifiedScore)){
                                UnqualifiedTemp.push(s_item)
                            }
                            if((p_item.type==1||p_item.type==2)&&s_item.itemgetScore!='--'){
                                totalGetscore+=s_item.itemgetScore
                                notIgnoreTotalscore+=s_item.itemScore
                            }
                        }
                        if(p_item.type==1){
                            totalScore+=s_item.itemScore
                        }
                    })
                    item['numOfQualified']=QualifiedArr.length
                    item['numOfUnqualified']=UnqualifiedArr.length
                    item['numIgnore']=IgnoredArr.length
                    item['itemScore']=totalScore
                    item['itemgetScore']=totalGetscore
                    item['notIgnoreTotalscore']=notIgnoreTotalscore
                    if(p_item.type==0){
                        CurPassfailQualified += item.numOfQualified
                        CurpassfailCount += item.numOfUnqualified
                        getpassfailQualifiedTotal=CurPassfailQualified
                        allpassfailCount=Number(CurpassfailCount+CurPassfailQualified)
                    }
                    if(p_item.type==1){
                        CurItemgetScore += totalGetscore
                        CurNotIgnoreTotalscore += notIgnoreTotalscore
                        getscoreTotal=CurItemgetScore
                        allscoreTotal=CurNotIgnoreTotalscore
                    }
                    if(p_item.type==2){
                        CurOtherTotalScore += totalGetscore
                        otherGetscoreTotal=CurOtherTotalScore
                    }
                })
                if(p_item.type==0){
                    p_item['tHeader']=self.theaderPassFail
                    if(p_item.inspectList.some(x=>x.numOfUnqualified!=0)&&dealType.some(x=>x==0)){
                        self.resultList[0].isShow=false
                        self.resultList[1].isShow=false
                        self.resultList[2].isActive=true
                        Tab0Status=true
                    }else if(p_item.inspectList.every(x=>x.numOfUnqualified==0)&&dealType.length==1&&dealType.some(x=>x==0)){
                        self.resultList[1].isShow=false
                        self.resultList[2].isShow=false
                        self.resultList[0].isActive=true
                        Tab0Status=true
                    }
                    p_item['height']=18+2.3*p_item.inspectList.length
                }else if(p_item.type==1){
                    p_item['tHeader']=self.theaderScore
                    p_item['height']=18+2.3*p_item.inspectList.length
                }else if(p_item.type==2){
                    p_item['tHeader']=self.theaderOther
                    p_item['height']=18+2.3*p_item.inspectList.length
                }
            })
            let s_count=0
            if(dealType.length==1&&dealType[0]==0){
                s_count = Math.round(getpassfailQualifiedTotal/allpassfailCount*100)
            }else{
                s_count = Math.round((getscoreTotal/allscoreTotal*100)+otherGetscoreTotal)
            }
            if(!Tab0Status&&dealType.length!=1&&inspect[0].type==0||inspect[0].type!=0){
                self.resultList[0].isShow=true
                self.resultList[1].isShow=true
                self.resultList[2].isShow=true
                self.resultList[0].isActive=false
                self.resultList[1].isActive=false
                self.resultList[2].isActive=false
            }
            self.scorecount= s_count>100 ? 100 : (s_count<0 ? 0 : s_count)
            self.summary=inspect
            eventList.forEach((item,index)=>{
                let objFeedBack={};
                objFeedBack.subject=item.eventName;
                objFeedBack.description=item.eventDes;
                objFeedBack.sourceList=[]
                item.sourceObj!=null ? objFeedBack.sourceList.push(item.sourceObj) : ''
                feedBackTemp.push(objFeedBack);
            })
            tempList[0]={
                itemTitleName: self.$t('reportView.notableItem'),
                iconSrc:'icon-zhongxindingwei',
                itemCount:UnqualifiedTemp.length,
                itemList:UnqualifiedTemp,
                detailType:0
            }
            tempList[1]={
                itemTitleName: self.$t('remotePatrol.ignoreds'),
                iconSrc:'icon-hulve',
                itemCount:ignoreTemp.length,
                itemList:ignoreTemp,
                detailType:1
            }
            tempList[2]={
                itemTitleName:self.$t('remotePatrol.feedbacks'),
                iconSrc:'icon-fankui',
                itemCount:feedBackTemp.length,
                itemList:feedBackTemp,
                detailType:2
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
        notShowInputRuleTips(){
            this.adviceInfoRuletip=false
        },
      adviceChanged(val){
        let self = this;
        let content = filterString.all(val,200);
        let length = filterString.getContentLength(val);
        console.log(content);
        self.suggest = content;
        if(length>200){
              this.adviceInfoRuletip=true
          }else{
              this.adviceInfoRuletip=false
          }
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
.dialog-source-content{
            @include point(height,320);
            @include point(padding,20);

            img{
                height: 100%;
                user-select: none;
            }
        }
        .video-dialog-content{
            width:100%;
            height:100%;
            margin: auto;
            .dialog-hr{
                border: 0.5px solid ;
                border-color: #dfe2e9;
                margin-bottom:10px;
                bottom: 5px;
                margin-top: 0;
            }
            .video-content{
                @include point(margin,20);
                padding-top: 0;
                position: relative;
                #channelName{
                    width: 100%;
                    color: #fff;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    height: 40px;
                    line-height: 40px;
                    position: absolute;
                    z-index: 10;
                    text-align: left;
                    span{
                        margin-left: 30px;
                    }
                }
                .icon-footer{
                    width: 100%;
                    position: absolute;
                    bottom: 0px;
                    color: #fff;
                    overflow: hidden;
                    user-select:none;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    height: 40px;
                    line-height: 40px;
                    z-index: 10;
                    .iconlside{
                        float: left;
                        text-align: left;
                        .iconplay{
                            font-size: 18px;
                            cursor: pointer;
                            float: left;
                            margin-left: 30px;
                        }

                    }
                    .iconrside{
                        max-width: 500px;
                        float: right;
                        position: relative;
                        span{
                            font-size: 13px;
                            margin-right:6px;
                            margin-left: 20px;
                        }
                        .speed-content{
                            display: inline-block;
                            span{
                                position: relative;
                                bottom:3px;
                            }
                        }
                        .screen-content{
                            display: inline;
                            margin-left: 30px;
                            position: absolute;
                            right: 20px;
                            .iconscreen{
                                font-size: 18px;
                                position: relative;
                                cursor: pointer;
                                margin-right: 20px;
                                bottom: 3px;
                            }
                        }
                    }
                }
            }
            .channel-content{
              margin: 20px 30px;
              padding-top: 0;
              position: relative;
              .radio-group{
                display: grid;
                grid-template-columns: 240px 240px;
                grid-template-rows: 30px;
              }
              .radio-class{
                display: flex;
                align-items: center;
                /deep/ .el-radio__label{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .radio-img{
                  height: 26px;
                  width: 26px;
                  margin-right: 10px;
                }
                .radio-span{
                  display: inline-block;
                  max-width: 150px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 14px;
                  color: #94a4b4;
                }
              }
            }
        }
      /deep/ .el-dialog__footer{
        line-height: 24px;
        padding: 30px;
        padding-top: 20px;
        #cancelBtn{
          @include point(width,76);
          @include point(margin-right,20);
          background-color: #EAEDF2 !important;
          color: #708090 !important;
          font-size: 12px;
          line-height: 12px;
        }
        #confirmBtn{
          @include point(width,76);
          font-size: 12px;
          line-height: 12px;
        }
      }
        #previewVideo{
            @include point(min-width,450);
            @include point(min-height,360);
        }
.activeClass{
    background-color: #FDE8EF !important;
    color: $red;
    border-color: $red !important;
}
.sum-content{
    color: $black;
    .sum-submit{
        margin-bottom: 30px;
        text-align: left;
        padding-left: calc(30/1920*100vw);
        padding-right: calc(40/1920*100vw);
        border: 1px solid $border;
        padding-bottom: 30px;
        background-color: #fff;
        .submit-header{
            text-align: left;
            height: 60px;
            line-height: 60px;
            overflow: hidden;
            span{
                font-size: calc(20/1920*100vw);
                font-weight: bold;
                float: left;
            }
            .sum-btn{
                float: right;
                margin-top: 18px;
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
                margin-bottom: 10px;
                span{
                    color: $red;
                }
            }
            .rules{
                font-size: 10px;
                color:#ff2400;
                font-weight: 400;
                line-height: 12px;
            }
            .sug-input{
              width: 99.5%;
            }
        }

    }
    .sum-data{
        padding: calc(40/1920*100vw);
        border: 1px solid $border;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        min-height: calc(500/1920*100vw);
        .divider-content{
            height: 40px;
            line-height: 40px;
            display: flex;
            align-items: center;
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
                padding-bottom: 20px;
                font-weight: bold;
                .header-store-name{
                    float: left;
                    font-size: calc(16/1920*100vw);
                    color: $tab;
                    .store-name{
                        color: $black;
                    }
                    .en-store-name{
                        margin-right: 20px;
                        color: $black;
                    }
                }
                .header-score{
                    float: right;
                    .span-1{
                        font-size: calc(16/1920*100vw);
                        color: $black;
                    }
                    .span-2{
                        color: $red;
                        font-size: calc(20/1920*100vw);
                    }
                    .span-3{
                        color: $tab;
                        font-size: calc(12/1920*100vw);
                    }
                }
            }
            .table-bordered{
                font-size: calc(14/1920*100vw);
                margin-top: 20px;
                th{
                    color: $tab;
                    text-align: left;
                    background-color: $background;
                    border-bottom-width: 1px;
                    padding: 0.5rem;
                    // width: 10%;
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
                    width: 80px;;
                    padding:3px 6px;
                    text-align: center;
                    color: #fff;
                    font-size: calc(12/1920*100vw);
                    font-weight: normal;
                }
            }
        }
        .row-detail{
            margin-top: 20px;
            text-align: left;
            .item-header{
                position: relative;
                background-color: $background;
                height: 40px;
                line-height: 40px;
                border: 1px solid $border;
                padding:0 calc(20 / 1920 * 100vw);
                cursor: pointer;
                    .icontemp {
                        font-size: calc(14 / 1920 * 100vw);
                        margin-right: calc(15 / 1920 * 100vw);
                        }
                    .title-lable {
                        font-size: calc(14 / 1920 * 100vw);
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
            padding-top: calc(20 / 1920 * 100vw);
            font-size: calc(14 / 1920 * 100vw);
            padding-left: calc(30 / 1920 * 100vw);
            padding-right: calc(30 / 1920 * 100vw);
            color: #4b5262;
            border: 1px solid $border;
            border-top:0;
            .content-title{
                border-left:4px solid #eb1d63;
                font-size: calc(14 / 1920 * 100vw);
                color:#7d8cad;
                padding-left:calc(20 / 1920 * 100vw);
                font-weight: bold;
            }
            .content-detail{
                margin-top: 10px;
                .content-detail-title{
                min-height:70px;
                background-color:$background;
                padding-left:calc(20 / 1920 * 100vw);
                padding-right: calc(20 / 1920 * 100vw);
                padding-top:10px;
                padding-bottom: 10px;
                display: flex;
                .ignore-btn{
                    width:50px;
                    height:24px;
                    background-color: #434c5e;
                    font-size: 12px;
                    color:#ffffff;
                    font-weight: bold;
                    line-height: 25px;
                    text-align: center;
                    border-radius: 5px;
                    margin-right: calc(25 / 1920 * 100vw);
                }
                .title-btn{
                    width:100px;
                    height:25px;
                    background-color: #fcba3f;
                    font-size:12px;
                    color:#ffffff;
                    font-weight: bold;
                    line-height: 25px;
                    text-align: center;
                    border-radius: 20px;
                }
                .detail-title{
                    flex: 1;
                    .title1{
                    font-size: calc(14 / 1920 * 100vw);
                    color:#182752;
                    font-weight: bold;
                    margin:0 0 5px 0;
                    }
                    .title2{
                    font-size: calc(12 / 1920 * 100vw);
                    color:#7d8cad;
                    margin: 15px 0 0 10px;
                    }
                }
                }
                .content-detail-main{
                padding-top: 10px;
                padding-left:calc(20 / 1920 * 100vw);
                padding-right: calc(20 / 1920 * 100vw);
                .cdm-title{
                    font-size:calc(12 / 1920 * 100vw);
                    color:#94a4b4;
                    font-weight: bold;
                    margin: 0;
                }
                .cdm-voice{
                    margin-top: 10px;
                    .speech-info{
                        @include point(width,80);
                        @include point(height,26);
                        background-color: #FFEDED;
                        color: $red;
                        border: 1px solid #FEC0C7;
                        @include point(border-radius,15);
                        display: inline-block;
                        cursor: pointer;
                        .icon-speech{
                            @include point(font-size,18);
                            @include point(line-height,26);
                            @include point(margin-left,5);
                        }
                    }
                    .often-text{
                        @include point(margin-left,20);
                    }
                }
                .cdm-pic{
                    margin-top: 20px;
                    overflow: hidden;
                    .source-details{
                        display: inline-block;
                        .img-content{
                        margin-right: calc(10/1920*100vw);
                            position: relative;
                            cursor: pointer;
                            .start-icon{
                                position: absolute;
                                left: 35%;
                                top: 30%;
                            }
                        .imgLittle{
                            min-width: 70px;
                            width: calc(130/1920*100vw);
                        }
                        }
                    @media screen and (min-width: 1280px) and(max-width: 1366px){
                        width: 90px;
                        .img-content .imgLittle{
                            width: 85px;
                            width: calc(130/1920*100vw);
                        }
                    }
                    }
                }
                .cdm-word{
                    margin-top: 10px;
                    font-size: calc(14 / 1920 * 100vw);
                    color:#4b5262;
                }
                }
            }
            }
        }
        .row-footer{
            padding-top: 20px;
            padding-bottom: 10px;
            margin-top: 10px;
            .details-content{
                padding-right: calc(30/1920*100vw);
                &:last-child{
                    padding-right:0;
                }
            }
            .details{
                position: relative;
                height: 320px;
                border:1px solid $border;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .item-header{
                    position: relative;
                    background-color: $background;
                    height: 40px;
                    line-height: 40px;
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
                    padding-top: 20px;
                    height:  280px;
                    .item-details{
                        height: auto;
                        font-size: calc(14/1920*100vw);
                        padding-left: calc(30/1920*100vw);
                        padding-right: calc(20/1920*100vw);
                        margin-bottom: 30px;
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
        font-family: Roboto,Arial, 'Microsoft YaHei';
    }
</style>
