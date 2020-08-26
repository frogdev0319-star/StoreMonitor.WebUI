<template>
    <el-row class="sum-content">
        <el-col :span="24" class="sum-submit">
            <div class="submit-header">
                <span>{{generatePatrolLang('summary')}}</span>
                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="sum-btn" type="primary" @click="submit" v-if="inspectList.length!=0">{{generatePatrolLang('submit')}}</el-button>
            </div>
            <div class="submit-content">
                <div class="submit-radio">
                    <span class="el-radio-details" v-for="(item,index) in resultList" :key="index"
                          @click="clickSum(item,index)" :class="item.isActive?'activeClass':''">{{item.name}}</span>
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
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" v-for="(item ,index) in theaderPassFail" :key="index" :style="item.width">{{item.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="4"><span class="sheet_title">{{$t('insSettingView.sheetpassfail')}}</span></td>
                        </tr>
                        <tr v-for="(item,index) in summary" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                            <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{item.groupName}}</span><span class="count-blag">{{item.count}}</span></td>
                            <td><span>{{item.numOfQualifiedItems}}</span></td>
                            <td><span>{{item.numOfUnqualifiedItems}}</span></td>
                        </tr>
                    </tbody>
                </table>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" v-for="(item ,index) in theaderScore" :key="index" :style="item.width">{{item.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="4"><span class="sheet_title">{{$t('insSettingView.sheetscore')}}</span></td>
                        </tr>
                        <tr v-for="(item,index) in summary" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                            <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{item.groupName}}</span><span class="count-blag">{{item.count}}</span></td>
                            <td><span>{{item.numOfQualifiedItems}}</span></td>
                            <td><span>{{item.numOfUnqualifiedItems}}</span></td>
                            <td><span>8</span></td>
                        </tr>
                    </tbody>
                </table>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" v-for="(item ,index) in theaderOther" :key="index" :style="item.width">{{item.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="4"><span class="sheet_title">{{$t('insSettingView.sheetother')}}</span></td>
                        </tr>
                        <tr v-for="(item,index) in summary" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                            <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{item.groupName}}</span><span class="count-blag">{{item.count}}</span></td>
                            <td><span>{{item.numOfQualifiedItems}}</span></td>
                            <td><span>{{item.numOfUnqualifiedItems}}</span></td>
                            <td><span>8</span></td>
                            <td><span>8</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- <el-row class="row-detail">
                <el-col>
                <div class="item-header">
                    <i class="iconfont icon-zhedie1 icontemp" style="color: #eb1d63;"></i>
                    <span class="title-lable">{{$t('remotePatrol.detailInfo')}}</span>
                </div>
                <div class="item-content">
                    <div style="border-bottom:1px solid #f4f5f9;margin-bottom:20px;" v-for="(item,index) in groups" :key="index">
                        <div class="content-title">{{item.groupName}}</div>
                        <div class="content-detail" v-for="(_item,_index) in item.items" :key="_index">
                        <div class="content-detail-title">
                            <div class="detail-title">
                            <p class="title1">{{_index+1}}.{{_item.subject}}</p>
                            <p class="title2">{{_item.description}}</p>
                            </div>
                            <div class="ignore-btn" v-if="_item.grade==-1">{{$t('remotePatrol.ignored')}}</div>
                            <div class="title-btn" v-if="_item.grade==0">{{$t('remotePatrol.scoreUnit')}}{{$t('remotePatrol.failed')}}</div>
                            <div class="title-btn" v-if="_item.grade==1">{{$t('remotePatrol.scoreUnit')}}{{$t('remotePatrol.pass')}}</div>
                        </div>
                        <div class="content-detail-main" style="padding-bottom: 20px;" v-if="_item.showAttachment||_item.comment!=null&&_item.comment!=''">
                            <p class="cdm-title">{{$t('remotePatrol.commentDetail')}}</p>
                            <div class="cdm-voice" v-if="_item.showAudio">
                                <div class="speech-info" @click="startSpeechItem(_item,_index)">
                                    <i class="iconfont icon-yuyin icon-speech"></i>
                                </div>
                                <audio :ref="_item.audio.audioRef" @canplay="getGroupsDuration(_item)">
                                    <source :src="_item.audio.audioSrc" type="audio/mpeg" />
                                </audio>
                                <span class="often-text">{{_item.audio.audioOftenText}}</span>
                            </div>
                            <div class="cdm-word" v-if="_item.comment!=null&&_item.comment!=''">
                                <span>{{_item.comment}}</span>
                            </div>
                            <div class="cdm-pic" v-if="_item.sourceList!=null&&_item.sourceList.length!=0">
                                <div v-for="(sourceitem,sourceindex) in _item.sourceList" :key="sourceindex" class="source-details" :height="imgHeight+'px'">
                                    <div v-if="sourceitem.mediaType==2" class="img-content">
                                        <img class="imgLittle imgInner" :title="imgTitle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'"
                                        :src="sourceitem.url" :height="imgHeight+'px'" :onerror='deafultImg'
                                        @click="openOuter(sourceitem,$event)"/>
                                    </div>
                                    <div  v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,sourceindex)">
                                        <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                        <img class="imgLittle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'" :src="videoImgSrc" :height="imgHeight+'px'"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div style="margin-bottom:20px;" v-if="showFeedBacks">
                        <div class="content-title">{{$t('remotePatrol.feedbacks')}}</div>
                        <div class="content-detail" v-for="(item,index) in feedbacks" :key="index">
                        <div class="content-detail-title" style="background-color:#fff;height:30px;">
                            <div class="detail-title">
                            <p class="title1">{{index+1}}.{{item.subject}}</p>
                            </div>
                        </div>
                        <div class="content-detail-main" v-if="item.showAttachment||item.description!=null&&item.description!=''">
                            <p class="cdm-title">{{$t('remotePatrol.description')}}：</p>
                            <div class="cdm-voice" v-if="item.showAudio">
                                <div class="speech-info" @click="startSpeechFeedBacks(item,index)">
                                    <i class="iconfont icon-yuyin icon-speech"></i>
                                </div>
                                <audio :ref="item.audio.audioRef" @canplay="getFeedBacksDuration(item)">
                                    <source :src="item.audio.audioSrc" type="audio/mpeg" />
                                </audio>
                                <span class="often-text">{{item.audio.audioOftenText}}</span>
                            </div>
                            <div class="cdm-word" v-if="item.description!=null&&item.description!=''">
                                <span>{{item.description}}</span>
                            </div>
                            <div class="cdm-pic" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                                <div v-for="(sourceitem,index) in item.sourceList" :key="index" class="source-details" :height="imgHeight+'px'">
                                    <div v-if="sourceitem.mediaType==2" class="img-content">
                                        <img class="imgLittle imgInner" :title="imgTitle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'"
                                        :src="sourceitem.url" :height="imgHeight+'px'" :onerror='deafultImg'
                                        @click="openOuter(sourceitem,$event)"/>
                                    </div>
                                    <div v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,index)">
                                        <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                        <img class="imgLittle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'" :src="videoImgSrc" :height="imgHeight+'px'"/>
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
            </el-row> -->
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
            scorecount:'',
            radioList:[],
            resultList: [
            //   {
            //     'label': 3,
            //     'name':this.$t('remotePatrol.good'),
            //     'isActive':false
            //   },
              {
                'label': 2,
                'name':this.$t('overview.echartGood'),
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
            theaderPassFail:[
                {name: '',width:'width:11%;'},
                {name: this.$t('remotePatrol.item'),width:'width:22.2%;'},
                {name: this.$t('remotePatrol.pass'),width:'width:35%;'},
                {name: this.$t('remotePatrol.failed'),width:'width:35%;'}
            ],
            theaderScore:[
                {name: '',width:'width:10%;'},
                {name: this.$t('remotePatrol.item'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableTotal'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableIgnore'),width:'width:20%;'},
                {name: this.$t('remotePatrol.TableGet'),width:'width:20%;'}
            ],
            theaderOther:[
                {name: '',width:'width:10%;'},
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
    beforeRouteLeave(to, from, next){
        let self = this
        if(to.name !='remotePatrol' ){
            self.$store.dispatch('setPatrolHistory',null);
            next();
        }else{
            next();
        }
    },
    methods:{
        generatePatrolLang,
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
            let inspectList=self.inspectList;
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
                                obj.deviceId = inspectList[i].items[j].sourceList[k].deviceId;
                            }
                            else if(inspectList[i].items[j].sourceList[k].mediaType==1){
                                let url=await self.upLoadFile(inspectList[i].items[j].sourceList[k]);
                                obj.mediaType=1;
                                obj.url=url;
                                obj.deviceId = inspectList[i].items[j].sourceList[k].deviceId;
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
            }).catch(err=>{
                self.notify(self.$t('remotePatrol.sentFail'),'error',3000);
                return false;
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
          console.log(self.resultList)
          let totalScoreItems = totalItems - totalIgnore
          self.scorecount = Math.round(totalQualified/totalScoreItems*100)

            if(self.scorecount < 90){
              self.scorecount >= 75 ? self.curSumIndex = 0: self.curSumIndex = 1;
              self.curSumIndex == 0 ? self.resultList[1].isActive = true: self.resultList[2].isActive = true;
            }
            else{
              self.scorecount >= 90 ? self.curSumIndex = 2: self.curSumIndex = 1;
              self.curSumIndex == 2 ? self.resultList[0].isActive = true : self.resultList[1].isActive = true;
            }
            self.summary=summary;
            eventList.forEach((item,index)=>{
                let objFeedBack={};
                objFeedBack.name=item.eventName;
                objFeedBack.description=item.eventDes;
                feedBackTemp.push(objFeedBack);
            })
            tempList[0]={
                itemTitleName: self.$t('remotePatrol.ignoreds'),
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
                .sheet_title{
                    line-height: 88px;
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
            margin-bottom: 50px !important;
            .item-header{
                position: relative;
                background-color: $background;
                height: 40px;
                line-height: 40px;
                border: 1px solid $border;
                padding-left: calc(20 / 1920 * 100vw);
                cursor: pointer;
            .icontemp {
                font-size: calc(14 / 1920 * 100vw);
                margin-right: calc(15 / 1920 * 100vw);
                }
            .title-lable {
                font-size: calc(14 / 1920 * 100vw);
                font-weight: bold;
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
                height:70px;
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
                        }
                        }
                    @media screen and (min-width: 1280px) and(max-width: 1366px){
                        width: 90px;
                        .img-content .imgLittle{
                        width: 85px;
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
