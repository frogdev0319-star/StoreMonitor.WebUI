<template>
    <el-row class="el-container" :class="isREC?'noeventClass':''">
        <el-col :span="16" class="lside" :class="{liseAnmiClass:showSpread}">
            <div class="el-header-title">
                <span class="lside-title" v-if='showStoreUp'>
                    {{store.storeTitle}}
                </span>
                <div class="storeUp-content" :class="store.storeUp?'coll':'nocoll'" @click="addStoreUp" v-if='showStoreUp'>
                    <i class="iconfont icon-iconfontstart" :class="store.storeUp?'coll-icon':'nocoll-icon'" style="vertical-align: middle;"></i>
                    <span :class="store.storeUp?'coll-font':'nocoll-font'">{{store.storeUpTitle}}</span>
                </div>
                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="el-submit" v-loading.fullscreen.lock="fullscreenLoading" v-if="showStoreUp"
                            @click="submit" type="primary">{{generateStoreMonitorLang('submit')}}</el-button>
            </div>
            <el-dialog :title="generateStoreMonitorLang('edit')"
            :visible.sync="showCutDialog" :close-on-click-modal="false" v-if="showCutDialog" :width="860*percentHeight+'px'" height=300px top=5% @close="closeEdit">
                <div class="canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
                    <hr class="dialog-hr"/>
                    <transition name='fade'>
                        <div class='icon-right' v-if="showPenBtn" id="iconR">
                            <img :src="penBtnSrc" class="pen-btn" @click="showPenList"/>
                            <transition name='fadepen'>
                            <div class="pen-content" v-if="showPen">
                                <div class="content" v-for="(item,index) in penList" :key="index">
                                    <div :class="{colorActive:item.showContent}"></div>
                                    <div class="color" :id="item.id" @click="checkPen(item,index)"></div>
                                </div>
                            </div>
                            </transition>
                        </div>
                    </transition>
                    <canvas id="icanvas"  :width="767*percentHeight" :height="431*percentHeight" @mousedown="mouseDownAction($event)"
                    @mousemove="mouseMoveAction($event)" @mouseleave="mouseLeaveAction($event)" @mouseup="mouseUpAction($event)"></canvas>
                    <div class="cancel-content" v-if="showCancelContent" :style="{'width':767*percentHeight+'px',
                    'margin-left':47*percentHeight+'px'}">
                        <div class="content" @click="cancleEditCanvas">
                            <img :src="clearIconSrc" class="icon-clear" height="22px"/>
                            <span>{{generateStoreMonitorLang('clear')}}</span>
                        </div>
                        <div class="content" @click="confirmEditCanvas">
                            <img :src="removeIconSrc" class="icon-clear" height="22px"/>
                            <span>{{generateStoreMonitorLang('cancel')}}</span>
                        </div>
                    </div>

                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="cancelEdit" size="mini">{{generateStoreMonitorLang('cancel')}}</el-button>
                    <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">{{generateStoreMonitorLang('confirm')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog  :title="generateStoreMonitorLang('view')" :visible.sync="dialogCommentVideo" :close-on-click-modal="false"
            v-if="dialogCommentVideo" :width="680*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content">
                    <hr class="dialog-hr"/>
                    <video  :width="580*percentHeight" :height="430*percentHeight" id="previewCutVideo" prload controls autoplay :src="curVideoSrc">
                    </video>
                </div>
            </el-dialog>
            <el-dialog :title="generateStoreMonitorLang('view')"
                :visible.sync="showOuter" :close-on-click-modal="false" v-if="showOuter" :width="680*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="dialog-img-content">
                        <img :src="checkImgSrc" :width="600*percentHeight" :height="430*percentHeight"/>
                    </div>
                </div>
            </el-dialog>
            <dialog-vue :dialog-title='changeStoreObj.title' :show-info='changeStoreObj.showInfo' :is-warning='changeStoreObj.isWarning' :dialog-closed='changeStoreObj.dialogCosed' @confirmed='changeStoreDialog' @canceled='canceldChangeStore'></dialog-vue>
            <dialog-vue :dialog-title='changeChannelObj.title' :show-info='changeChannelObj.showInfo' :is-warning='changeChannelObj.isWarning' :dialog-closed='changeChannelObj.dialogCosed' @confirmed='changeChannelDialog' @canceled='cancelchangeChannel'></dialog-vue>
            <dialog-vue :dialog-title='noBindDeviceObj.title' :show-info='noBindDeviceObj.showInfo' :is-warning='noBindDeviceObj.isWarning' :dialog-closed='noBindDeviceObj.dialogCosed' @confirmed='noBindDeviceDialog' @canceled='canceldNoBind'></dialog-vue>
            <dialog-vue :dialog-title='noStoreUser.title' :show-info='noStoreUser.showInfo' :is-warning='noStoreUser.isWarning' :dialog-closed='noStoreUser.dialogCosed' @confirmed='noStoreUserDialog' @canceled='cancelNoUser'></dialog-vue>
            <dialog-vue :dialog-title="videoLoadingObj.title" :show-info='videoLoadingObj.showInfo' :is-warning='videoLoadingObj.isWarning' :dialog-closed='videoLoadingObj.dialogCosed' @confirmed='videoLoadingDialog' @canceled='cancelVideoLoading'>></dialog-vue>

            <div v-if="!isEzviz">
              <div class="video-content" v-if="!showgongge" id="videoContent" >
                <div class="getvideo-content" v-if="showGetVideo">
                  <div class="btn-graph">
                    <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"></canvas>
                  </div>
                  <canvas id="vcanvas"  :width="varyWindowWidth*0.418+'px'" :height="varyWindowWidth*0.288+'px'"></canvas>
                </div>
                <div class="video-model" v-if="showModelContent">
                  <span id="channelName" v-if="showControlInfo">{{channel.channelName}}</span>
                  <div class="icon-footer" v-if="showControlInfo">
                    <div class="iconlside" v-if="showStoreUp">
                      <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="!playState"></i>
                      <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-else></i>
                    </div>
                    <div class="iconrside">
                      <div class="speed-content" v-if="playBackState">
                        <span>{{generateStoreMonitorLang('speed')}}</span>
                        <el-select class="el-test" size="mini" v-model="curSpeed" :popper-class="popperClass" v-show="!fullScreen" @change="adjustSpeed">
                          <el-option
                            v-for="(item) in speedList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                        <el-select class="el-test" size="mini" v-model="curSpeed" :popper-class="popperClass" :popper-append-to-body='false' v-show="fullScreen" @change="adjustSpeed">
                          <el-option
                            v-for="(item) in speedList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                        <span>{{generateStoreMonitorLang('back')}}</span>
                        <el-select class="el-test" size="mini" :value="curBack" :popper-class="popperClass" placeholder=' ' v-show="!fullScreen">
                          <el-option
                            v-for="(item) in backList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            @click.native="adjustProcess(item.value, item.label)"
                          >
                          </el-option>
                        </el-select>
                        <el-select class="el-test" size="mini" :value="curBack" :popper-class="popperClass" placeholder=' ' :popper-append-to-body='false' v-show="fullScreen">
                          <el-option
                            v-for="(item) in backList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            @click.native="adjustProcess(item.value, item.label)"
                          >
                          </el-option>
                        </el-select>
                      </div>
                      <div class="screen-content" v-if="showStoreUp">
                        <i class="iconfont iconscreen"
                           :class="fullScreen?'icon-tuichuquanping':'icon-quanping'" @click="controlScreen"></i>
                        <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
                      </div>
                    </div>
                  </div>
                  <div class="progress-content" v-if="playBackState">
                    <!-- <span class="currentTime">{{currentStr}}</span> -->
                    <b-progress :value="currentTimeValue" id="bprogress"
                                :max="durationTimeValue" class="mb-3 el-prog" height="0.2rem" style="margin-bottom:0px !important;"/>
                    <!-- <span class="duration">{{durationStr}}</span> -->
                  </div>

                  <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showCutContent">
                    <div class="paizhao-content" @click="cutPicture">
                      <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                      <span>{{generateStoreMonitorLang('snapshot')}}</span>
                    </div>
                    <div class="paizhao-content" @click="getVideo" style="display: none">
                      <i class="iconfont icon-luxiang iconpaizhao" v-if="lang =='en' " style="font-size:22px;margin-left: -14px;"></i>
                      <i class="iconfont icon-luxiang iconpaizhao" v-else style="font-size:22px"></i>
                      <span style="margin-left:12px;">{{generateStoreMonitorLang('record')}}</span>
                    </div>
                    <div class="icon-drap-content">
                      <i class="iconfont icon-zhedie iconzhedie" @click="spreadContent" v-if="!showSpread"></i>
                      <i class="iconfont icon-close iconzhedie" @click="closeContent" v-else></i>
                    </div>
                  </div>
                </div>
                <div class="errorVideo-model" v-else>
                  <span>{{errorText}}</span>
                </div>
                <video  height=83% width=90% id="previewVideo" prload autoplay :controls="showControls"
                        class="video-js vjs-fill"  @waiting='onPlayerWaiting($event)' @playing="onPlayerPlaying($event)">
                </video>
              </div>
              <div class="video-gongge-content" v-else>
                <div class="video-details" v-for="(item,index) in videoSourceList" :key="index">
                  <div class="video-model" v-if="item.showModelContent">
                    <span class="channelName">{{item.channel.channelName}}</span>
                    <div class="icon-footer">
                      <div class="iconlside">
                        <i class="iconfont icon-bofang1 iconplay" @click="realTime(item)" v-if="item.playState"></i>
                        <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime(item)" v-else></i>
                      </div>
                      <div class="screen-content">
                        <i class="iconfont icon-quanping iconscreen" @click="fullScreen(item)"></i>
                        <i class="iconfont icon-gongge iconscreen" @click="recoverScreen(item)"></i>
                      </div>
                    </div>
                    <div :class="lang== 'en'? 'en-iconright' : 'iconright'">
                      <div class="paizhao-content" @click="cutPicture(item)">
                        <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                        <span>{{generateStoreMonitorLang('snapshot')}}</span>
                      </div>
                      <div class="sheying-content" @click="getVideo(item)">
                        <i class="iconfont icon-luxiang iconpaizhao" style="font-size:20px;position:relative;top:3px;"></i>
                        <span style="margin-left:14px;">{{generateStoreMonitorLang('record')}}</span>
                      </div>
                    </div>
                  </div>
                  <video  height=83% width=90% :id="item.id" prload autoplay
                          class="video-js vjs-fill videos">
                  </video>
                </div>
              </div>
            </div>
            <ezviz-video v-else :store-id="store.storeId" :channel-info="channel" :source-list-length= "sourceList.length" :is-store-monitor="true" :play-back="playBackState"
                         :cur-time="playBackTime"
                         @confirmEzvizCanvas="editEzvizCanvas" @emitEzvizVideo="confirmEzvizVideo" ref="ezvizVideo">

            </ezviz-video>
            <div class="el-event">
                <div :class="corEvent?'event-lside':''">
                    <span class="event-title">{{generateStoreMonitorLang('createMothod')}}</span>
                    <div class="el-radio-content">
                        <div class="el-radio-details" v-for="(item,index) in evBtns" :key="index" :class="item.isActive?'activeClass':''" @click="clickEventBtn(item,index)">
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                    <div class="lside-scrollbar">
                        <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                            <span class="event-title"><span class="is-required">*</span>{{generateStoreMonitorLang('title')}}</span>
                            <el-input size="mini" class="name-input" @input="eventNameChanged" :disabled="corEvent" v-model="eventName"></el-input>
                            <span class="error-class" v-if="showEventNameInfo">{{$t('storeMonitor.emptyTitle')}}</span>
                            <span v-if="!corEvent" class="event-title">{{generateStoreMonitorLang('description')}}</span>
                            <span v-else class="event-title"><span class="is-required">*</span>{{generateStoreMonitorLang('description')}}</span>
                            <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 2, maxRows:7}"
                             v-model="eventDes" :placeholder="generateStoreMonitorLang('descPlaceholder')" @input="eventDesChanged"></el-input>
                            <span class="error-class" v-if="showEventDescInfo">{{$t('storeMonitor.enterDesc')}}</span>

                          <div class="source-content">
                                <div class="source-details" v-for="(item,index) in sourceList" :key="index">
                                    <div class="img-content" v-if="item.mediaType==2">
                                        <i class="el-icon-close icondelete" @click="deleteImg(item,index)" ></i>
                                        <img :src="item.src" :width="item.width" :height="item.height" @click="openOuter(item)" style="cursor: pointer"/>
                                    </div>
                                    <div class="img-content" v-if="item.mediaType==1">
                                        <i class="el-icon-close icondelete" @click="deleteImg(item,index)" ></i>
                                        <img class="start-icon" :src="startIcon" :height="36" @click="playCutVideo(item,index)"/>
                                        <img class="imgLittle" :src="videoImgSrc" :height="item.height"/>
                                    </div>
                                </div>
                                <span>*{{generateStoreMonitorLang('maximumAttach')}}</span>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="right-line" v-if="corEvent" id="rightLine"></div>
                <div v-if="corEvent" class="event-rside">
                    <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                        <span class="event-title cor-des">{{generateStoreMonitorLang('relevantEvent')}}</span>
                        <div class="event-content">
                            <div class="event-details" v-for="(item,index) in eventList" :key="index">
                                <el-radio v-model="curEvent" :label="item.id" @change="checkEvent" class="radio-class">
                                    <span class="event-name" :title="item.name">{{item.name}}</span></el-radio>
                                <div class="event-date">
                                    <span class='date-year'>{{item.dateYear}}</span>
                                    <span class='date-day'>{{item.dateDay}}</span>
                                </div>
                                <p class="event-des" :title="item.descrition">{{item.descrition}}</p>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </el-col>
        <el-col :span="8" class="rside" v-if="!showSpread">
            <div class="el-header-title">
                <span>{{generateStoreMonitorLang('selectStores')}}</span>
            </div>
            <el-tabs v-model="activeIndex" @tab-click="handleClick" :id="lang== 'en'? 'en-storetab-content': 'storetab-content'">
                <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
                    <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                        <div class="storeList-content" v-if="index!=2">
                            <!-- <span v-for="(_item,_index) in item.storeList" :key="_index" class="store-name"
                            :class="_item.isActive?'activeClass':''" @click="clickStore(item,index,_item,_index)">
                                {{_item.name}}
                            </span> -->
                            <div v-for="(_item,_index) in item.storeList" :key="_index" class="store-name" :class="_item.isActive?'activeClass':''"
                             @click="clickStore(item,index,_item,_index)">
                                <el-tooltip class="item" effect="dark" :content="_item.name"
                                    placement="bottom">
                                    <span>{{_item.name}}</span>
                                </el-tooltip>
                            </div>
                        </div>

                        <div class="storeList-content" v-else>
                            <el-input
                                size="small"
                                class="el-search-input"
                                :placeholder="generateStoreMonitorLang('keywords')"
                                v-model="serachVale" @keyup.enter.native="searchStore">
                                <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;" ></i>
                            </el-input>
                            <div v-for="(_item,_index) in item.storeList" :key="_index" class="stores">
                                <span class="citys">{{_item.cityName}}</span>
                                <!-- <span v-for="(itemDs,indexDs) in _item.storeList" :key="indexDs" class="store-name"
                                :class="itemDs.isActive?'activeClass':''" @click="clickStore(item,index,itemDs,indexDs)">
                                    {{itemDs.name}}
                                </span> -->
                                <div v-for="(itemDs,indexDs) in _item.storeList" :key="indexDs" class="store-name" :class="itemDs.isActive?'activeClass':''"
                                @click="clickStore(item,index,itemDs,indexDs)">
                                    <el-tooltip class="item" effect="dark" :content="itemDs.name"
                                        placement="bottom">
                                        <span>{{itemDs.name}}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
            <hr class="rside-hr"/>
            <div class="channel-content">
                <span>{{generateStoreMonitorLang('zoneList')}}</span>
                <el-input
                  size="small"
                  class="el-search-input el-channel-search-input"
                  :placeholder="$t('storeMonitor.channelPlaceholder')"
                  v-model="serachChannelValue" @keyup.enter.native="searchChannel">
                  <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;" ></i>
                </el-input>
                <div class="channels-srollbar">
                    <div class="arrow-content">
                        <i @click="lastBar" class="el-icon-arrow-left icon-arrow" v-if="hideLast"></i>
                    </div>
                    <div class="btn-content">
                        <div v-for="(item,index) in showChannelBtns" :key="index" class="btn-details">
                            <channel-icon-btn :channel-name="item.name" :is-online="item.isonline" :is-click="item.isClick"
                            class="channelBtn" @click.native="clickBtn(item,index)"></channel-icon-btn>
                        </div>
                    </div>
                    <div class="arrow-content">
                        <i @click="nextBar" class="el-icon-arrow-right icon-arrow" v-if="hideNext"></i>
                    </div>
                </div>
            </div>
            <hr class="rside-hr" style="margin-top:0"/>
            <div class="time-content">
              <div class="time-title">
                <span class="date-title">{{generateStoreMonitorLang('selectDate')}}</span>
                <el-button size="mini" class='backTime-btn' @click="backCurDate" type="primary">{{generateStoreMonitorLang('backToNow')}}</el-button>
              </div>
                <div class="date-picker-content">
                    <el-date-picker
                      v-model="dateValue"
                      class="date-picker"
                      type="date"
                      placeholder="日期"
                      :picker-options="pickerOptions"
                      size="mini"
                      :clearable= 'false'
                    >
                    </el-date-picker>
                    <el-time-picker
                        class="time-picker"
                        v-model="curTime"
                        size="mini"
                        :clearable="false"
                        :placeholder="$t('storeMonitor.playTime')"
                    >
                    </el-time-picker>
                </div>
<!--                <div class="date-content">-->
<!--                    <div class="date-header">-->
<!--                        <i @click="forWard" class="el-icon-arrow-left icon-arrow"></i>-->
<!--                        <span v-if="lang !== 'en'">{{curYear}}年{{curMonth}}月</span>-->
<!--                        <span v-else>{{curMonth}}/{{curYear}}</span>-->
<!--                        <i @click="backWard" class="el-icon-arrow-right icon-arrow"></i>-->
<!--                    </div>-->
<!--                    <div class="date-data">-->
<!--                        <span class="date-title" v-for="(item,index) in weekTitles" :key="index">-->
<!--                            {{item}}-->
<!--                        </span>-->
<!--                        <div class="date-details" v-for="(item,index) in weekDays">-->
<!--                            <div class="data" v-for="(_item,_index) in item"-->
<!--                            :key="_index" @click="checkDate(item,index,_item,_index)"-->
<!--                             :style="_item.disabed?{'cursor': 'not-allowed','background-color':'#F5F7FA'}:{'cursor': 'pointer','background-color':'#fff'}">-->
<!--                                <span v-if=" _item.disabed"-->
<!--                                 :style="_item.disabed?{'color':'#C3D3EA','background-color':'#F5F7FA'}:''">{{_item.data}}</span>-->
<!--                                <span v-else :class="_item.showBack?'opColor':'noramlColor'"-->
<!--                                :style="_item.showOp?{'color':'#E8E9ED'}:{'color':'black'}">{{_item.data}}</span>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div class="schedule-tag" v-if="false">-->
<!--                        </div>-->
<!--                        <span style="margin-left:20px;color:#94a4b4;font-size:14px;" v-if="false">有事件</span>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </el-col>
    </el-row>
</template>
<script>

import {getStoreList,getFavoriteList,addFavoriteStore,deleteFavoriteStore} from '@/api/store'
import {addEvent,addComment,getStorageInfo,getEventList} from '@/api/event'
import {mapGetters} from 'vuex'
import PubSub from 'pubsub-js'
import util from '@/common/util'
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
import {validateInput} from '@/common/validate'
import ChannelIconBtn  from '@/components/ChannelIconBtn.vue'
import DialogVue from '@/components/DialogVue.vue'
import {generateStoreMonitorLang} from '@/api/i18n'
import filterString from '@/common/filterString.js'

// import GetVideoBtn from '@/components/GetVideoBtn.vue'
import {getCookie} from '@/common/auth';
import {indexedDB} from '@/common/util'
import RecordRTC from '../../../static/RecordRTC.js'
import { clearTimeout, setInterval, setTimeout, clearInterval } from 'timers';
import EzvizVideo from '@/components/EzvizVideo.vue'

export default {
    name:'StoreMoinitor',
    components:{
        ChannelIconBtn,
        DialogVue,
        EzvizVideo
    },
    data(){
        return{
            hideLast:false,
            hideNext:false,
            fullscreenLoading:false,
            channelBtns:[],
            showChannelBtns:[],
            allChannelBtns: [],
            store:{},
            showStoreUp:true,
            cityList:[],
            popperClass:'select-popClass',
            showModelContent:true,
            showControlInfo:true,
            errorText:'',
            showCancelContent:false,
            showCutContent:false,
            playState:false,
            playBackState:false,
            activeIndex:'0',

            curTabIndex:0,
            curTabItem:null,
            curStoreIndex:0,
            curStoreItem:null, //当前点击的门店对象
            curChannelItem:null,
            curChannelIndex:0,

            serachVale:'',
            varyWindowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth,
            showDate:true,
            playDate:new Date(),

            currentTimeValue:0,
            durationTimeValue:0,
            currentStr:'0:00:00',
            durationStr:'0:00:00',
            timeid:null,
            speedList:[
                {
                    value:0,
                    label:'1/4 X'
                },
                {
                    value:1,
                    label:'1/2 X'
                },
                {
                    value:2,
                    label:'1 X'
                },
                {
                    value:3,
                    label:'2 X'
                },
                {
                    value:4,
                    label:'4 X'
                }
            ],
            curSpeed:'1 X',
            backList:[
                {
                    value:0,
                    label:'10s'
                },
                {
                    value:1,
                    label:'30s'
                },
                {
                    value:2,
                    label:'60s'
                }
            ],
            fullScreen:false,
            curBack:'',
            showControls:false,
            showSpread:false,
            isREC:false,
            showCutDialog:false,
            videoEl:'',
            canvasEl:'',
            timeVideo:0,
            startTimeCutVideo:0,
            endTImeCutVideo:0,

            showCutModel:false,
            penBtnSrc:require('../../../static/img/pen_btn.png'),
            clearIconSrc:require('../../../static/img/清除.png'),
            removeIconSrc:require('../../../static/img/撤销.png'),
            startIcon:require('../../../static/img/pic_play_icon.png'),
            videoImgSrc:require('../../../static/img/image_videoThumbnail.png'),
            checkImgSrc:'',
            showOuter:false,
            showPenBtn:false,
            penList:[
                {
                    id:'white',
                    showContent:false
                },
                {
                    id:'red',
                    showContent:true
                },
                {
                    id:'yellow',
                    showContent:false
                }
            ],
            penChecked:'red',
            showPen:false,
            showModel:true,
            X:0,Y:0,X1:0,Y1:0,
            isMouseDown:false,
            flag:0,

            tabList:[
                {
                    label: this.$t('storeMonitor.star'),
                    storeList:[]
                },
                {
                    label: this.$t('storeMonitor.visited'),
                    storeList:[]
                },
                {
                    label: this.$t('storeMonitor.allStores'),
                    storeList:[]
                }
            ],
            tempStoreList:[],
            allInitStoreList:[],
            curTime:new Date(),
            curDate:'',
            curYear:new Date().getFullYear(),
            curMonth:new Date().getMonth()+1,
            curDay:new Date().getDate(),
            weekTitles: this.$t('storeMonitor.week'),
            weekDays:[],

            startTs:0,
            protocal:'DASH',
            sessionId:'',
            channel:{},
            isPlayingFlag:-1,   //判断当前是否正在播放实时视频
            evBtns:[{'name': this.$t('storeMonitor.createProblem'),'isActive':true},{'name':this.$t('storeMonitor.relateProblem'),'isActive':false}],
            eventList:[],
            curEvent:'',
            eventName:'',
            eventDes:'',
            sourceList:[],
            oss:null,
            bucketVideo:'',
            bucketImage:'',
            showgongge:false,
            showGetVideo:false,
            videoSourceList:[
                {
                    id:'id'+0,
                    showModelContent:true,
                    channel:{
                        channelId:1,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
                {
                    id:'id'+1,
                    showModelContent:true,
                    channel:{
                        channelId:2,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
                {
                    id:'id'+2,
                    showModelContent:true,
                    channel:{
                        channelId:3,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
                {
                    id:'id'+3,
                    showModelContent:true,
                    channel:{
                        channelId:4,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
            ],
            imageCanvas:new Image(),
            imageCanvasList:[],
            timeDrap:false,
            curYearNum:0,
            curMonthNum:0,
            curDayNum:0,
            percentage:0,
            accountId:'',
            userId:'',
            changeStoreObj:{
                title:this.$t('storeMonitor.confirm'),
                showInfo: this.$t('storeMonitor.switchInfo'),
                isWarning:true,
                dialogCosed:false
            },
            changeChannelObj:{
                title: this.$t('storeMonitor.confirm'),
                showInfo: this.$t('storeMonitor.switchInfo'),
                isWarning:true,
                dialogCosed:false
            },
            noBindDeviceObj:{
                title: this.$t('storeMonitor.prompt'),
                showInfo: this.$t('storeMonitor.notBindCamera'),
                isWarning:false,
                dialogCosed:false
            },
            noStoreUser:{
                title: this.$t('storeMonitor.prompt'),
                showInfo: this.$t('storeMonitor.notSolver'),
                isWarning:true,
                dialogCosed:false
            },
            recorder:null,
            videoCanvasSrc:'',
            isRecordingStarted : false,
            isStoppedRecording : false,
            dialogCommentVideo : false,
            curVideoSrc:'',
            videoSpeed:0,
            videoSpeedId:0,
            timerPlayReal:null,
            realTimeSpeed:0,
            cutDialogcurTime:0,
            lang: this.$i18n.locale,
            playBackTime: 0,
            realTimeStartTs: 0,
            isFirstLoad: false,
            videoLoadingObj:{
              title: this.$t('remotePatrol.prompt'),
              showInfo: this.$t('remotePatrol.videoLoading'),
              isWarning:true,
              dialogCosed:false
            },
            isLoading: false,
          showEventNameInfo: false,
          showEventDescInfo: false,
          serachChannelValue: '',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },
          dateValue: new Date()
        }
    },
  created(){
    this.isFirstLoad = true
  },
    computed:{
        graphBtnWidth:function(){
            return this.varyWindowHeight*0.185;
        },
        btnFontSize:function(){
            return this.varyWindowHeight*0.022;
        },
        percentHeight:function(){
            return this.varyWindowHeight/758;
        },
        ...mapGetters({
            accountChanged:'accountChanged'
        }),
        corEvent:function(){
            this.showEventNameInfo = false;
            this.showEventDescInfo = false;
            return this.evBtns[1].isActive;
        },
        isEzviz() {
          let self = this;
          console.log(self.$store.state.user);
          return self.$store.state.user.isEzviz
        }
    },
    watch:{
        accountChanged(val,oldVal){
            console.log(val);
            let self=this;
            if(val!=0){
                self.changeBrand();
                window.setTimeout(function(){
                    self.$route.meta.keepAlive = true;
                    console.log(self.$route.meta.keepAlive);
                  },
                  300)
            }
        },
        realTimeSpeed(val,oldVal){
            let self=this;
            console.log(val);
            if(val>=300){
                self.stopRealTime();
                window.clearInterval(self.timerPlayReal);
                self.timerPlayReal=null;
            }
        }
    },
    beforeRouteEnter (to, from, next) {
      if(from.name=='storeSubEvent'){
        to.meta.isBack = true;
      }
      else{
        to.meta.isBack = false;
      }
      console.log(to.meta.keepAlive)
        next(vm => {
            //if(to.params.flag){
                //vm.clearEvent();
                //let store_route=JSON.parse(sessionStorage.getItem('store_submit'));
            //}
            vm.clearEvent();
        });
    },
    beforeRouteLeave(to, from, next){
        //离开页面的同时应该停止播放视频
        let self=this;
        window.clearInterval(self.timeid);
        window.clearInterval(self.timerPlayReal);
        self.isPlayingFlag=-1;
        self.timerPlayReal=null;
        self.timeid=null;
        if(!self.isEzviz){
          if(self.playState || self.playBackState){
            self.stopRealTime();
          }
        }
        else{
          self.$refs.ezvizVideo.stopRealTime();
        }
        if(to.name!='storeSubEvent'){
            from.meta.keepAlive=false;
            if(self.previewplayer){
              self.previewplayer.dispose();
            }
        }
        else{
          from.meta.keepAlive=true;
        }
        console.log(from.meta.keepAlive)
        next();
    },
    async mounted(){
        let self=this;
        self.isREC=false;
        //self.videoEl=document.getElementById('previewVideo');
        //document.onmouseup=self.mouseUpAction;
        document.addEventListener("mouseup",self.mouseUpAction, false);
        //self.getPlayer();
        //初始化页面数据
        self.myDivHeight();
        self.getOssInfo();
        self.getUpLoadBucketInfo();
        self.getInitStoreData();
        self.getFaStoreData();   //初始获取已关注门店的列表数据
        self.getWeekDay();
        if(!self.isEzviz){
          self.looper();
        }
        window.onresize=function(){
            if(!self.checkFull()){
                self.fullScreen=false;
                var ele = document.getElementById('videoContent');
                ele.style.width = "auto";
                ele.style.height = "auto";
            }
        }
        /**
         * 远程巡检，门店监控页面在页面离开的时候需暂停实时视频的播放，进入的时候重新调用api.
         */
        window.addEventListener("visibilitychange", self.visibilityChange, false)
        // window.addEventListener("visibilitychange",()=>{
        //     if(document.hidden){
        //         console.log("我暂时离开页面了");
        //         if(self.playState&&!self.playBackState){  //当前播放的是实时视频
        //             self.stopRealTimeVisPage();
        //             window.clearInterval(self.timerPlayReal);
        //         }
        //         // if(self.playBackState){
        //         //   self.stopRealTime();
        //         //   window.clearInterval(self.timeid)
        //         // }
        //     }else{
        //         console.log("我进入页面了");
        //         console.log(self.playBackState);
        //         if(self.isPlayingFlag==1){
        //             self.realTime();
        //         }
        //     }
        // })
    },
    methods:{
        generateStoreMonitorLang,
       visibilityChange(){
          let self = this;
          if(document.hidden){
            console.log("我暂时离开页面了");
            if(self.playState&&!self.playBackState){  //当前播放的是实时视频
              self.stopRealTimeVisPage();
              window.clearInterval(self.timerPlayReal);
            }
            // if(self.playBackState){
            //   self.stopRealTime();
            //   window.clearInterval(self.timeid)
            // }
          }else{
            console.log("我进入页面了");
            console.log(self.playBackState);
            if(self.isPlayingFlag==1){
              self.realTime();
            }
          }
        },
        changeBrand(){
            let self=this;
            self.clearEvent();
            if(self.playState){
                self.stopRealTime();
                self.previewplayer.dispose();
            }
            //self.videoEl=document.getElementById('previewVideo').children[0];
            self.activeIndex='0';
            self.accountId=localStorage.getItem('oss_bucket');
            self.hideLast=false;
            self.hideNext=false;
            self.evBtns[0].isActive=true;
            self.evBtns[1].isActive=false;
            self.getInitStoreData();
            self.getFaStoreData();
            self.backCurDate();
        },
        getUpLoadBucketInfo(){
            let self=this;
            self.bucketVideo='video'+'/'+util.getCurDate2Str();
            self.bucketImage='image'+'/'+util.getCurDate2Str();
        },
        getPlayer(){
            var player=videojs('previewVideo',{
                'controls':true,
                'autoplay':false,
                'preload':'auto',
                'loop':false,
                controlBar:{
                    captionsButton: false,
                    chaptersButton: false,
                    playbackRateMenuButton: true,
                    LiveDisplay: true,
                    subtitlesButton: false,
                    remainingTimeDisplay: true,
                    progressControl: true,
                    volumeMenuButton: {
                        inline: false,
                        vertical: true
                    },//竖着的音量条
                        fullscreenToggle: true
                }
            },function(){
                var newbtn = document.createElement('btn');
                newbtn.innerHTML = '<button class="vjs-control" id="downloadButton">按钮1</button>';
                var controlBar = document.getElementsByClassName('vjs-control-bar')[0];
                insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];
                controlBar.insertBefore(newbtn,insertBeforeNode);
            })
        },
        getOssInfo(){
            let self=this;
            self.accountId=localStorage.getItem('oss_bucket');
            let userId=getCookie('UserId');
            self.userId=userId;
            // getStorageInfo().then(res=>{
            //     if(res.errCode==0){
            //         self.oss=res.data;
            //     }
            // })
        },
        clearEvent(){
            let self=this;
            self.eventName='';
            self.eventDes='';
            self.sourceList=[];
            self.curEvent='';
            self.showEventNameInfo = false;
        },
        getFaStoreList(){
            let self=this;
            return new Promise((resolve,reject)=>{
                getFavoriteList().then(res=>{
                    resolve(res);
                })
            })
        },
        getAllStoreList(){
            let self=this;
            let params={
                "filter": {
                    "page": 0,
                    "size": 1000
                }
            };
            return new Promise((resolve,reject)=>{
                getStoreList(params).then(res=>{
                    resolve(res);
                })
            })
        },
        async getStoreList(){
            let self=this;
            let getStoreTemp=data=>{
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    if(self.store.storeId==item.storeId){
                        obj.isActive=true;
                    }
                    else{
                        obj.isActive=false;
                    }
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userId=item.userId;
                    obj.favorite=item.favorite==undefined?true:item.favorite;
                    obj.device=item.device;
                    temp.push(obj);
                })
                return temp;
            }
            let data;
            switch(Number(self.activeIndex)){
                case 0: data=await self.getFaStoreList();
                    if(data.errCode==0){
                        let storeData=data.data;
                        self.tabList[0].storeList=getStoreTemp(storeData);
                    }
                    break;
                case 1:
                    data=self.getStoreObj();
                    console.log(data);
                    self.tabList[1].storeList=getStoreTemp(data);
                    break;
                case 2:
                    self.tabList[2].storeList.forEach((item,index)=>{
                        item.storeList.forEach(_item=>{
                            if(_item.storeId==self.store.storeId){
                                _item.isActive=true;
                            }
                            else{
                                _item.isActive=false;
                            }
                        })
                    })
                    break;
            }
        },
        /**
         * add favorite or delete favorite
         */
        async getFaStoreData(storeData){
            let self=this;
            let getStoreTemp=data=>{
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    if(index==0){
                        obj.isActive=true;
                    }
                    else{
                        obj.isActive=false;
                    }
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userId=item.userId;
                    obj.favorite=item.favorite==undefined?true:item.favorite;
                    obj.device=item.device;
                    temp.push(obj);
                })
                return temp;
            }
            let res=await self.getFaStoreList();
            if(res.errCode==0){
                let storeData=res.data;
                self.tabList[0].storeList=getStoreTemp(storeData);
                if(storeData.length==0){
                    self.showStoreUp=false;
                    self.store={};
                    self.channel={};
                    self.channelBtns=[];
                    self.showChannelBtns=[];
                    self.allChannelBtns = [];
                }
                else{
                    let obj={};
                    obj.storeId=storeData[0].storeId;
                    obj.storeName=storeData[0].name;
                    obj.storeTitle=storeData[0].name;
                    obj.userName=storeData[0].userName;
                    obj.storeUp=true;
                    obj.storeUpTitle= self.$t('storeMonitor.stared');
                    self.store=obj;
                    self.showStoreUp=true;
                    let curStoreId=storeData[0].storeId;

                    let storeObj={
                        storeId:curStoreId
                    };

                    self.saveStoreObj(storeObj);
                    self.getChannelByStore(self.tabList[0].storeList[0]);
                }
            }
        },
        async getInitStoreData(storeData){
            let self=this;
            let getStore2Temp=data=>{
                let cityList=[];
                data.forEach(item=>{
                    if(cityList.map(x=>x.city).indexOf(item.city)==-1){
                        let obj={
                            city:item.city,
                            province:item.province
                        }
                        cityList.push(obj);
                    }
                })
                let storeListTemp=[];
                for(let i=0;i<cityList.length;i++){
                    let temp=[];
                    let obj={};
                    for(let j=0;j<data.length;j++){
                        if(cityList[i].city==data[j].city){
                           let obj={};
                            obj.isActive=false;
                            obj.storeId=data[j].storeId;
                            obj.name=data[j].name;
                            obj.userId=data[j].userId;
                            obj.city=data[j].city;
                            obj.province=data[j].province;
                            obj.favorite=data[j].favorite==undefined?true:data[j].favorite;
                            obj.device=data[j].device;
                            temp.push(obj);
                        }
                    }
                    obj.cityName=cityList[i].province+' '+cityList[i].city;
                    obj.storeList=temp;
                    storeListTemp.push(obj);
                }
                return storeListTemp;
            }
            let res=await self.getAllStoreList();
            if(res.errCode==0){
                let storeData=res.data.content;
                self.allInitStoreList=storeData;
                if(storeData.length==0){
                    self.tabList[2].storeList=[];
                    self.tempStoreList=[];
                }
                else{
                    self.tabList[2].storeList=getStore2Temp(storeData);
                    self.tempStoreList=getStore2Temp(storeData);
                }
            }
        },
        addStoreUp(){
            let self=this;
            let temp=[];
            temp.push(self.store.storeId);
            let params={
                storeIds:temp
            }
            if(!self.store.storeUp){
                addFavoriteStore(params).then(res=>{
                    if(res.errCode==0){
                        self.store.storeUp=true;
                        self.store.storeUpTitle= self.$t('storeMonitor.stared');
                        self.getStoreList();
                        self.tabList[2].storeList.forEach((item,index)=>{
                            item.storeList.forEach((_item,_index)=>{
                                if(self.store.storeId==_item.storeId){
                                    _item.favorite=true;
                                }
                            })
                        })
                        self.tempStoreList.forEach((item,index)=>{
                            item.storeList.forEach((_item,_index)=>{
                                if(self.store.storeId==_item.storeId){
                                    _item.favorite=true;
                                }
                            })
                        })
                        self.allInitStoreList.forEach((item,index)=>{
                            if(self.store.storeId==item.storeId){
                                item.favorite=true;
                            }
                        })
                    }
                })
            }
            else{
                deleteFavoriteStore(params).then(res=>{
                    if(res.errCode==0){
                        self.store.storeUp=false;
                        self.store.storeUpTitle= self.$t('storeMonitor.clickToStar');
                        self.getStoreList();
                        self.tabList[2].storeList.forEach((item,index)=>{
                            item.storeList.forEach((_item,_index)=>{
                                if(self.store.storeId==_item.storeId){
                                    _item.favorite=false;
                                }
                            })
                        })
                        self.tempStoreList.forEach((item,index)=>{
                            item.storeList.forEach((_item,_index)=>{
                                if(self.store.storeId==_item.storeId){
                                    _item.favorite=false;
                                }
                            })
                        })
                        self.allInitStoreList.forEach((item,index)=>{
                            if(self.store.storeId==item.storeId){
                                item.favorite=false;
                            }
                        })
                    }
                })
            }
        },
        getEventList(){
            let self=this;
            let date=new Date();
            let params={
                "beginTs": date.getTime()-3600*24*30*1000*30,
                "endTs": date.getTime(),
                "clause": {
                    "storeId": self.store.storeId,
                    "status": 0,
                    "sourceType":0
                },
                "filter": {
                    "page": 0,
                    "size": 5
                },
                "order": {
                    "direction": "desc",
                    "property": "ts"
                }
            }
            return new Promise((resolve,reject)=>{
                getEventList(params).then(res=>{
                    let data=res.data.content;
                    resolve(data);
                })
            })

        },
        async clickEventBtn(item,index){
            let self=this;
            self.eventName='';
            self.eventDes='';
            self.curEvent='';
            if(index==1){
                item.isActive=true;
                self.evBtns[0].isActive=false;
                let data=await self.getEventList();
                data=data.slice(0,5);
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    obj.id=item.id;
                    obj.name=item.subject;
                    obj.descrition=item.initialComment.description;
                    obj.dateYear=util.getYearStr(item.ts);
                    obj.dateDay=util.getDayStr(item.ts);
                    temp.push(obj);
                })
                self.eventList=temp;
            }
            else{
                item.isActive=true;
                self.evBtns[1].isActive=false;
            }
        },
        checkEvent(val){
            let self=this;
            self.eventList.forEach(item=>{
                if(item.id==val){
                    self.eventName=item.name;
                }
            })
            self.showEventNameInfo = false;
        },
        getCurTime(){
            let self=this;
            // let year=self.curYearNum==0?self.curYear:self.curYearNum;
            // let month=self.curMonthNum==0?self.curMonth:self.curMonthNum;
            // let day=self.curDayNum==0?self.curDay:self.curDayNum;
            let year = self.dateValue.getFullYear();
            let month = self.dateValue.getMonth() + 1;
            let day= self.dateValue.getDate();
            let hours=self.curTime.getHours();
            let min=self.curTime.getMinutes();
            let second=self.curTime.getSeconds();
            let date=year+'-'+month+'-'+day+' '+hours+':'+min+':'+second;
            let d=new Date(date);
            return d;
        },
        async stopAndPlayHistoryVideo(){
            let self=this;
            let state=self.playBackState;
            self.realTimeStartTs =Number(self.curTime.getTime().toString().substr(0,10));
            console.log(self.realTimeStartTs);
            self.isLoading = true;
            self.stopVideo();
            const data = {
                request: {
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            let url='';
            if(state){
                let ret=await dashAPI.playBack(0,data);
                await dashAPI.Offline(self.sessionId);
            }
            else{
                let ret=await dashAPI.RealTime(0,data);
                await dashAPI.Offline(self.sessionId);
            }
            let sessionId= await dashAPI.Online();
            self.sessionId=sessionId;
            if(sessionId==null){
              self.isLoading = false;
              return;
            }
            let dataonLine={
                request: {
                    method: 'connection',
                    sessionID: sessionId,
                    streamingProtocol:this.protocal,
                    IVSID:self.channel.ivsId,
                    channel:JSON.stringify(self.channel.channelId),
                    beginTime:self.curTime.getTime().toString().substr(0,10),
                    endTime:(self.curTime.getTime()+(5*60+1)*1000).toString().substr(0,10),
                    streamType:'SubStream'
                }
            };
            url=await dashAPI.playBack(1,dataonLine);
            self.mpdurl = url;
            if(url == null){
              self.isLoading = false;
              return;
            }
            console.log(self.mpdurl);
            if (self.mpdurl.ErrorCode==undefined&&self.mpdurl.length!=0) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
                setTimeout(()=>{
                  self.isLoading = false;;
                },1000);
                self.timeid= window.setInterval(function(){  //播放视频的同时进度条进行
                    self.getProcess();
                },1000);
            }
            else{   //当前视频如果返回失败，需处于暂停状态
                self.playState=false;
                self.showModelContent=false;
                self.isLoading = false;
                console.log(self.mpdurl.ErrorCode);
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
            }
        },
      async stopAndAdjustProcessHistoryVideo(){
        let self=this;
        let state=self.playBackState;
        self.stopVideo();
        window.clearInterval(self.timeid);
        self.isLoading = true;
        const data = {
          request: {
            method: 'disconnection',
            sessionID: self.sessionId,
            IVSID:self.channel.ivsId,
            channel:JSON.stringify(self.channel.channelId),
            streamType:'SubStream'
          }
        };
        let url='';
        if(state){
          let ret=await dashAPI.playBack(0,data);
          await dashAPI.Offline(self.sessionId);
        }
        else{
          let ret=await dashAPI.RealTime(0,data);
          await dashAPI.Offline(self.sessionId);
        }
        let sessionId= await dashAPI.Online();
        self.sessionId=sessionId;
        if(sessionId==null){
          self.isLoading = false;
          return;
        }
        let dataonLine={
          request: {
            method: 'connection',
            sessionID: sessionId,
            streamingProtocol:this.protocal,
            IVSID:self.channel.ivsId,
            channel:JSON.stringify(self.channel.channelId),
            beginTime:self.realTimeStartTs.toString().substr(0,10),
            endTime:(self.realTimeStartTs +(5*60+1)).toString().substr(0,10),
            streamType:'SubStream'
          }
        };
        url=await dashAPI.playBack(1,dataonLine);
        self.mpdurl = url;
        console.log(self.mpdurl);
        if(url == null){
          self.isLoading = false;
          return;
        }
        if (self.mpdurl.ErrorCode==undefined&&self.mpdurl.length!=0) {
          console.log(self.mpdurl);
          self.playVideo(self.mpdurl);
          setTimeout(()=>{
            self.isLoading = false;;
          },1000);
          self.timeid= window.setInterval(function(){  //播放视频的同时进度条进行
            self.getProcess();
          },1000);
        }
        else{   //当前视频如果返回失败，需处于暂停状态
          self.playState=false;
          self.showModelContent=false;
          self.isLoading = false;
          console.log(self.mpdurl.ErrorCode);
          let errorCode=self.mpdurl.ErrorCode; //错误码
          let errorText= util.getErrorText(errorCode);
          self.errorText=errorText;
        }
      },
        async playHistoryVideo(){
            let self=this;
            self.realTimeStartTs =Number(self.curTime.getTime().toString().substr(0,10));
            console.log(self.realTimeStartTs);
            self.isLoading = true;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            self.sessionId=sessionId;
            if(sessionId == null){
              self.isLoading = false;
              return;
            }
            let data= {
                request: {
                    method: 'connection',
                    sessionID: sessionId,
                    streamingProtocol:this.protocal,
                    IVSID:self.channel.ivsId,
                    channel:JSON.stringify(self.channel.channelId),
                    beginTime:self.curTime.getTime().toString().substr(0,10),
                    endTime:(self.curTime.getTime()+(5*60+1)*1000).toString().substr(0,10),
                    streamType:'SubStream'
                }
            };
            let url=await dashAPI.playBack(1,data);
            self.mpdurl=url;
            if(url == null){
              self.isLoading = false;
              return;
            }
            if(url.ErrorCode==undefined&&url.length!=0){
                self.playVideo(self.mpdurl);
                setTimeout(()=>{
                  self.isLoading = false;;
                },1000);
                self.timeid=window.setInterval(function(){  //播放视频的同时进度条进行
                    self.getProcess();
                },1000);
            }
            else{
                self.playState=false;
                self.showModelContent=false;
                self.isLoading = false;
                console.log(self.mpdurl.ErrorCode);
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
            }
        },
        changeDate(val){
            let self=this;
            self.startTs=0;
            self.showModelContent=true;
            let d = self.getCurTime();
            console.log(d)
            self.curTime = d;
            //let dstr=Number((d.getTime()+(1*60+1)*1000).toString().substr(0,10));
            let dstr=Number((d.getTime()).toString().substr(0,10));
            self.startTs=dstr;
            console.log(self.startTs)
            self.playBackTime = Number((d.getTime()).toString());
            self.currentTimeValue=0;
            self.playBackState=true;
            self.curSpeed='1 X';
            self.curBack='';
            if(self.timeid!=null){
                window.clearInterval(self.timeid);
                self.timeid=null;
                self.timeid=0;
            }
            if(!self.isEzviz){
              if(self.playState){  //切换时间的时候判断当前视频是否在播放
                self.stopAndPlayHistoryVideo();
              }
              else{
                self.playHistoryVideo();
              }
            }
            else{
              console.log('ezviz')
              self.$refs.ezvizVideo.changeHistoryTime(self.playBackTime);
            }
        },
        afterCurDate(sindex,item){
            let self=this;
            let flag=false;
            let date=new Date();
            let year=date.getFullYear();
            let month=date.getMonth()+1;
            let day=date.getDate();
            if((sindex==0&&(item.data>day&&item.data<=7&&year==self.curYear&&month==self.curMonth)||sindex!=0&&(item.data>day&&year==self.curYear&&month==self.curMonth))||(self.curYear>year)||(self.curYear==year&&self.curMonth>month)){
                flag=true;
            }
            else{
                flag=false;
            }
            return flag;
        },
        checkDate(item,index,_item,_index){
            let self=this;
            if(_item.disabed){
                return false;
            }
            self.curDate=_item.data;
            self.showModelContent=true;
            let curYear=self.curYear;
            let curMonth=self.curMonth;
            let curDay=self.curDay;
            if(_item.data>20&&index==0){
                self.curDayNum=_item.data;
                if(self.curMonth==1){
                    self.curMonthNum=12;
                    self.curYearNum=curYear-1;
                }
                else{
                    self.curMonthNum=curMonth-1;
                    self.curYearNum=self.curYear;
                }
            }
            else{
                self.curDayNum=_item.data;
                self.curMonthNum=self.curMonth;
                self.curYearNum=self.curYear;
            }
            let d=self.getCurTime();
            _item.showBack=true;

            self.weekDays.forEach((itemDs,indexDs)=>{
                itemDs.forEach((itemChild,indexChild)=>{
                    if(_item.data!=itemChild.data){
                        itemChild.showBack=false;
                    }
                    else{
                        if(index!=indexDs){
                            itemChild.showBack=false;
                        }
                    }
                })
            })
        },
        getFileUrl(fileName){
            let self=this;
            let bucketName = self.oss.ossBucketName;
            let endpoint=self.oss.ossEndPoint;
            let key=fileName;
            //let url=`http://${bucketName}.${endpoint}/${fileName}`;
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
              self.oss.ossVendor = 1
            }
            if(self.oss.ossVendor == 1){
              let OSS = require('ali-oss');
              const client = new OSS({
                region: self.oss.ossEndPoint.slice(0,self.oss.ossEndPoint.indexOf('.')),
                accessKeyId: self.oss.ossAccessKeyId,//填入自己的id
                accessKeySecret: self.oss.ossAccessKeySecret,//填入自己的id
                bucket: self.oss.ossBucketName
              })
              let name=fileItem.fileName;
              return new Promise((resolve,reject)=>{
                client.multipartUpload(name,fileItem.file,{
                  progress: function* (percentage, cpt) {
                    self.percentage = percentage
                  }
                })
                  .then((results) => {
                    // 上传完成
                    const url = self.getFileUrl(results.name);
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
        openOuter(item){
            let self=this;
            console.log(item);
            if(item!=null){
                self.showOuter=true;
                self.checkImgSrc=item.src;
            }
        },
        deleteImg(item,index){
            let self=this;
            self.sourceList.splice(index,1);
        },
        async submit(){
            let self=this;
            if(self.eventName.trim().length==0){
              self.showEventNameInfo = true;
                // self.notify(self.$t('storeMonitor.emptyTitle'),'warning',3000);
                return false;
            }
            if(self.corEvent && self.eventDes.trim().length == 0){
              self.showEventDescInfo = true;
              return false;
            }
            let params = {};
            params.storeId = self.store.storeId;
            //上传文件时获取门店对应的BucketName
            await getStorageInfo(params).then(res=>{
              if(res.errCode==0){
                self.oss = res.data;
                console.log(self.oss)
              }
            })
            let tempFileUrl=[];
            for(let i=0;i<self.sourceList.length;i++){
                let obj={};
                if(self.sourceList[i].mediaType==2){
                    let url=await self.upLoadFile(self.sourceList[i]);
                    obj.mediaType=2;
                    obj.url=url;
                    obj.deviceId=self.channel.id;
                }
                else if(self.sourceList[i].mediaType==1){
                    let url=await self.upLoadFile(self.sourceList[i]);
                    obj.mediaType=1;
                    obj.url=url;
                    obj.deviceId=self.channel.id;
                }
                tempFileUrl.push(obj);
            }
            let eventIds=[];
            eventIds.push(self.curEvent);
            self.fullscreenLoading=true;
            let isSuccess=false;
            if(self.evBtns[0].isActive){
                let commentobj={
                    ts:new Date().getTime(),
                    description:self.eventDes.trim(),
                    attachment:tempFileUrl,
                    status:0
                };
                let curTs=util.getCurDate2StrBySign('/');
                let obj={};
                obj.ts=new Date().getTime();
                obj.subject=self.eventName.trim();
                obj.storeId=self.store.storeId;
                obj.deviceId=self.channel.id;
                obj.comment=commentobj;
                let params=obj;
                addEvent(params).then(res=>{
                    self.fullscreenLoading=false;
                    console.log(res.data)
                    let notifiedTo=res.data.notifiedTo;
                    if(res.errCode==0){
                        isSuccess=true;
                    }
                    else{
                        isSuccess=false;
                    }
                    let routeData={
                        flag:{
                            addEventType:'add',
                            isSuccess:isSuccess,
                        },
                        store:{
                            storeId:self.store.storeId,
                            storeName:self.store.storeName,
                        },
                        channel:{
                            deviceId:self.channel.id,
                        },
                        event:{
                            eventIds:[],
                            eventName:self.eventName,
                            description:self.eventDes.trim(),
                            fileList:tempFileUrl
                        },
                        user:notifiedTo,
                        ts:curTs
                    }
                    sessionStorage.setItem('store_submit',JSON.stringify(routeData));
                    self.$router.push({name:"storeSubEvent",params:{data:routeData}});
                })
            }
            else{
                let obj={
                    eventIds:eventIds,
                    comment:{
                        ts:new Date().getTime(),
                        description:self.eventDes.trim(),
                        attachment:tempFileUrl,
                        status:0
                    }
                };
                let curTs=util.getCurDate2StrBySign('/');
                let params=obj;
                addComment(params).then(res=>{
                    self.fullscreenLoading=false;
                    if(res.errCode==0){
                        isSuccess=true;
                    }
                    else{
                        isSuccess=false;
                    }
                    let routeData={
                        flag:{
                            addEventType:'cor',
                            isSuccess:isSuccess,
                        },
                        store:{
                            storeId:self.store.storeId,
                            storeName:self.store.storeName,
                        },
                        channel:{
                            deviceId:self.channel.id,
                        },
                        event:{
                            eventIds:eventIds,
                            eventName:self.eventName,
                            description:self.eventDes.trim(),
                            fileList:tempFileUrl
                        },
                        ts:curTs
                    }
                    sessionStorage.setItem('store_submit',JSON.stringify(routeData));
                    self.$router.push({name:"storeSubEvent",params:{data:routeData}});
                })
            }
        },
        spreadContent(){
            let self=this;
            self.showSpread=true;
        },
        closeContent(){
            let self=this;
            self.showSpread=false;
        },
        cutPicture(...val){
            let self=this;
            self.showCancelContent=false;
            if(self.sourceList.length>=5){
                //self.notify('最多上传5个资源！','warning',3000);
                self.notify(self.$t('storeMonitor.maximumAttach'),'warning',3000);
                return false;
            }
            if(self.fullScreen){
                self.exitFullscreen();
                self.fullScreen=false;
            }
            self.showCutDialog=true;
            this.$nextTick(()=>{
                self.imageCanvasList=[];
                if(self.playBackState){
                    self.stopRealTime();
                    let video=document.getElementById('previewVideo');
                    self.cutDialogcurTime=video.player.currentTime();
                }
                self.videoEl=document.getElementById('previewVideo').children[0];
                self.canvasEl=document.getElementById('icanvas');
                var ctx = self.canvasEl.getContext('2d');
                ctx.drawImage(self.videoEl,0,0,767*self.percentHeight,431*self.percentHeight);
                var oGrayImg=self.canvasEl.toDataURL('image/jpeg');
                self.imageCanvas.src=oGrayImg;
                let imgObj=new Image();
                imgObj.src=oGrayImg;
                self.imageCanvasList.push(imgObj);
            })
        },
        showPenList(){
            let self=this;
            self.showPen=!self.showPen;
            self.showCancelContent=false;
        },
        checkPen(item,index){
            let self=this;
            item.showContent=true;
            self.showCancelContent=false;
            self.penList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.showContent=false;
                }
            })
            self.penChecked=item.id;
        },
        mouseDownAction(e){
           let self=this;
           self.isMouseDown=true;
           self.X=e.offsetX;
           self.Y=e.offsetY;
           self.showPenBtn=false;
           self.showCancelContent=false;
        },
        mouseMoveAction(e){
            let self=this;
            if(self.isMouseDown){
                self.X1=e.offsetX;
                self.Y1=e.offsetY;
                self.showPenBtn=false;
                self.drawLine(self.X,self.Y,self.X1,self.Y1);
                self.flag++;
            }
        },
        mouseUpAction(e){
            console.log(e)
            console.log(e.target.className)
            let self=this;
            self.isMouseDown=false;
            //self.showCutModel=true;
            self.showPenBtn=true;
            self.showCancelContent=true;  //每次鼠标弹起后显示可以取消的框

            if(self.flag!=0&&self.canvasEl!=''){
                let imgObj=new Image();
                imgObj.src=self.canvasEl.toDataURL("image/jpeg");
                self.imageCanvasList.push(imgObj);
            }
            self.flag=0;
            if(e.target.className == 'el-time-panel__btn confirm'){
              self.changeDate();
            }
        },
        mouseLeaveAction(e){
          console.log(e)
          let self=this;
          self.isMouseDown=false;
        },
        showCancel(){
            let self=this;
            self.showCancelContent=true;
            self.showPenBtn=true;
        },
        hiddenCancel(){
            let self=this;
            self.showCancelContent=false;
            self.showPenBtn=false;
        },
        cancleEditCanvas(){
            let self=this;
            self.showCancelContent=false;
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.clearRect(0,0,767*self.percentHeight,431*self.percentHeight);
            ctx.drawImage(self.imageCanvas,0,0,767*self.percentHeight,431*self.percentHeight);
            self.imageCanvasList=[];
        },
        confirmEditCanvas(){
            let self=this;
            self.showCancelContent=false;
            self.imageCanvasList.pop();
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.clearRect(0,0,767*self.percentHeight,431*self.percentHeight);
            if(self.imageCanvasList.length==0){
                ctx.drawImage(self.imageCanvas,0,0,767*self.percentHeight,431*self.percentHeight);
            }
            else{
                ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length-1],0,0,767*self.percentHeight,431*self.percentHeight);
            }
        },
        drawLine(x,y,x1,y1){
            let self=this;
            var ctx=self.canvasEl.getContext('2d');
            if(self.flag){
                ctx.beginPath();
            }
            ctx.moveTo(x,y);
            ctx.lineWidth=4;
            ctx.strokeStyle=self.penChecked;
            ctx.lineTo(x1,y1);
            ctx.stroke();
            if(self.flag!=0){
                self.X=self.X1;
                self.Y=self.Y1;
            }
        },
        closeEdit(){
            let self=this;
            // if(self.playBackState){
            //     let video=document.getElementById('previewVideo');
            //     console.log(self.cutDialogcurTime);
            //     video.player.currentTime(self.cutDialogcurTime);
            // }
        },
        cancelEdit(){
            let self=this;
            self.showCutDialog = false;
            // if(self.playBackState){
            //     let video=document.getElementById('previewVideo');
            //     console.log(self.cutDialogcurTime);
            //     video.player.currentTime(self.cutDialogcurTime);
            // }
        },
        confirmEdit(){
            let self=this;
            let img=new Image();
            let obj={};
            obj.mediaType=2;
            obj.src=self.canvasEl.toDataURL("image/jpeg");
            obj.height='100px';
            obj.width='140px';
            obj.fileName=self.bucketImage+'/'+'event'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.jpg';
            obj.file=util.base64ToBlob(obj.src);
            self.sourceList.push(obj);
            self.showCutDialog=false;
            self.myDivHeight();
            // if(self.playBackState){
            //     let video=document.getElementById('previewVideo');
            //     console.log(self.cutDialogcurTime);
            //     video.player.currentTime(self.cutDialogcurTime);
            // }
        },
        processInWebWorker(workerPath){
            var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
                type: 'application/javascript'
            }));

            var worker = new Worker(blob);
            URL.revokeObjectURL(blob);
            return worker;
        },
        convertStreams(blob){
            let self=this;
            //let  workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
            let  workerPath = './static/ffmpeg_asm.js';
            return new Promise((resolve,reject)=>{
                let worker=self.processInWebWorker(workerPath);
                let aab;
                var fileReader = new FileReader();
                fileReader.onload = function() {
                    aab = this.result;
                    postMessage();
                };
                fileReader.readAsArrayBuffer(blob);

                var postMessage = function() {
                    worker.postMessage({
                        type: 'command',
                        arguments: '-i video.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4'.split(' '),
                        files: [
                            {
                                data: new Uint8Array(aab),
                                name: 'video.webm'
                            }
                        ]
                    });
                };

                worker.onmessage=function(event){
                    var message=event.data;
                    if(message.type=='ready'){
                        console.log('realdy');
                    }
                    else if(message.type=='stdout'){
                        console.log('stdout');
                    }
                    else if(message.type=='start'){
                        console.log('start');
                    }
                    else if(message.type=='done'){
                        console.log('done');
                        var reslut=message.data[0];
                        var blobMp4=new File([result.data],'test.mp4',{
                            type:'video/mp4'
                        });
                        let blobRet=URL.createObjectURL(blobMp4);
                        resolve(blobRet);
                    }
                }
            })
        },
        addVideoToList(){
            let self=this;
            self.recorder.stopRecording(async function(){
                self.isRecordingStarted=false;
                self.isStoppedRecording=true;
                var blob =self.recorder.getBlob();
                //let blobRet= await self.convertStreams(blob);
                console.log(blobRet);
                let url=URL.createObjectURL(blob);
                var blobRet=new File([url],{type:'video/mp4'});
                var urlRet=URL.createObjectURL(blobRet);
                let obj={};
                obj.fileName=self.bucketImage+'/'+'event'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.webm';
                obj.file=blob;
                obj.mediaType=1;
                obj.src=url;
                obj.height='100px';
                self.sourceList.push(obj);
            })
        },
        getVideo(...val){
            let self=this;
            if(self.sourceList.length>=5){
                //self.notify('最多上传5个资源！','warning',3000);
                self.notify(self.$t('storeMonitor.maximumAttach'),'warning',3000);
                return false;
            }
            if(self.fullScreen){
                self.exitFullscreen();
                self.fullScreen=false;
            }
            self.showGetVideo=true;
            self.videoSpeed=0;
            self.videoEl=document.getElementById('previewVideo').children[0];
            self.$nextTick(()=>{
                self.startTimeCutVideo=new Date().getTime();
                self.computeFrame();
                self.looper();
                setTimeout(()=>{
                    var btn_canvas = document.getElementById("btn-graph-canvas");
                    self.drawMain(btn_canvas, 100, "#f31d65", "#f31d65");
                },1000)
            })
        },
        playCutVideo(item,index){
            let self=this;
            self.dialogCommentVideo=true;
            self.curVideoSrc=item.src;
        },
        looper(){
            let self=this;
            if(!self.isRecordingStarted){
                self.timeVideo=setTimeout(self.looper, 0);
            }
            else{
                self.endTImeCutVideo=new Date().getTime();

                if((self.endTImeCutVideo-self.startTimeCutVideo)/1000>11){
                    clearTimeout(self.timeVideo);
                    self.showGetVideo=false;
                    self.isRecordingStarted=false;
                    self.isREC=false;
                    setTimeout(()=>{
                        self.addVideoToList();
                    },100)
                }
                else{
                    self.isREC=true;
                    html2canvas(self.videoEl).then(function(canvas){
                        var ctx = self.canvasEl.getContext('2d');
                        let width=self.varyWindowWidth*0.418;
                        let height=self.varyWindowWidth*0.288;
                        ctx.clearRect(0, 0, width, height);
                        ctx.drawImage(self.videoEl,0,0,width,height);
                        if(self.isStoppedRecording) {
                            return;
                        }
                        requestAnimationFrame(self.looper);
                    })
                }
            }
        },
        computeFrame(){
            let self=this;
            self.canvasEl=document.getElementById('vcanvas');
            var ctx = self.canvasEl.getContext('2d');
            self.recorder = RecordRTC(self.canvasEl, {
                type: 'canvas'
            });
            self.isStoppedRecording =false;
            self.isRecordingStarted = true;
            self.recorder.startRecording();
        },
        drawMain(drawing_elem, percent, forecolor, bgcolor) {
            /*
                @drawing_elem: 绘制对象
                @percent：绘制圆环百分比, 范围[0, 100]
                @forecolor: 绘制圆环的前景色，颜色代码
                @bgcolor: 绘制圆环的背景色，颜色代码
            */
            let self=this;
            var context = drawing_elem.getContext("2d");
            var center_x = drawing_elem.width / 2;
            var center_y = drawing_elem.height / 2;
            var rad = Math.PI*2/100;


            // 绘制背景圆圈
            function backgroundCircle(){
                context.beginPath();
                context.lineWidth = 14; //设置线宽
                var radius = center_x - context.lineWidth;
                context.arc(center_x, center_y, radius, 0, Math.PI*2, false);
                context.fillStyle=bgcolor;
                context.globalAlpha = 0.5;
                context.fill();
            }

            //绘制运动圆环
            function foregroundCircle(n){
                context.save();
                context.strokeStyle = forecolor;
                context.globalAlpha = 1;
                context.lineWidth = 6;
                context.lineCap = "round";
                var radius = center_x - context.lineWidth;
                context.beginPath();
                context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
                context.stroke();
                context.closePath();
                context.restore();
            }

            //绘制文字
            function text(n){
                context.save();
                context.fillStyle='white';
                context.globalAlpha = 1;
                var font_size=self.btnFontSize;
                context.font='bold '+font_size+'px Helvetica';
                var textStr='';
                if(n==100){
                    if(self.lang == 'en'){
                      textStr= self.$t('storeMonitor.recordSucc').substring(0, 9) + '...' ;
                    }
                    else{
                      textStr= self.$t('storeMonitor.recordSucc');
                    }
                }
                else{
                    textStr= self.$t('storeMonitor.recording');
                }
                var text_width = context.measureText(textStr).width;
                context.fillText(textStr,center_x-text_width/2,center_y+font_size/2);
                context.restore();
            }
            //执行动画
            function drawFrame(speed){
                context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
                backgroundCircle();
                text(speed);
                foregroundCircle(speed);
                if(speed>=percent){
                    clearInterval(self.videoSpeedId);
                }
            }
            self.videoSpeedId=setInterval(() => {
                if(self.videoSpeed >= percent){
                    return;
                }
                else{
                    self.videoSpeed += 2;
                    drawFrame(self.videoSpeed);
                }
            }, 100);
        },

        async playVideo(url) {
            let self=this;
            console.log('playvideo enter!');
            self.playState=true;
            self.showCutContent=true;
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video,{playbackRates: [0.5, 1, 1.5, 2]});
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },
        noBindDeviceDialog(val){
            let self=this;
            self.noBindDeviceObj.dialogCosed=false;
        },
        canceldNoBind(val){
            let self=this;
            self.noBindDeviceObj.dialogCosed=false;
        },
        async realTime(...val){
            console.log(val);
            let self=this;
            if(self.channelBtns.length==0||self.channel.channelId.length==0){
               self.noBindDeviceObj.dialogCosed=true;
                return false;
            }
            self.isLoading = true;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            self.sessionId=sessionId;
            if(sessionId == null){
              self.isLoading = false;
              return
            }
            let data=null;
            let url='';
            if(self.timeid!=null){
                window.clearInterval(self.timeid);
                self.timeid=null;
                self.timeid=0;
            }
            window.clearInterval(self.timerPlayReal);
            self.realTimeSpeed=0;
            if(self.playBackState){ //播放历史视频
                self.curSpeed='1 X';
                self.curBack='';
                data= {
                    request: {
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:self.channel.ivsId,
                        channel:JSON.stringify(self.channel.channelId),
                        beginTime:(self.realTimeStartTs).toString(),
                        endTime:(self.realTimeStartTs+5*60+1).toString(),
                        streamType:'SubStream'
                    }
                };
                url=await dashAPI.playBack(1,data);
                if(url == null){
                  self.isLoading = false;
                  return;
                }
                if(url.ErrorCode==undefined&&url.length!=0){
                    setTimeout(()=>{
                      self.isLoading = false;
                    },1000);
                    self.timeid=window.setInterval(function(){  //播放视频的同时进度条进行
                        self.getProcess();
                    },1000);
                }
            }
            else{   //播放实时视频
                data = {
                    request: {
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:self.channel.ivsId,
                        channel:JSON.stringify(self.channel.channelId),
                        streamType:'SubStream'
                    }
                };
                url=await dashAPI.RealTime(1,data);
            }
            self.mpdurl = url;
            console.log(self.mpdurl);
            if(self.mpdurl == null){
              self.isLoading = false;
              return;
            }
            if (self.mpdurl.ErrorCode==undefined&&self.mpdurl.length!=0) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
                setTimeout(()=>{
                  self.isLoading = false;;
                },1000);
              if(!self.playBackState){
                    self.isPlayingFlag=1;
                    self.timerPlayReal=window.setInterval(()=>{
                        self.realTimeSpeed=self.realTimeSpeed+1;
                    },1000);
                }
            }
            else{   //当前视频如果返回失败，需处于暂停状态
                self.playState=false;
                self.showModelContent=false;
                self.isLoading = false;
                console.log(self.mpdurl.ErrorCode);
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
            }
        },
        stopVideo(){
            let self=this;
            self.playState=false;
            self.showCutContent=false;
            var video = document.getElementById("previewVideo");
            self.previewplayer = videojs(video);
            self.previewplayer.pause();
            window.clearInterval(self.timeid);
            self.timeid=null;
            self.timeid=0;
            window.clearInterval(self.timerPlayReal);
        },
        async stopRealTimeVisPage(){
            let self=this;
            self.stopVideo();
            const data = {
                request: {
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            let ret=await dashAPI.RealTime(0,data);
            await dashAPI.Offline(self.sessionId);
        },
        async stopRealTime(...val){
            console.log(val);
            let self=this;
            self.stopVideo();
            const data = {
                request: {
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            if(self.playBackState){
                let ret=await dashAPI.playBack(0,data);
                await dashAPI.Offline(self.sessionId);
            }
            else{
                let ret=await dashAPI.RealTime(0,data);
                await dashAPI.Offline(self.sessionId);
                self.isPlayingFlag=-1;
            }
        },
        async stopHDash(){
            let self=this;
            const data = {
                request: {
                    method: 'disconnection',
                    sessionID: self.sessionId,
                    IVSID:self.channel.ivsId,
                    channel:JSON.stringify(self.channel.channelId),
                    streamType:'SubStream'
                }
            };
            self.stopVideo();
            let ret=await dashAPI.playBack(0,data);
            await dashAPI.Offline(self.sessionId);
        },
        async getProcess(){
            let self=this;
            let video=document.getElementById('previewVideo');
            let curTime=video.player.currentTime();
            let duration=300;
            self.durationTimeValue=duration;
            self.currentTimeValue=curTime;
            console.log(curTime);
            console.log(self.startTs);
            self.realTimeStartTs ++;
            console.log(self.realTimeStartTs)
            let getTimeStr=function(val){
                let hour=0;
                let minute=0;
                let second=0;
                hour=parseInt(val/3600);
                minute=parseInt((val-hour*60)/60)<10?'0'+parseInt((val-hour*60)/60):parseInt((val-hour*60)/60);
                second=parseInt(val%60)<10?'0'+parseInt(val%60):parseInt(val%60);
                return hour+':'+minute+':'+second;
            }
            self.currentStr=getTimeStr(curTime);
            self.durationStr=getTimeStr(duration);
            if(curTime>=duration){
                self.stopHDash();
                //self.startTs=self.startTs+5*60;
                window.clearInterval(self.timeid);
                self.timeid=null;
                self.timeid=0;
            }
        },
        adjustSpeed(val){
            console.log(val);
            let self=this;
            let video=document.getElementById('previewVideo');
            switch(val){
                case 0:video.player.playbackRate(0.25);break;
                case 1:video.player.playbackRate(0.5);break;
                case 2:video.player.playbackRate(1);break;
                case 3:video.player.playbackRate(2);break;
                case 4:video.player.playbackRate(4);break;
            }
            video.playbackRate=val;
        },
        async adjustProcess(val, label){
            console.log(val);
            let self = this;
            self.curBack = label;
            let video=document.getElementById('previewVideo');
            let curTime=video.player.currentTime();
            console.log(curTime);
            let time = parseInt(self.currentTimeValue);
            console.log(self.realTimeStartTs);
            console.log(time);
            // self.startTs=self.startTs+ time;
            switch(val){
                case 0: {
                    self.realTimeStartTs = self.realTimeStartTs - 10;
                    if(curTime > 10){
                      video.player.currentTime(curTime-10);
                    }
                    else{
                      console.log(self.realTimeStartTs);
                      self.stopAndAdjustProcessHistoryVideo();
                    }
                    break;
                }
                case 1: {
                  self.realTimeStartTs = self.realTimeStartTs - 30;
                  if(curTime > 30){
                    video.player.currentTime(curTime-30);
                  }
                  else{
                    console.log(self.realTimeStartTs);
                    self.stopAndAdjustProcessHistoryVideo();
                  }
                  break;
                }
                case 2: {
                  self.realTimeStartTs = self.realTimeStartTs - 60;
                  if(curTime > 60){
                    video.player.currentTime(curTime-60);
                  }
                  else{
                    console.log(self.realTimeStartTs);
                    self.stopAndAdjustProcessHistoryVideo();
                  }
                }
                break;
            }
          //self.stopAndAdjustProcessHistoryVideo();
        },
        controlScreen(){
            let self=this;
            if(!self.fullScreen){
                self.fullWindowScreen();
                self.fullScreen=true;
            }
            else{
                self.exitFullscreen();
                self.fullScreen=false;
            }
        },
        //进入全屏
        fullWindowScreen(...val) {
            console.log(val);
            let self=this;
            var ele = document.getElementById('videoContent');
            ele.style.width = "100%";
            ele.style.height = "100%";
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            }
            else if (ele .mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            }
            else if (ele .webkitRequestFullScreen) {
                ele.webkitRequestFullScreen();
            }
            else if(ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            }
        },
        //退出全屏
        exitFullscreen() {
            var de = document;
            var ele = document.getElementById('videoContent');
            ele.style.width = "auto";
            ele.style.height = "auto";
            if (de.exitFullscreen) {
                de.exitFullscreen();
            }
            else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            }
            else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        gonggeScreen(){
            let self=this;
            self.showgongge=true;
        },
        recoverScreen(){
            let self=this;
            self.showgongge=false;
        },
        searchStore(){
            let self=this;
            let tempStoreList=self.tempStoreList;
            let getStore2Temp=data=>{
                let cityList=[];
                data.forEach(item=>{
                    if(cityList.map(x=>x.city).indexOf(item.city)==-1){
                        let obj={
                            city:item.city,
                            province:item.province
                        }
                        cityList.push(obj);
                    }
                })
                let storeListTemp=[];
                for(let i=0;i<cityList.length;i++){
                    let temp=[];
                    let obj={};
                    for(let j=0;j<data.length;j++){
                        if(cityList[i].city==data[j].city){
                            let obj={};
                            if(self.store.storeId==data[j].storeId){
                                obj.isActive=true;
                            }
                            else{
                                obj.isActive=false;
                            }
                            obj.storeId=data[j].storeId;
                            obj.name=data[j].name;
                            obj.userId=data[j].userId;
                            obj.city=data[j].city;
                            obj.province=data[j].province;
                            obj.favorite=data[j].favorite==undefined?true:data[j].favorite;
                            obj.device=data[j].device;
                            temp.push(obj);
                        }
                    }
                     obj.cityName=cityList[i].province+' '+cityList[i].city;
                    obj.storeList=temp;
                    storeListTemp.push(obj);
                }
                return storeListTemp;
            }
            let temp=[];
            let tempArray=[];
            let tempStore=[];
            tempStoreList.forEach((_item,_index)=>{
                _item.storeList.forEach((itemDs,indexDs)=>{
                    temp.push(util.getPinyinList(itemDs.name));
                    tempStore.push(itemDs);
                })
            })
            for(var i=0;i<temp.length;i++){
                if(temp[i][0].indexOf(self.serachVale.trim())!=-1||
                    temp[i][1].indexOf(self.serachVale.trim())!=-1){
                    tempArray.push(tempStore[i]);
                }
            }
            self.tabList[2].storeList=getStore2Temp(tempArray);
        },
        handleClick(tab){
            let self=this;
            self.getStoreList();
        },
        clearTheEventInfo(){
            let self=this;
            self.evBtns[0].isActive=true;
            self.evBtns[1].isActive=false;
            self.eventName='';
            self.eventDes='';
            self.sourceList=[];
            self.curSpeed='1 X';
            self.curBack='';
        },
        async changeStore(item,index,_item,_index){
            let self=this;
            _item.isActive=true;
            self.clearTheEventInfo();
            self.showModelContent=true;
            let obj={};
            obj.storeId=_item.storeId;
            obj.storeName=_item.name;
            obj.storeTitle=_item.name;
            obj.storeUp=_item.favorite;
            obj.userName=_item.userName;
            //切换门店的时候暂停当前播放的视频
            if(_item.favorite){
                obj.storeUpTitle = this.$t('storeMonitor.stared');
            }
            else{
                obj.storeUpTitle= this.$t('storeMonitor.clickToStar');
            }
            self.store=obj;
            let tabIndex=Number(self.activeIndex);
            let curStoreId='';
            if(tabIndex!=2){
                item.storeList.forEach((itemS,indexS)=>{
                    if(_index!=indexS){
                        itemS.isActive=false;
                    }
                })
                curStoreId=_item.storeId;
            }
            else{
                item.storeList.forEach((itemS,indexS)=>{
                    itemS.storeList.forEach((itemChild,indexChild)=>{
                        if(itemChild.storeId!=_item.storeId){
                            itemChild.isActive=false;
                        }
                        else{
                            curStoreId=itemChild.storeId;
                        }
                    })
                })
            }
            let storeObj={
                storeId:curStoreId
            };
            self.saveStoreObj(storeObj);
            self.getChannelByStore(_item);
        },
        saveStoreObj(storeObj){
            let self=this;
            let key='recentStore_storeMonitor'+'_'+self.accountId+'_'+self.userId;
            let temp=[];
            if(localStorage.getItem(key)!=null||localStorage.getItem(key)!=undefined){
                temp=JSON.parse(localStorage.getItem(key));
            }
            temp.forEach((item,index)=>{
                if(item.userId==storeObj.userId&&item.storeId==storeObj.storeId){
                    temp.splice(index,1);
                }
            })
            temp.unshift(storeObj);
            temp=temp.slice(0,3);
            localStorage.setItem(key,JSON.stringify(temp));
        },
        getStoreObj(){
            let self=this;
            let key='recentStore_storeMonitor'+'_'+self.accountId+'_'+self.userId;
            let temp=[];
            let tempArray=[];
            if(localStorage.getItem(key)!=null||localStorage.getItem(key)!=undefined){
                temp=JSON.parse(localStorage.getItem(key));
            }
            let indexArray=[];
            temp.forEach((item,index)=>{
                indexArray.push(self.allInitStoreList.map(x=>x.storeId).indexOf(item.storeId));
            })
            console.log(indexArray);
            indexArray=indexArray.filter(function(x){
                return x!=-1
            })
            indexArray.forEach(item=>{
                tempArray.push(self.allInitStoreList[item]);
            })
            return tempArray;
        },
        changeStoreDialog(){
            let self=this;
            self.changeStoreObj.dialogCosed=false;
            if(self.curStoreItem.userId==null){
                self.noStoreUser.dialogCosed=true;
            }
            else{
                self.changeStore(self.curTabItem,self.curTabIndex,self.curStoreItem,self.curStoreIndex);
            }
        },
        canceldChangeStore(){
            let self=this;
            self.changeStoreObj.dialogCosed=false;
        },
        cancelNoUser(){
            let self=this;
            self.noStoreUser.dialogCosed=false;
        },
        noStoreUserDialog(){
            let self=this;
            self.noStoreUser.dialogCosed=false;
            self.changeStore(self.curTabItem,self.curTabIndex,self.curStoreItem,self.curStoreIndex);
        },
        clickStore(item,index,_item,_index){
            let self=this;
            if(self.isLoading || (self.isEzviz && self.$refs.ezvizVideo.isLoading)){
              self.videoLoadingObj.dialogCosed = true;
              return false;
            }
            self.showStoreUp=true;

            self.curTabIndex=index;
            self.curTabItem=item;
            self.curStoreIndex=_index;
            self.curStoreItem=_item;
            if( (!self.isEzviz && (self.playState || self.eventName.length!=0 )) || self.isEzviz && (self.$refs.ezvizVideo.playState || self.eventName.length!=0)){
              self.changeStoreObj.dialogCosed=true;
            }
            else{
                //self.changeStore(item,index,_item,_index);
                if(_item.userId==null){
                    self.noStoreUser.dialogCosed=true;
                }
                else{
                    self.changeStore(item,index,_item,_index);
                }
            }
        },
        getChannelByStore(storeItem){
            let self=this;
            let temp=[];
            self.hideLast=false;
            self.hideNext=false;
            //切换门店时暂停播放之前播放的视频，并自动播放当前门店下第一个通道的视频
            if(!self.isEzviz){
              if(self.playState){
                self.stopRealTime();
              }
            }
            else{
              if(self.$refs.ezvizVideo.playState){
                self.$refs.ezvizVideo.stopRealTime();
              }
            }
            storeItem.device.forEach((item,index)=>{
                let obj={};
                obj.id=item.id;
                obj.name=item.name;
                obj.ivsId=item.ivsId;
                obj.channelId=item.channelId;
                obj.isonline=true;
                if(index==0){
                    obj.isClick=true;
                    self.channel={
                        id:item.id,
                        ivsId:item.ivsId,
                        channelId:item.channelId,
                        channelName:item.name
                    }
                }
                else{
                    obj.isClick=false;
                }
                temp.push(obj);
            })
            self.channelBtns=temp;
            self.allChannelBtns = temp;
            self.getshowBtns(temp);
        },
        getshowBtns(list){
            let self=this;
            let width=document.getElementsByClassName('btn-content')[0].offsetWidth;
            let detailsWidth=window.innerWidth/1440*15+60;
            let count=parseInt(width/detailsWidth); //当前容器最大可显示数量
            if(count>=list.length){
                self.showChannelBtns=list;
            }
            else{
                self.showChannelBtns=list.slice(0,count);
            }
            if(count<self.channelBtns.length){
                self.hideNext=true;
            }
            else{
              self.hideNext=false;
            }
        },
        async stopAndRealTime(){
            let self=this;
            self.isLoading = true;
            self.stopVideo();
            const dataDis = {
                request: {
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            let url='';
            if(self.timeid!=null){
                window.clearInterval(self.timeid);
                self.timeid=null;
                self.timeid=0;
            }
            window.clearInterval(self.timerPlayReal);
            self.realTimeSpeed=0;
            if(self.playBackState){
                self.realTimeStartTs = self.startTs;
                let ret=await dashAPI.playBack(0,dataDis);
                await dashAPI.Offline(self.sessionId);
                let sessionId= await dashAPI.Online();
                self.sessionId=sessionId;
                if(sessionId == null){
                  self.isLoading = false;
                  return;
                }
                let data=null;
                data= {
                    request: {
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:self.channel.ivsId,
                        channel:JSON.stringify(self.channel.channelId),
                        beginTime:self.curTime.getTime().toString().substr(0,10),
                        endTime:(self.curTime.getTime()+(5*60+1)*1000).toString().substr(0,10),
                        streamType:'SubStream'
                    }
                };
                url=await dashAPI.playBack(1,data);
            }
            else{
                let ret=await dashAPI.RealTime(0,dataDis);
                await dashAPI.Offline(self.sessionId);
                let sessionId= await dashAPI.Online();
                self.sessionId=sessionId;
                if(sessionId == null){
                  self.isLoading = false;
                  return;
                }
                let data=null;
                data = {
                    request: {
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:self.channel.ivsId,
                        channel:JSON.stringify(self.channel.channelId),
                        streamType:'SubStream'
                    }
                };
                url=await dashAPI.RealTime(1,data);
            }
            self.mpdurl = url;
            if(self.mpdurl == null){
              self.isLoading = false;
              return;
            }
            console.log(self.mpdurl);
            if (url.ErrorCode==undefined&&url.length!=0) {
                self.playVideo(self.mpdurl);
                setTimeout(()=>{
                  self.isLoading = false;;
                },1000);
                if(self.playBackState){ //播放历史视频时，启动计时器
                    self.timeid=window.setInterval(function(){  //播放视频的同时进度条进行
                        self.getProcess();
                    },1000);
                }
                else{
                    self.isPlayingFlag=1;
                    self.realTimeSpeed=0;

                    self.timerPlayReal=window.setInterval(()=>{
                        self.realTimeSpeed=self.realTimeSpeed+1;
                    },1000);
                }
            }
            else{
                self.playState=false;
                self.showModelContent=false;
                self.isLoading = false;
                console.log(self.mpdurl.ErrorCode);
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
            }
        },
        changeChannel(item,index){
            let self=this;
            self.showModelContent=true;
            self.clearTheEventInfo();
            if(item.isonline){
                item.isClick=true;
                let obj={
                    id:item.id,
                    ivsId:item.ivsId,
                    channelId:item.channelId,
                    channelName:item.name
                }
                self.channel=obj;
            }
            else{
                return false;
            }
            self.showChannelBtns.forEach((_item,_index)=>{
                if(_index!=index){
                    _item.isClick=false;
                }
            })
            if(!self.isEzviz){
              if(self.playState){ //切换前处于播放状态
                self.stopAndRealTime();
              }
              else{
                self.realTime(); //播放当前通道对应的视频(ivsId,channelId)
              }
            }
            else{
              //萤石云处理
              // if(self.$refs.ezvizVideo.playState){ //切换前处于播放状态
              //   self.$refs.ezvizVideo.stopRealTime();
              //   self.$refs.ezvizVideo.realTime();
              // }
              // else{
              //   self.$refs.ezvizVideo.realTime(); //播放当前通道对应的视频(ivsId,channelId)
              // }
            }
        },
        getIndexById(id){
            let self=this;
            let curIndex=0;
            self.channelBtns.forEach((item,index)=>{
                if(item.id==id){
                    curIndex=index;
                }
            })
            return curIndex;
        },
        lastBar(){
            let self=this;
            let width=document.getElementsByClassName('btn-content')[0].offsetWidth;
            let detailsWidth=window.innerWidth/1440*15+60;
            let count=parseInt(width/detailsWidth);
            if(count>=self.channelBtns.length){
                return false;
            }
            else{
                let index=self.getIndexById(self.showChannelBtns[0].id);
                self.showChannelBtns.unshift(self.channelBtns[index-1]);
                self.showChannelBtns.pop();
                self.showChannelBtns.forEach((item,index)=>{
                    if(item.id==self.channel.id){
                        item.isClick=true;
                    }
                    else{
                        item.isClick=false;
                    }
                })
                if(self.showChannelBtns[0].id==self.channelBtns[0].id){
                    self.hideLast=false;
                }
                if(self.showChannelBtns[count-1].id!=self.channelBtns[self.channelBtns.length-1].id){
                    self.hideNext=true;
                }
            }
        },
        nextBar(){
            let self=this;
            let width=document.getElementsByClassName('btn-content')[0].offsetWidth;
            let detailsWidth=window.innerWidth/1440*15+60;
            let count=parseInt(width/detailsWidth);
            if(count>=self.channelBtns.length){
                return false;
            }
            else{
                let index=self.getIndexById(self.showChannelBtns[count-1].id);
                self.showChannelBtns.push(self.channelBtns[index+1]);
                self.showChannelBtns.shift();
                self.showChannelBtns.forEach((item,index)=>{
                    if(item.id==self.channel.id){
                        item.isClick=true;
                    }
                    else{
                        item.isClick=false;
                    }
                })
                if(self.showChannelBtns[0].id!=self.channelBtns[0].id){
                    self.hideLast=true;
                }
                if(self.showChannelBtns[count-1].id==self.channelBtns[self.channelBtns.length-1].id){
                    self.hideNext=false;
                }
            }
        },
        changeChannelDialog(){
            let self=this;
            self.changeChannelObj.dialogCosed=false;
            self.changeChannel(self.curChannelItem,self.curChannelIndex);
        },
        cancelchangeChannel(){
            let self=this;
            self.changeChannelObj.dialogCosed=false;
        },
        clickBtn(item,index){
            let self=this;
            if(self.isLoading || (self.isEzviz && self.$refs.ezvizVideo.isLoading)){
              self.videoLoadingObj.dialogCosed=true;
              return false;
            }
            self.curChannelItem=item;
            self.curChannelIndex=index;
            if(self.eventName.trim().length!=0){
                self.changeChannelObj.dialogCosed=true;
            }
            else{
                self.changeChannel(item,index);
            }
        },
        /**
         * 时间日期控制区域
         */
        backCurDate(){
            let self=this;
            self.dateValue = new Date();
            self.curTime=new Date();  //点击回到当前时间，首先时间控件恢复，选择的日期回到当前日期，停止播放历史视频。
            self.playBackState=false;
            self.showModelContent=true;
            self.curYear=new Date().getFullYear();
            self.curMonth=new Date().getMonth()+1;
            self.getWeekDay();
            if(!self.isEzviz){
              if(self.store.storeId!=undefined){
                if(self.playState){
                  self.stopAndRealTime();
                }
                else{
                  self.realTime();
                }
              }
            }
            else{
              //萤石云
              self.playBackTime = 0;
              self.$refs.ezvizVideo.changeHistoryTime(self.playBackTime);
            }
        },
        forWard(){
            let self=this;
            if(self.curMonth==1){
                self.curMonth=12;
                self.curYear--;
            }
            else{
                self.curMonth--;
            }
            self.getWeekDay();
        },
        backWard(){
            let self=this;
            let year=new Date().getFullYear();
            let month=new Date().getMonth()+1;
            if(self.curYear==year&&self.curMonth==month){
                return false;
            }
            if(self.curMonth==12){
                self.curMonth=1;
                self.curYear++;
            }
            else{
                self.curMonth++;
            }
            self.getWeekDay();
        },
        getWeekDay(){
            let self=this;
            let curWeek=util.getDateCurMonth(self.curYear,self.curMonth);
            let dayNum=util.getDayNum(self.curYear,self.curMonth);
            let forWardMonth=(self.curMonth==1?12:self.curMonth-1);
            let forWardYear=(self.curMonth==1?self.curYear-1:self.curYear);
            let forWardDayNum=util.getDayNum(forWardYear,forWardMonth);
            let datenew=new Array(42);
            let indexTemp=0;
            let temp=[];
            let today=new Date().getDate();
            let curMonth=new Date().getMonth()+1;
            if(curWeek==0){
                curWeek=7;
            }
            for(let i=0;i<datenew.length;i++){
                let obj={};
                obj.showBack=false;

                if(i<curWeek){
                    obj.showOp=true;
                    obj.data=forWardDayNum-(curWeek-1-i);
                    datenew[i]=forWardDayNum-(curWeek-1-i);
                }
                else if(i==curWeek){
                    obj.showOp=false;
                    obj.data=1;
                    datenew[i]=1;
                }
                else{
                    datenew[i]=1+(i-curWeek);
                    if(datenew[i]==dayNum){
                        indexTemp=i;
                    }
                    obj.showOp=false;

                    obj.data=datenew[i]=1+(i-curWeek);
                }
                temp.push(obj);
            }
           // for(let i=0;i<datenew.length;i++){
                // if(i>indexTemp){
                    // console.log(indexTemp);
                    // datenew[i]=i-indexTemp;
            temp=temp.slice(1,indexTemp+1);
            //}
            // }
            var dateList=[];
            for(let i=0;i<temp.length;i+=7){
                dateList.push(temp.slice(i,i+7));
            }
            self.weekDays=dateList;
            self.weekDays.forEach((item,index)=>{
                item.forEach((_item,_index)=>{
                    if(_item.data==today&&curMonth==self.curMonth&&(index!=0||index==0&&_item.data<=7)){
                        _item.showBack=true;
                        self.curDayNum=today;
                        self.curMonthNum=self.curMonth;
                        self.curYearNum=self.curYear;
                    }
                    if(self.afterCurDate(index,_item)){
                        _item.disabed=true;
                    }
                    else{
                        _item.disabed=false;
                    }
                })
            })
        },
        myDivHeight(){
            let self=this;
            if(self.corEvent){
                let divLeft=document.getElementsByClassName('el-event')[0].offsetHeight;
                let divRight=document.getElementsByClassName('event-rside')[0].offsetHeight;
                let height=divLeft>divRight?divLeft:divRight;
                document.getElementById('rightLine').style.height=height+'px';
            }
        },
        checkFull(){
            var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if(isFull === undefined)
            {
                isFull = false;
            }
            return isFull;
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
      // 处理子组件发送过来的抓拍图片
      editEzvizCanvas(src){
        console.log('picture--'+ src)
        let self=this;
        let obj={};
        obj.mediaType=2;
        obj.src= src;
        obj.height='100px';
        obj.width='140px';
        obj.fileName=self.bucketImage+'/'+'event'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.jpg';
        obj.file=util.base64ToBlob(obj.src);
        self.sourceList.push(obj);
      },

      //处理子组件发送过来的录制视频
      confirmEzvizVideo(blob){
        console.log('video--')
        let self=this;
        console.log(blob)
        let url = URL.createObjectURL(blob);
        console.log(url)
        let obj = {};
        obj.fileName=self.bucketImage+'/'+'event'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.webm';
        obj.file= blob;
        obj.mediaType=1;
        obj.src= url;
        obj.height='100px';
        self.sourceList.push(obj);
      },
      videoLoadingDialog(){
        let self=this;
        self.videoLoadingObj.dialogCosed=false;
      },
      cancelVideoLoading(){
        let self=this;
        self.videoLoadingObj.dialogCosed=false;
      },
      eventNameChanged(val){
        let self = this;
        let content = filterString.standard(val,50);
        console.log(content);
        self.eventName = content;
        self.showEventNameInfo = false;
      },
      eventDesChanged(val){
        let self = this;
        let content = filterString.all(val,200);
        console.log(content);
        self.eventDes = content;
        self.showEventDescInfo = false;
      },
      onPlayerWaiting(e){
        console.log('video is loading')
        this.showCutContent = false
      },
      onPlayerPlaying(e){
        console.log('video is playing')
        this.showCutContent = true
      },
      searchChannel(){
          console.log('搜索通道')
          let self = this;
          let tempChannelList = self.allChannelBtns;
          let temp=[];
          let tempArray=[];
          let tempChannel=[];
          tempChannelList.forEach((_item,_index)=>{
            console.log(_item.name)
            temp.push(util.getPinyinList(_item.name));
            tempChannel.push(_item);
          })
          for(var i=0;i<temp.length;i++){
            if(temp[i][0].indexOf(self.serachChannelValue.trim())!=-1||
              temp[i][1].indexOf(self.serachChannelValue.trim())!=-1){
              tempArray.push(tempChannel[i]);
            }
          }
          self.channelBtns = tempArray;
          self.getshowBtns(tempArray);
        }
    },
    beforeDestroy() {
      let self = this;
      // 清除监听器
      document.removeEventListener('mouseup', self.mouseUpAction);
      window.removeEventListener('visibilitychange', self.visibilityChange);
      window.onresize = null;
      self.mouseUpAction = null;
      self.visibilityChange = null;
    },
  }
</script>
<style lang="scss" scoped>
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
    *{
        font-family: Roboto,Arial, Microsoft YaHei;
    }
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

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    .fadepen-enter-active,.fadepen-leave-active{
        transition: opacity .5s
    }
    .fadepen-enter, .fadepen-leave-to{
        opacity: 0;
    }
    .noeventClass{
        pointer-events: none;
    }
    .el-container{
        background-color: $background;
        .spreadLsideClass{
            width: 98%;
        }
        .liseAnmiClass{
            animation:lisdeAn 0.5s;
            -webkit-animation: lisdeAn 0.5s;
            animation-fill-mode:forwards;
        }
        @keyframes lisdeAn{
            from{
                width: 66.67%;
            }
            to{
                width: 100%;
            }
        }
        @-webkit-keyframes lisdeAn{
            from{
                width: 66.67%;
            }
            to{
                width: 100%;
            }
        }
        /*左侧视频区域css*/
        .lside{
            margin-right: calc(25/1920*100vw);
            border: 1px solid $border;
            background-color: #fff;
            .el-header-title{
                text-align: left;
                position: relative;
                height: 80px;
                line-height: 80px;
                border-bottom: 1px solid $border;
                padding-left: calc(25/1920*100vw);
                padding-right: calc(25/1920*100vw);
                .lside-title{
                    font-weight: bold;
                    color:$h1;
                }
                .nocoll{
                    border:1px solid #FF9803;
                }
                .coll{
                    border:1px solid #FF9803;
                    background-color: #FF9803;
                }
                .nocoll-icon{
                    color: #FF9803;
                    font-size: 14px;
                }
                .coll-icon{
                    color: #fff;
                    font-size: 14px;
                }
                .coll-font{
                    color: #fff;
                }
                .nocoll-font{
                    color: #FF9803;
                }
                 @media screen and(min-width: 1366px){
                    .lside-title{
                        font-size: 18px;
                    }
                    .storeUp-content{
                        height:26px;
                        width: 114px;
                        text-align: center;
                    }
                }
                @media screen and(max-width: 1366px){
                    .lside-title{
                        @include point(font-size,18);
                    }
                    .storeUp-content{
                        height:auto;
                        text-align: center;
                        width: 114px;
                    }
                }
                .storeUp-content{
                    display: inline-block;
                    margin-left: 20px;
                    padding: 0px 6px;
                    line-height: 20px;
                    position: relative;
                    bottom: 2px;
                    cursor: pointer;
                    span{
                        font-size: 12px;
                        vertical-align: middle;
                        margin-left: 4px;
                    }
                }
                .el-submit{
                    position: absolute;
                    right: calc(25/1920*100vw);
                    width: calc(130/1920*100vw);
                    color: #fff;
                    height: calc(36/1920*100vw);
                    line-height: calc(36/1920*100vw);
                    padding: 0 0;
                    border-radius: 3px;
                    font-size: calc(14/1920*100vw);
                    border: none;
                    top: 50%;
                    transform: translate(0, -50%);
                    outline: none;
                }
            }
            /*截图区域css*/
            #cancelBtn{
                @include point(width,76);
                @include point(margin-right,20);
                background-color: #EAEDF2 !important;
                color: #708090 !important;
                font-size: 12px;
                line-height: 12px;
                border-radius: 3px;
            }
            #confirmBtn{
                @include point(width,76);
                // margin-right: 15px;
                @include point(margin-right,20);
                font-size: 12px;
                line-height: 12px;
                border-radius: 3px;
            }
            .canvas-content{
                position: relative;
                #previewCutVideo{
                    @include point(margin-bottom,25);
                    @include point(margin-top,15);
                }
                #icanvas{
                    @include point(margin-top,15);
                }
                .dialog-img-content{
                    @include point(padding,15);
                }
                .dialog-hr{
                    border: 0.5px solid ;
                    border-color: #dfe2e9;
                    margin-bottom:0px;
                    position: relative;
                    bottom: 5px;
                    margin-top: 0;
                }
                .cancel-content{
                    position: absolute;
                    bottom: 2px;
                    @include point(height,30);
                    @include point(line-height,30);
                    background-color: rgba($color: $black, $alpha: 0.5);
                    z-index: 10;
                    overflow: hidden;
                    .content{
                        width: 50%;
                        text-align: center;
                        float: left;
                        color: #fff;
                        cursor: pointer;
                        &:first-child{
                            border-right: 1px solid #fff;
                        }
                        .icon-clear{
                            position: relative;
                            @include point(bottom,3);
                            margin-right: 15px;
                        }
                    }
                }
                .icon-right{
                    width: 80px;
                    height: auto;
                    position: absolute;
                    right: 30px;
                    top: 10%;
                    cursor: pointer;
                    .pen-btn{
                        width: 40px;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        cursor: pointer;
                    }
                    .content{
                        width: 100%;
                        height: 40px;
                        position: relative;
                        .color{
                            width: 16px;
                            height: 16px;
                            border-radius: 8px;
                            position: absolute;
                            margin: auto 0;
                            top: 4px;
                            left: 20%;
                            margin-left: 4px;
                            z-index: 3;
                            cursor: pointer;
                        }
                        .colorActive{
                            background-color: #ddd;
                            border-radius: 50%;
                            width: 24px;
                            height: 24px;
                            position: absolute;
                            margin: auto 0;
                            left: 20%;
                            z-index: 3;
                        }
                        #white{
                            background-color: white;
                        }
                        #yellow{
                            background-color: yellow;
                        }
                        #red{
                            background-color: red;
                        }
                    }
                }
            }
            /*video区域css*/
            .video-content{
                position: relative;
                margin: calc(25/1920*100vw);
                margin-bottom: 0;
                height: 420px;
                .getvideo-content{
                    position: absolute;
                    z-index: 930;
                    width: 100%;
                    height: 100%;
                    background-color: #000;
                    .btn-graph {
                        position: absolute;
                        left: 45%;
                        top: 45%;
                        display:flex;
                        display:-webkit-flex;
                        justify-content: center;
                        align-items: center;
                    }
                    #btn-graph-canvas {
                        width: 100px;
                        height: 100px;
                    }
                }
                #previewVideo{
                    //@include point(min-width,450);
                    //@include point(min-height,414);
                  min-height: 420px;
                }
                .errorVideo-model{
                    height: 100%;
                    width: 100%;
                    background-color: #232730;
                    color: $red;
                    position: absolute;
                    z-index: 900;
                    span{
                        position: relative;
                        top: 50%;
                        font-size: 12px;
                    }
                }
                .video-model{
                    height: 100%;
                    width: 100%;
                    background-color: transparent ;
                    position: absolute;
                    z-index: 900;
                    text-align: left;
                    @media screen and(max-width: 1366px){
                        #channelName{
                            font-size: 12px;
                        }
                    }
                    @media screen and(min-width: 1366px){
                        #channelName{
                            font-size: 16px;
                        }
                    }
                    #channelName{
                        display: block;
                        width: 100%;
                        padding-left: 30px;
                        color: #fff;
                        background-color: rgba($color: #24293d, $alpha: 0.6);
                        height: 40px;
                        line-height: 40px;
                    }
                    .progress-content{
                        position: absolute;
                        bottom: 0px;
                        width: 100%;
                        .el-prog{
                            float: left;
                            width: 100%;
                            .progress-bar{
                                background-color: $red;
                            }
                        }
                        .currentTime{
                            font-size: 12px;
                            color: #fff;
                            float: left;
                            margin-left: 30px;
                            position: relative;
                            bottom: 0.3rem;
                            margin-right: 10px;
                        }
                        .duration{
                            font-size: 12px;
                            color: #fff;
                            position: relative;
                            bottom: 0.5rem;
                            margin-left: 15px;
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
                        height: 46px;
                        line-height: 46px;
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
                        @media screen and(min-width:1366px){
                            .iconrside{
                                width: 70%;
                            }
                        }
                        @media screen and(max-width:1366px){
                            .iconrside{
                                width: 70%;
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
                    .iconright{
                        position: absolute;
                        right:20px;
                        height: 30%;
                        //top: 30%;
                        top: 40%;
                        .paizhao-content{
                            cursor: pointer;
                            margin-top: 30px;
                            width: 105px;
                            text-align: center;
                            border-radius: 4px;
                            background-color: rgba($color: #24293d, $alpha: 0.6);
                            padding: 4px;
                        }
                        .iconpaizhao{
                            color: #fff;
                            vertical-align:middle;
                        }
                        span{
                            color: #fff;
                            font-size: 12px;
                            margin-left: 15px;
                            vertical-align:middle;
                        }
                        .icon-drap-content{
                            height: 40px;
                            position: absolute;
                            right: 0px;
                            background-color: #34374A;
                            line-height: 40px;
                            .iconzhedie{
                                color: #ddd;
                                cursor: pointer;
                            }
                        }
                    }
                  .en-iconright{
                    position: absolute;
                    right:20px;
                    height: 30%;
                    /*top: 30%;*/
                    top: 40%;
                    .paizhao-content{
                      cursor: pointer;
                      margin-top: 30px;
                      width: 120px;
                      text-align: center;
                      border-radius: 4px;
                      background-color: rgba($color: #24293d, $alpha: 0.6);
                      padding: 4px;
                    }
                    .iconpaizhao{
                      color: #fff;
                      vertical-align:middle;
                    }
                    span{
                      color: #fff;
                      font-size: 12px;
                      margin-left: 15px;
                      vertical-align:middle;
                    }
                    .icon-drap-content{
                      height: 40px;
                      position: absolute;
                      right: 0px;
                      background-color: #34374A;
                      line-height: 40px;
                      .iconzhedie{
                        color: #ddd;
                        cursor: pointer;
                      }
                    }
                  }
                }
            }
            .video-gongge-content{
                width: 100%;
                height: auto;
                position: relative;
                margin-top: 20px;
                .video-details{
                    width: 49%;
                    height: auto;
                    position: relative;
                    display: inline-block;
                    margin-right: 1px;
                    .video-model{
                        height: 100%;
                        width: 100%;
                        background-color: transparent ;
                        position: absolute;
                        z-index: 990;
                        text-align: left;
                        .channelName{
                            display: block;
                            margin: 10px;
                            color: #fff;
                            font-size: 12px;
                        }
                        .icon-footer{
                            width: 96%;
                            position: absolute;
                            bottom: 0px;
                            color: #fff;
                            padding-left: 15px;
                            padding-bottom: 10px;
                            overflow: hidden;
                            user-select:none;
                            .iconlside{
                                width: 30%;
                                float: left;
                                text-align: left;
                                .iconplay{
                                    font-size: 18px;
                                    cursor: pointer;
                                }
                            }
                            .screen-content{
                                display: inline;
                                margin-left: 15px;
                                position: absolute;
                                right: 12px;
                                .iconscreen{
                                    margin: 8px;
                                    font-size: 16px;
                                    position: relative;
                                    top: 3px;
                                    cursor: pointer;
                                }
                            }
                        }
                        .iconright{
                            position: absolute;
                            right:0px;
                            height: 50%;
                            top: 25%;
                            .paizhao-content{
                                height: 20px;
                                margin-bottom: 15px;
                            }
                            span{
                                font-size: 13px;
                                margin-left: 15px;
                                color: #fff;
                                margin-right: 15px;
                                cursor: pointer;
                            }
                            .iconpaizhao{
                                color: #fff;
                                cursor: pointer;
                            }
                        }
                    }
                    .videos{
                        @include point(min-width,240);
                        @include point(min-height,205);
                    }
                }
            }
            /*新增问题区域css*/
            .el-event{
                text-align: left;
                border: 1px solid $border;
                overflow: hidden;
                margin: calc(25/1920*100vw);
                padding-left: calc(20/1920*100vw);
                margin-top: 0;
                @media screen and(max-width:1366px){
                    .cor-des{
                        font-weight: bold;
                        margin-left:10px !important;
                    }
                    .event-content{
                        padding-left: 10px;
                    }
                    .event-name{
                        margin-left: 10px;
                        font-size: 14px;
                        width: 75%;
                        display: inline-block !important;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                @media screen and(min-width:1366px){
                    .cor-des{
                        font-weight: bold;
                        margin-left:0px !important;
                    }
                    .event-content{
                        padding-left: 0px;
                    }
                    .event-name{
                        margin-left: 0px;
                        font-size: 12px;
                        width: 75%;
                        display: inline-block !important;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .event-title{
                    color: $black;
                    display: block;
                    margin: 15px;
                    margin-left: 20px;
                    font-size: calc(14/1920*100vw);
                }
                .is-required{
                  color: $red;
                }
                .cor-des{
                    font-weight: bold;
                }
                .el-radio-content{
                    margin-top: 10px;
                    .el-radio-details{
                        display: inline-block;
                        margin-left: calc(15/1920*100vw);
                        border: 1px solid #ddd;
                        padding:6px;
                        font-size: 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        padding: 8px;
                        text-align: center;
                        width: 120px;
                    }
                    .activeClass{
                        background-color: #FDE8EF !important;
                        color: $red;
                        border-color: $red !important;
                    }
                }
                .event-lside{
                    width: 60%;
                    float: left;
                    height: 460px;
                }
                .right-line{
                    width:1px;
                    min-height:340px;
                    position: relative;
                    top: 50px;
                    background-color:#e3e9f4;
                    float: left;
                    margin-right: 15px;
                }
                .lside-scrollbar{
                    height: 360px;
                }
                .event-rside{
                    position: relative;
                    top: 50px;
                    width:-webkit-calc(40% - 16px);
                    width:-moz-calc(40% - 16px);
                    width:calc(40% - 16px);
                    height: 360px;
                    float: right;
                    .event-content{
                        padding-bottom: 20px;
                        .event-details{
                            position: relative;
                           .radio-class{
                             width: calc(100% - 70px);
                           }
                            .event-name{
                                display: inline;
                            }
                            .event-date{
                                color: #94a4b4;
                                margin-left: 35px;
                                position: absolute;
                                right: 0px;
                                top: 0px;
                                width: 70px;
                                text-align: left;
                                line-height: 14px;
                                span{
                                    margin: 0;
                                    font-size: 12px;
                                }
                            }
                            .event-des{
                                font-size: 12px;
                                margin-left: 35px;
                                color: #94a4b4;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                width:80%;
                            }
                        }

                    }
                }
                .name-input{
                    @include point(width,260);
                    margin-left: 20px;
                }
                .error-class{
                  margin-left: 20px;
                  font-size: 10px;
                  margin-top: 5px;
                  color: #ff2400;
                  display: block;
                }
                .des-input{
                    width: 90%;
                    margin: auto 20px;
                    font-size: 12px;
                }
                .source-content{
                    min-height: 120px;
                    width: 90%;
                    margin: auto 20px;
                    span{
                        font-size: 12px;
                        color: #FCB83B;
                        margin: 15px 0;
                        display: block;
                    }
                    .source-details{
                        display: inline-block;
                        margin-right: 15px;
                        padding-top: 15px;
                        .img-content{
                            width: 100%;
                            height: 100%;
                            position: relative;
                        }
                        .icondelete{
                            position: absolute;
                            font-size: 14px;
                            right: 5px;
                            margin-top: 8px;
                            z-index: 2;
                            color: #fff;
                            cursor: pointer;
                            background-color: rgba($color: $black, $alpha: 0.8);
                            border-radius: 50%;
                        }
                        .start-icon{
                            position: absolute;
                            left: 35%;
                            top: 30%;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        /*右侧区域css*/
        .rside{
            border: 1px solid $border;
            background-color: #fff;
            //@include point(margin-right,20);
            @media screen and(max-width: 1366px){
                .el-header-title{
                    font-size: 14px;
                }
                .channel-content{
                    font-size: 14px;
                }
                #date-title{
                    font-size: 14px;
                }
            }
            @media screen and(min-width: 1366px){
                .el-header-title{
                    font-size: 16px;
                }
                .channel-content{
                    font-size: 16px;
                }
                #date-title{
                    font-size: 16px;
                }
            }
            .el-header-title{
                text-align: left;
                position: relative;
                color:$black;
                height: 80px;
                line-height: 80px;
                border-bottom: 1px solid $border;
                padding-left: calc(15/1920*100vw);
                span{
                    display: block;
                    margin-left: calc(30/1920*100vw);
                }
            }
            #storetab-content, #en-storetab-content{
                margin-top: 10px;
                padding-left: calc(20/1920*100vw);
                padding-right: calc(20/1920*100vw);
                height: 370px;
                .storeList-content{
                    text-align: left;
                    height: 345px;
                    .activeClass{
                        background-color: #FDE8EF !important;
                        color: $red;
                        border-color: $red !important;
                    }
                    .stores{
                        &:last-child{
                          margin-bottom: 25px;
                        }
                    }
                    .el-search-input{
                        width: calc(235/1920*100vw);
                        margin: calc(20/1920*100vw);
                        margin-top:calc(15/1920*100vw);
                    }
                    .store-name{
                        display: inline-block;
                        @include point(margin-left,15);
                        margin-top: 10px;
                        margin-bottom: 15px;
                        border: 1px solid #ddd;
                        text-align: center;
                        padding:6px;
                        font-size: 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        @include point(width,90);
                        @include point(padding,6);

                        span{
                            width: 100%;
                            display: block;
                            white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
                            overflow: hidden; //隐藏超出单元格的部分。
                            text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
                        }
                    }
                    .citys{
                        display: block;
                        font-size: 14px;
                        font-weight: bold;
                        color: $black;
                        @include point(margin-left,20);
                    }
                }
            }
            .rside-hr{
                width: 100%;
                margin-top: 35px;
                border: 0.5px solid $border;
            }
            .channel-content{
                width: 100%;
                overflow: hidden;
                margin-top: 10px;
                span{
                    display: block;
                    text-align: left;
                    margin-left: calc(40/1920*100vw);
                    color: $black;
                    margin-bottom: 20px;
                }
                .el-channel-search-input{
                  width: 70%;
                }
                .channels-srollbar{
                    text-align: left;
                    padding: 10px;
                    margin-left: 5%;
                    overflow: hidden;
                    min-height: 115px;
                }
                .arrow-content{
                    @include point(min-width,20);
                    min-height: 20px;
                    float: left;
                    margin-top: 20px;
                    width: 4%;
                }
                .icon-arrow{
                    cursor: pointer;
                }

                .btn-content{
                    width: 86%;
                    float: left;
                    display: flex;
                    .btn-details{
                        // width: 100px;
                        display: inline-block;
                        margin-bottom: 5px;
                        @include point(margin-left,15);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        &:last-child{
                            @include point(margin-right,15);
                        }
                    }
                }

            }
            .time-content{
                .time-title{
                  display: flex;
                  justify-content: space-between;
                  margin: 20px;
                  @include point(margin-left,30);
                  align-items: center;
                  .date-title{
                    display: block;
                    text-align: left;
                    color: $black;
                    @media screen and(max-width: 1366px){
                        font-size: 14px;
                    }
                    @media screen and(min-width: 1366px){
                        font-size: 16px;
                    }
                  }
                  .backTime-btn{
                    @include point(right,20);
                    font-size: 12px;
                    line-height: 12px;
                    border-radius: 3px !important;
                    width: 120px;
                    padding: 6px 0;
                    height: 28px;
                    outline: none;
                  }
                }
              .date-picker-content{
                margin: 0 auto;
                .date-picker.el-date-editor.el-input{
                  width: calc(180/1920*100vw);
                  margin-right: calc(20/1920*100vw);
                  min-width: 128px;
                }
                .time-picker.el-date-editor.el-input{
                  width: 120px;
                }
              }
              /**
                @media screen and (min-width: 1366px){
                    .date-picker-content{
                        text-align: left;
                        @include point(padding-left,20);
                        position: relative;
                        span{
                            font-size: 14px;
                            color: $black;
                            margin-right: 15px;
                            @include point(margin-left,30);
                        }
                        .time-picker{
                            width: 120px;
                        }
                        .backdate-btn{
                            position: absolute;
                            @include point(right,20);
                            font-size: 12px;
                            line-height: 12px;
                            border-radius: 3px !important;
                        }
                    }
                }
              @media screen and (max-width: 1440px){
                .date-picker-content{
                  text-align: left;
                  @include point(padding-left,10);
                  position: relative;
                  span{
                    font-size: 12px;
                    color: $black;
                    margin-right: 10px;
                    @include point(margin-left,10);
                  }
                  .time-picker{
                    width: 110px;
                    font-size: 12px;
                  }
                  .backdate-btn{
                    position: absolute;
                    @include point(right,10);
                    font-size: 12px;
                    line-height: 12px;
                    width: 120px;
                    padding: 6px 0;
                  }
                }
              }
                @media screen and (max-width: 1366px){
                    .date-picker-content{
                        text-align: left;
                        @include point(padding-left,10);
                        position: relative;
                        span{
                            font-size: 12px;
                            color: $black;
                            margin-right: 10px;
                            @include point(margin-left,10);
                        }
                        .time-picker{
                            width: 110px;
                            font-size: 12px;
                        }
                        .backdate-btn{
                            position: absolute;
                            @include point(right,10);
                            font-size: 12px;
                            line-height: 12px;
                            width: 120px;
                            padding: 6px 0;
                        }
                    }
                }
                .date-content{
                    text-align: center;
                    margin-top: 10px;
                    @include point(padding-left,25);
                    @include point(padding-right,25);
                    .date-header{
                        margin-bottom: 10px;
                        position: relative;
                        user-select: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        .icon-arrow{
                            font-size: 25px;
                            opacity: 0.2;
                            position: relative;
                            top: 4px;
                            cursor: pointer;
                        }
                        span{
                            font-size: 14px;
                            font-weight: bold;
                            @include point(margin,25);
                        }
                    }
                    .date-data{
                        text-align: left;
                        padding-left: 10px;
                        .date-title{
                            display: inline-block;
                            width: 14%;
                            position: relative;
                            @include point(left,10);
                            font-size: 12px;
                            margin-bottom: 15px;
                        }
                        .date-details{
                            margin-bottom: 8px;
                            .data{
                                width: 14%;
                                display: inline-block;
                            }
                            span{
                                display: block;
                                @include point(width,30);
                                @include point(height,30);
                                @include point(margin,3);
                                background-color: #fff;
                                @include point(line-height,30);
                                text-align: center;
                                font-size: 12px;
                                @include point(border-radius,18);
                                //cursor: pointer;
                            }
                            .disabedColor{
                                color:#C3D3EA;
                            }
                            .opColor{
                                background-color: $red !important;
                                color: #fff !important;
                            }
                            .noramlColor{
                                background-color: #fff;
                            }
                            .noramldColor{
                                color: #C3D3EA;
                                background-color: #F3F3F3;
                            }
                        }
                        .schedule-tag{
                            width: 16px;
                            height: 16px;
                            background-color: $red;
                            border-radius: 8px;
                            margin-top: 20px;
                            display: inline-block;
                        }
                    }
                }
              */
            }
        }
    }
</style>
<style scoped>
.el-test{
    width: 70px;
    position: relative;
    bottom: 5px;
}

</style>
<style>
.el-radio-button__inner{
    border-radius: 0px !important;
    width:90px;
}
.el-prog .progress-bar{
    background-color: #FB4C5D;
}
.el-test .el-input__inner{
    height: 24px;
    line-height: 24px;
    border-radius: 0px;
    background-color: #34374A;
    color: #fff;
    padding:0 10px;
    border: 0px;
}
.el-test .el-input__icon{
    line-height: 24px;
}
.select-popClass .el-select-dropdown__item{
    font-size:12px;
    height: 24px;
    line-height: 24px;
    background-color: #34374A;
    color:#fff;
    text-align:center;
}
.select-popClass .el-select-dropdown__item.hover{
    color:#f31d65 !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item:hover{
    color:#f31d65 !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown{
    border:0px !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item.selected{
    color:#fff;
    font-weight:500 !important;
}
.select-popClass .el-select-dropdown__list{
    padding:0;
}
.el-select-dropdown.el-popper.select-popClass{
    border:0px;
}
.select-popClass.el-popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color:#34374A !important;
}
.select-popClass.el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:#34374A !important;
}
</style>
<style scoped>
.el-search-input.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
    height: 32px !important;
    line-height:32px !important;
    padding-left:30px;
    color:#425262;
    letter-spacing: 0px;
    width: 235px;
    font-size: calc(14/1920*100vw);
}
.el-channel-search-input.el-search-input.el-input--small >>>.el-input__inner{
  width: 100%;
}
</style>

<style>
@import '../../assets/css/importfile.css';
@import '../../assets/css/videoBar.css';
@import '../../assets/css/tabsItem.css';
@import '../../assets/css/pagination.css';

    .el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .des-input .el-textarea__inner{
        font-family: Roboto, Arial, 'Microsoft YaHei';
    }
  /*::-webkit-scrollbar {*/
    /*width: 6px;*/
  /*}*/
  /*::-webkit-scrollbar-thumb {*/
    /*background-color:rgba(144, 147, 153, 0.3);*/
    /*border-radius: 4px;*/
    /*position: absolute;*/
    /*right: 2px;*/
    /*bottom: 2px;*/
    /*cursor:pointer;*/
  /*}*/
</style>
