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
                <el-button :class="lang== 'en' ? 'en-el-submit' :'el-submit'" :size="varyWindowWidth>1680?'small':'mini'" @click="submit1"  type="primary" v-if="showStoreUp">
                  {{generatePatrolLang('confirmSum')}}
                </el-button>
            </div>
            <el-dialog :title="generatePatrolLang('edit')"
            :visible.sync="showCutDialog" :close-on-click-modal="false" v-if="showCutDialog" :width="860*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
                    <hr class="dialog-hr"/>
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
                     <canvas id="icanvas"  :width="767*percentHeight" :height="431*percentHeight" @mousedown="mouseDownAction($event)"
                    @mousemove="mouseMoveAction($event)"></canvas>
                    <div class="cancel-content" v-if="showCancelContent" :style="{'width':767*percentHeight+'px',
                    'margin-left':47*percentHeight+'px'}">
                        <div class="content" @click="cancelEditCanvas">
                            <img :src="clearIconSrc" class="icon-clear" height="22px"/>
                            <span>{{generatePatrolLang('clear')}}</span>
                        </div>
                        <div class="content" @click="confirmEditCanvas">
                            <img :src="removeIconSrc" class="icon-clear" height="22px"/>
                            <span>{{generatePatrolLang('cancel')}}</span>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
                    <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog  :title="generatePatrolLang('view')" :visible.sync="dialogCommentVideo" :close-on-click-modal="false"
            v-if="dialogCommentVideo" :width="680*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content">
                    <hr class="dialog-hr"/>
                    <video  :width="580*percentHeight" :height="420*percentHeight" id="previewCutVideo" prload controls autoplay :src="curVideoSrc">
                    </video>
                </div>
            </el-dialog>
            <el-dialog :title="generatePatrolLang('view')"
                :visible.sync="showOuter" :close-on-click-modal="false" v-if="showOuter" :width="680*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="dialog-img-content">
                        <img :src="checkImgSrc" :width="600*percentHeight" :height="430*percentHeight"/>
                    </div>
                </div>
            </el-dialog>
            <el-dialog :title="generatePatrolLang('feedbacks')"
                :visible.sync="showFeedDialog1" :close-on-click-modal="false" v-if="showFeedDialog1" :width="480*percentHeight+'px'" top=12%>
                <div class="canvas-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="dialog-event-content">
                        <span class="event-title"><span class="is-required">*</span>{{generatePatrolLang('name')}}</span>
                        <el-input size="mini" class="name-input" @input="eventNameChanged" v-model="eventName" @blur="notShowInputRuleTips('eventName')"></el-input>
                        <span class="rules" v-if="eventNameRuletip">{{generatePatrolLang('eventNameRuletip')}}</span>
                        <span class="error-class" v-if="showEventNameInfo">{{$t('storeMonitor.emptyTitle')}}</span>
                        <span class="event-title">{{generatePatrolLang('description')}}</span>
                        <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 2, maxRows: 7}"
                                  @input="eventDesChanged" v-model="eventDes" :placeholder="generatePatrolLang('descPlaceholder')" @blur="notShowInputRuleTips('eventDes')"></el-input>
                        <span class="rules" v-if="eventDesRuletip">{{generatePatrolLang('comentRuletip')}}</span>
                    </div>
                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showFeedDialog1 = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
                    <el-button id="confirmBtn" @click="confirmAddFeedBack1" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="generatePatrolLang('feedbacks')"
            :visible.sync="showFeedDialog2" :close-on-click-modal="false" v-if="showFeedDialog2" :width="860*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="feed-canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
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
                        <canvas id="icanvas"  :width="520*percentHeight" :height="340*percentHeight" @mousedown="mouseDownAction($event)"
                        @mousemove="mouseMoveAction($event)"></canvas>
                        <div class="cancel-content" v-if="showCancelContent" :style="{'width':520*percentHeight+'px',
                        'margin-left':47*percentHeight+'px'}">
                            <div class="content" @click="cancelEditCanvas">
                                <img :src="clearIconSrc" class="icon-clear" height="22px"/>
                                <span>{{generatePatrolLang('clear')}}</span>
                            </div>
                            <div class="content" @click="confirmEditCanvas">
                                <img :src="removeIconSrc" class="icon-clear" height="22px"/>
                                <span>{{generatePatrolLang('cancel')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="event-content">
                        <span class="event-title"><span class="is-required">*</span>{{generatePatrolLang('name')}}</span>
                        <el-input size="mini" class="name-input" @input="eventNameChanged" v-model="eventName" @blur="notShowInputRuleTips('eventName')"></el-input>
                        <span class="rules" style="margin-left:0;" v-if="eventNameRuletip">{{generatePatrolLang('eventNameRuletip')}}</span>
                        <span class="error-class" v-if="showEventNameInfo">{{$t('storeMonitor.emptyTitle')}}</span>
                        <span class="event-title">{{generatePatrolLang('description')}}</span>
                        <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 4, maxRows: 7}"
                                  @input="eventDesChanged" v-model="eventDes" :placeholder="generatePatrolLang('descPlaceholder')" @blur="notShowInputRuleTips('eventDes')"></el-input>
                        <span class="rules" style="margin-left:0;"  v-if="eventDesRuletip">{{generatePatrolLang('comentRuletip')}}</span>
                    </div>
                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showFeedDialog2 = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
                    <el-button id="confirmBtn" @click="confirmAddFeedBack2" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="generatePatrolLang('feedbacks')"
            :visible.sync="showFeedDialog3" :close-on-click-modal="false" v-if="showFeedDialog3" :width="860*percentHeight+'px'" height=300px top=5%>
                <div class="canvas-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="feed-canvas-content" style="text-align:center">
                        <video  :width="520*percentHeight" :height="340*percentHeight" id="previewCutVideo" prload controls autoplay :src="feedBackVideoFileObj.src"></video>
                    </div>
                    <div class="event-content">
                        <span class="event-title">{{generatePatrolLang('name')}}</span>
                        <el-input size="mini" class="name-input" maxlength="10" v-model="eventName"></el-input>
                        <span class="event-title">{{generatePatrolLang('description')}}</span>
                        <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 4, maxRows:7}"
                        maxlength="300" v-model="eventDes" :placeholder="generatePatrolLang('descPlaceholder')"></el-input>
                    </div>
                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showFeedDialog3 = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
                    <el-button id="confirmBtn" @click="confirmAddFeedBack3" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
                </div>
            </el-dialog>

            <dialog-vue :dialog-title='changeStoreObj.title' :show-info='changeStoreObj.showInfo' :is-warning='changeStoreObj.isWarning' :dialog-closed='changeStoreObj.dialogCosed' @confirmed='changeStoreDialog' @canceled='canceldChangeStore'></dialog-vue>
            <dialog-vue :dialog-title='ignoreInspectObj.title' :show-info='ignoreInspectObj.showInfo' :is-warning='ignoreInspectObj.isWarning' :dialog-closed='ignoreInspectObj.dialogCosed' @confirmed='ignoreInspectDialog' @canceled='cancelIgnoreInspect'></dialog-vue>
            <dialog-vue :dialog-title='noBindDeviceObj.title' :show-info='noBindDeviceObj.showInfo' :is-warning='noBindDeviceObj.isWarning' :dialog-closed='noBindDeviceObj.dialogCosed' @confirmed='noBindDeviceDialog' @canceled='canceldNoBind'></dialog-vue>
            <dialog-vue :dialog-title='noAllInspectObj.title' :show-info='noAllInspectObj.showInfo' :is-warning='noAllInspectObj.isWarning' :dialog-closed='noAllInspectObj.dialogCosed' @confirmed='noAllInspectDialog' @canceled='canceldNoAllInspect'></dialog-vue>
            <dialog-vue :dialog-title='allIgnoreObj.title' :show-info='allIgnoreObj.showInfo' :is-warning='allIgnoreObj.isWarning' :dialog-closed='allIgnoreObj.dialogCosed' @confirmed='allIgnoreDialog' @canceled='cancelAllIgnore'></dialog-vue>
            <dialog-vue :dialog-title='noStoreUser.title' :show-info='noStoreUser.showInfo' :is-warning='noStoreUser.isWarning' :dialog-closed='noStoreUser.dialogCosed' @confirmed='noStoreUserDialog' @canceled='cancelNoUser'></dialog-vue>
            <dialog-vue :dialog-title='leaveObj.title' :show-info='leaveObj.showInfo' :is-warning='leaveObj.isWarning' :dialog-closed='leaveObj.dialogCosed' @confirmed='leaveDialog' @canceled='cancelLeave'></dialog-vue>
            <dialog-vue :dialog-title="videoLoadingObj.title" :show-info='videoLoadingObj.showInfo' :is-warning='videoLoadingObj.isWarning' :dialog-closed='videoLoadingObj.dialogCosed' @confirmed='videoLoadingDialog' @canceled='cancelVideoLoading'>></dialog-vue>
          <div class="guide-content" v-if="showGuide && inspectList.length > 0">
                <div class="guide-rside">
                    <div class="num-content">
                        <span class="guide-num">2</span>
                        <span class="guide-title">
                            {{generatePatrolLang('takeSnapshot')}}
                        </span>
                    </div>
                    <img :src="arrows2Src" alt="arrow2"/>
                    <div class="iconright-content">
                        <div :class="lang== 'en'? 'en-iconright' : 'iconright'">
                            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                            <span>{{generatePatrolLang('snapshot')}}</span>
                        </div>
                        <div :class="lang== 'en'? 'en-iconright' : 'iconright'" style="display: none">
                            <i class="iconfont icon-luxiang iconpaizhao" v-if="lang =='en' " style="font-size:21px;"></i>
                            <i class="iconfont icon-luxiang iconpaizhao" v-else style="font-size:21px"></i>
                          <span>{{generatePatrolLang('record')}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
              <div v-if="!isEzviz">
                <div class="errorVideo-model" v-if="showError">
                  <span>{{errorText}}</span>
                </div>
                <div class="video-content"  id="videoContent"
                     @mouseleave="hiddenModel" @mouseenter="showModel" @mousemove="showModel" v-else>
                  <div class="getvideo-content" v-if="showGetVideo">
                    <div class="btn-graph">
                      <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"></canvas>
                    </div>
                    <canvas id="vcanvas"  :width="varyWindowWidth*0.418+'px'" :height="varyWindowWidth*0.282+'px'"></canvas>
                  </div>
                  <span id="channelName" v-if="showInfoContent">{{channel!=null?channel.channelName:''}}</span>
                  <div class="icon-footer" v-if="showInfoContent">
                    <div class="iconlside">
                      <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="!playState"></i>
                      <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-else></i>
                    </div>
                    <div class="screen-content">
                      <i class="iconfont iconscreen"
                         :class="fullScreen?'icon-tuichuquanping':'icon-quanping'" @click="controlScreen"></i>
                      <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
                    </div>
                  </div>
                  <transition name='fade'>
                    <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showModelContent" @click="cutPicture">
                      <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                      <span>{{generatePatrolLang('snapshot')}}</span>
                    </div>
                  </transition>
                  <transition name="fade">
                    <div :class="lang== 'en'? 'en-iconright1' : 'iconright1'" v-if="showModelContent" @click="getVideo" style="display: none">
                      <i class="iconfont icon-luxiang iconpaizhao" v-if="lang =='en' " style="font-size:21px;margin-left: -15px;"></i>
                      <i class="iconfont icon-luxiang iconpaizhao" v-else style="font-size:21px"></i>
                      <span>{{generatePatrolLang('record')}}</span>
                    </div>
                  </transition>
                  <video  height=83% width=90% id="previewVideo" prload autoplay :controls="showControls" v-if="showVideo"
                          class="video-js vjs-fill" @waiting='onPlayerWaiting($event)' @playing="onPlayerPlaying($event)">
                  </video >
                </div>
              </div>
              <ezviz-video v-else :channel-info="channel" :source-list-length= "sourceListLength" :show-feed-back="showFeedBack"
                           :show-feed-dialog2="showFeedDialog2" :store-id="store.storeId"
                           @confirmEzvizCanvas="editEzvizCanvas" @ezvizCutPictureFeedback="ezvizPictureFeedback"  @confirmEzvizVideoFeedback="ezvizVideoFeedback"
                           ref="ezvizVideo"
                           @emitEzvizVideo="confirmEzvizVideo" >

              </ezviz-video>
            </div>
            <div class="el-inspect">
                <div class="guide-lside" v-if="showGuide && inspectList.length > 0">
                    <div class="num-content">
                        <span class="guide-num">1</span>
                        <span class="guide-title">
                            {{generatePatrolLang('startPatrol')}}
                        </span>
                    </div>
                    <img :src="arrows1Src" alt="arrow1"/>
                </div>
                <el-row class="inspect-header">
                    <el-col :span="8">
                        <span style="margin-left:35px;">{{generatePatrolLang('category')}}</span>
                    </el-col>
                    <el-col :span="16" v-if="!showFeedBack">
                        <span style="margin-left:35px;">{{generatePatrolLang('items')}}</span>
                    </el-col>
                </el-row>
                <el-row class="inspect-content" v-if="inspectList.length!=0">
                    <el-col :span="8">
                        <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                            <div style="background-color:#f4f5f9;height:316.06px;">
                                <div v-for="(item,index) in inspectList" :key="index" class="inspect-details"
                                @click="getItemByGroup(item,index)" :class="item.isClick?'noraml-color':'noraml-groupColor'">
                                    <span v-if="item.items!=undefined" :title="`${item.groupName}（${item.dealCount}/${item.items.length}）`">{{`${item.groupName}（${item.dealCount}/${item.items.length}）`}}</span>
                                    <span v-else>{{item.groupName}}</span>
                                </div>
                            </div>
                         </el-scrollbar>
                    </el-col>
                    <el-col :span="16" id="inspectContent">
                        <el-scrollbar style="height:100%;" class="el-menuscrollbar" ref="myScrollbar">
                            <div style="height:299.84px;" v-if="!showFeedBack">
                                <div v-for="(item,index) in inspectItemList" :key="index" class="item-details">
                                    <span class="titles" @click="clickItem(item,index)" :class="!item.isIgnore?'noraml-title':'ignore-title'"
                                          :style="item.checked?{'font-weight':'bold'}:{}" :title="`${index+1}. ${item.subject}`">{{`${index+1}. ${item.subject}`}}</span>
                                    <div class="dropdown-model" v-if="item.disabled"></div>
                                    <el-dropdown trigger="click" class="item-score" size="small" :class="!item.isIgnore?'noraml-title':'ignore-title'">
                                        <span class="el-dropdown-link">
                                            {{`${generatePatrolLang('scoreUnit')}${item.itemScoreTitle}`}}
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown" class="score-menu">
                                            <el-dropdown-item style="width:70px;text-align:center;"
                                            v-for="itemDS in scoreList"
                                            :key="itemDS.val" @click.native="checkScore(item,itemDS)">{{itemDS.scoreTitle}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <i class="iconfont icon-hulve iconhulve" @click="ignoreItem(item,index)" v-if="!item.isIgnore"></i>
                                    <span class="ignored-icon" v-else>{{generatePatrolLang('ignored')}}</span>
                                    <div class="icon-clicked" v-if="item.checked"></div>
                                    <div class="details-content" :class="!item.isIgnore?'noraml-title':'ignore-title'">
                                        <span>{{item.description}}</span>
                                    </div>
                                    <div class="source-content" v-if="item.sourceList.length!=0" :class="!item.isIgnore?'noraml-title':'ignore-title'">
                                        <div class="source-details" v-for="(_item,_index) in item.sourceList" :key="_index">
                                            <div class="img-content" v-if="_item.mediaType==2">
                                                <i class="el-icon-close icondelete" @click="deleteImg(item,_index)" ></i>
                                                <img :src="_item.src" :width="_item.width" :height="_item.height" @click="openOuter(_item)" style="cursor: pointer"/>
                                            </div>
                                            <div class="img-content" v-if="_item.mediaType==1">
                                                <i class="el-icon-close icondelete" @click="deleteImg(item,_index)" ></i>
                                                <img class="start-icon" :src="startIcon" :height="36" @click="playCutVideo(_item,_index)"/>
                                                <img class="imgLittle" :src="videoImgSrc" :height="_item.height"/>
                                            </div>
                                        </div>
                                    </div>
                                    <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 2, maxRows:7}"
                              v-model="item.inspectInput" @input="(val)=>itemDescriptionChanged(val,item)" :placeholder="generatePatrolLang('coment')" :disabled="item.disabled" @blur="notShowInputRuleTips('item',item)"></el-input>
                                    <span class="rules" v-if="item.Ruletip">{{generatePatrolLang('comentRuletip')}}</span>
                                </div>
                            </div>
                            <div class="item-content" style="height:299.84px;" v-else-if="showFeedBackInfo">
                                <div id="feedback-content">
                                    <span class="feedback-info">{{generatePatrolLang('methodI')}}</span>
                                    <span class="feedback-info">{{generatePatrolLang('methodII')}}</span>
                                </div>
                                <img :src="arrows2Src" alt="arrow2" class="feed-arrow" height="70"/>
                                <img :src="plusSrc" alt="plusSrc"  class="plus-icon" @click="addFeedBack"/>
                            </div>
                            <div class="item-content" style="height:299.84px;" v-else>
                                <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                                    <div class="feedbacks-content">
                                        <div class="feedbacks-details" v-for="(item,index) in eventList" :key="index">
                                            <i class="el-icon-close icon-delete-event" @click="deleteEvent(item,index)" ></i>
                                            <span class="feedback-eventname">{{`${index+1}. ${item.eventName}`}}</span>
                                            <span class="feedback-eventdes">{{item.eventDes}}</span>
                                            <div class="img-content" v-if="item.sourceObj!=null&&item.sourceObj.mediaType==2">
                                                <img :src="item.sourceObj.src"
                                            :width="item.sourceObj.width" :height="item.sourceObj.height" class="feedback-pic" @click="openOuter(item.sourceObj)"/>
                                            </div>
                                            <div class="img-content" v-if="item.sourceObj!=null&&item.sourceObj.mediaType==1">
                                                <img class="start-icon" :src="startIcon" :height="36" @click="playCutVideo(item,index)"/>
                                                <img class="imgLittle" :src="videoImgSrc" height="100"/>
                                            </div>
                                            <hr class="feedbacks-hr"/>
                                        </div>
                                    </div>
                                </el-scrollbar>
                                <img :src="plusSrc" alt="plusSrc"  class="plus-icon" @click="addFeedBack"/>
                            </div>
                        </el-scrollbar>
                    </el-col>
                </el-row>
                <el-row class="inspect-content" v-else>
                    <div class="inspect-empty">
                        <span>{{generatePatrolLang('noItems')}}</span>
                    </div>
                </el-row>
            </div>
        </el-col>
        <el-col :span="8" class="rside" v-if="!showSpread">
            <div class="el-header-title">
                <span>{{generatePatrolLang('selectStrore')}}</span>
            </div>
            <el-tabs v-model="activeIndex" @tab-click="handleClick" :id="lang== 'en'? 'en-storetab-content': 'storetab-content'" style="heigth: 50%">
                <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
                    <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                        <div class="storeList-content" v-if="index!=2">
                            <span class="icon-info" v-if="item.storeList.length!=0">* {{generatePatrolLang('cannotSwitch')}}</span>
                            <!-- <span v-for="(_item,_index) in item.storeList" :key="_index" class="storename"
                            :class="_item.isActive?'activeClass':''" @click="clickStore(item,index,_item,_index)">
                                {{_item.name}}
                            </span> -->
                            <div v-for="(_item,_index) in item.storeList" :key="_index" class="storename" :class="_item.isActive?'activeClass':''"
                            :style="!_item.hasInspect?{'background-color':'#f4f5f9','cursor': 'not-allowed'}:{}" @click="clickStore(item,index,_item,_index)">
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
                                :placeholder="generatePatrolLang('keywords')"
                                style="width:240px"
                                v-model="serachVale" @keyup.enter.native="searchStore">
                                <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                            </el-input>
                            <span class="icon-info" v-if="item.storeList.length!=0" style="margin-bottom:15px">* {{generatePatrolLang('cannotSwitch')}}</span>
                            <div v-for="(_item,_index) in item.storeList" :key="_index" class="stores">
                                <span class="citys">{{_item.cityName}}</span>
                                <div v-for="(itemDs,indexDs) in _item.storeList" :key="indexDs" class="store-name" :style="!itemDs.hasInspect?{'background-color':'#f4f5f9','cursor': 'not-allowed'}:{}"
                                :class="itemDs.isActive?'activeClass':''" @click="clickStore(item,index,itemDs,indexDs)">
                                    <!-- <span v-if="itemDs.hasInspect">{{itemDs.name}}</span> -->
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
            <div class="patrol-select">
               <div class="patrol-content">
                    <p class="patrol-title">请选择，西安一店关联巡检表</p>
                    <el-select v-model="patrolstore" placeholder="请选择" class="patrol-elselect">
                        <el-option v-for="item in PatrolList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
               </div>
            </div>
            <div class="channelbar-content">
                <hr class="rside-hr"/>
                <div class="channel-content">
                    <span>{{generatePatrolLang('zoneList')}}</span>
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
            </div>
        </el-col>
    </el-row>
</template>
<script>
import {checkOutInspectItem,submitInspectItem, checkOutInspectItemV3} from '@/api/inspect'
import util from '@/common/util'
import {getStoreList,getFavoriteList,addFavoriteStore,deleteFavoriteStore, getVideoAuthority} from '@/api/store'
import {getUserInfo} from '@/api/login'
import {mapGetters} from 'vuex'
import {getStorageInfo} from '@/api/event'
import {getDeviceList} from '@/api/device'
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
import DialogVue from '@/components/DialogVue.vue'
import ChannelIconBtn  from '@/components/ChannelIconBtn.vue'
import {getCookie} from '@/common/auth';
import RecordRTC from '../../../static/RecordRTC.js'
import {validateInput} from '@/common/validate'
import {generatePatrolLang} from '@/api/i18n'
import EzvizVideo from '@/components/EzvizVideo.vue'
import filterString from '@/common/filterString.js'

export default {
    name:'ReInspection',
    components:{
        DialogVue,
        ChannelIconBtn,
        EzvizVideo
    },
    data(){
        return{
            patrolstore:'',
            PatrolList:[],
            showControls:false,
            showGuide:true,
            sourceList:[],
            penBtnSrc:require('../../../static/img/pen_btn.png'),
            showPenBtn:true,
            showPen:false,
            showStoreUp:true,
            store:{
                storeName:'西安5店',
                storeTitle:'西安5店远程巡检',
                storeUp:false,
                storeUptitle: this.$t('remotePatrol.clickToStar')
            },
            showFeedDialog1:false,
            showFeedDialog2:false,
            showFeedDialog3:false,
            arrows1Src:require('../../../static/img/arrows3_pic.png'),
            arrows2Src:require('../../../static/img/arrows2_pic.png'),
            plusSrc:require('../../../static/img/plus_icon.png'),
            clearIconSrc:require('../../../static/img/清除.png'),
            removeIconSrc:require('../../../static/img/撤销.png'),
            checkImgSrc:'',
            showOuter:false,
            showModelContent:false,
            showInfoContent:true,
            activeIndex:'0',
            serachVale:'',
            varyWindowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth,
            showDate:true,
            playDate:new Date(),
            channel:null,
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
            showCutModel:false,
            errorText:'',
            showError:false,
            showVideo:true,
            showCancelContent:false,
            speedList:[
                {
                    value:0,
                    label:'0.5 X'
                },
                {
                    value:1,
                    label:'1 X'
                },
                {
                    value:2,
                    label:'1.5 X'
                },
                {
                    value:3,
                    label:'2 X'
                }
            ],
            testSpeed:'1 X',
            backList:[
                {
                    value:0,
                    label:'10s'
                },
                {
                    value:1,
                    label:'20s'
                },
                {
                    value:2,
                    label:'30s'
                },
                {
                    value:3,
                    label:'40s'
                }
            ],
            testBack:'10s',
            showSpread:false,
            tabList:[
                {
                    label: this.$t('remotePatrol.star'),
                    storeList:[]
                },
                {
                    label: this.$t('remotePatrol.visited'),
                    storeList:[]
                },
                {
                    label: this.$t('remotePatrol.allStores'),
                    storeList:[]
                }
            ],
            store:{},

            oss:null,
            bucketVideo:'',
            bucketImage:'',
            percentage:0,
            accountId:'',
            userId:'',
            scoreList:[
                // {
                //     val:2,
                //     scoreTitle: this.$t('remotePatrol.good')
                // },
                {
                    val:1,
                    scoreTitle: this.$t('remotePatrol.pass')
                },
                {
                    val:0,
                    scoreTitle: this.$t('remotePatrol.failed')
                },
            ],
            tempStoreList:[],
            allInitStoreList:[],
            sessionId:'',
            inspectList:[],
            showFeedBack:false,
            curGroup:null,
            curGroupIndex:0,  //当前选中的group index
            curItemIndex:0,   //当前点击的 item index
            curItem:null,
            curItemId:0,      //当前点击的巡检项id

            curTabIndex:0,
            curTabItem:null,
            curStoreIndex:0,
            curStoreItem:null, //当前点击的门店对象

            inspectItemList:[],
            allInspectItemList:[], //当前全部没有忽略的巡检项
            deviceList:[],
            protocal:'DASH',
            curDeviceId:-1,
            videoEl:'',
            canvasEl:'',
            showCutDialog:false,
            imageCanvas:new Image(),
            imageCanvasList:[],
            playState:false,
            editCount:0,
            ignoreTemp:[],
            fullScreen:false,
            appliedInspectList:[],

            changeStoreObj:{
                title: this.$t('remotePatrol.confirm'),
                showInfo: this.$t('remotePatrol.confirmSwitch'),
                isWarning:true,
                dialogCosed:false
            },
            ignoreInspectObj:{
                title: this.$t('remotePatrol.confirm'),
                showInfo: this.$t('remotePatrol.confirmIgnore'),
                isWarning:true,
                dialogCosed:false
            },
            noBindDeviceObj:{
                title: this.$t('remotePatrol.prompt'),
                showInfo: this.$t('remotePatrol.notBindCamera'),
                isWarning:false,
                dialogCosed:false
            },
            noAllInspectObj:{
                title: this.$t('remotePatrol.prompt'),
                showInfo: this.$t('remotePatrol.incompleteInfo'),
                isWarning:false,
                dialogCosed:false
            },
            noStoreUser:{
                title: this.$t('remotePatrol.prompt'),
                showInfo: this.$t('remotePatrol.notSolver'),
                isWarning:true,
                dialogCosed:false
            },
            allIgnoreObj:{
              title: this.$t('remotePatrol.prompt'),
              showInfo: this.$t('remotePatrol.allIgnored'),
              isWarning:false,
              dialogCosed:false
            },
            leaveObj:{
              title: this.$t('remotePatrol.prompt'),
              showInfo: this.$t('remotePatrol.changPageInfo'),
              isWarning:true,
              dialogCosed:false
            },
          videoLoadingObj:{
              title: this.$t('remotePatrol.prompt'),
              showInfo: this.$t('remotePatrol.videoLoading'),
              isWarning:false,
              dialogCosed:false
            },
            recorder:null,
            videoCanvasSrc:'',
            isRecordingStarted : false,
            isStoppedRecording : false,
            dialogCommentVideo : false,
            curVideoSrc:'',
            curFeedBackVideoSrc:'',

            feedBackVideoFileObj:{},
            videoSpeed:0,
            videoSpeedId:0,
            showGetVideo:false,
            timeVideo:0,
            startTimeCutVideo:0,
            endTImeCutVideo:0,
            isREC:false,
            startIcon:require('../../../static/img/pic_play_icon.png'),
            videoImgSrc:require('../../../static/img/image_videoThumbnail.png'),

            eventList:[],
            channelBtns:[],
            showChannelBtns:[],
            allChannelBtns: [],
            hideLast:false,
            hideNext:false,
            eventName:'',
            eventDes:'',
            showFeedBackInfo:true,
            showAddFeedBackBtn:true,
            timerPlayReal:null,
            isPlayingFlag:-1,
            lang: this.$i18n.locale,
            initEzviz: false,
            sourceListLength: 0,
            realTimeSpeed: 0,
            videoAuthority: false,
            isLoading: false,
            showEventNameInfo: false,
            fromName: '',
            eventNameRuletip:false,
            eventDesRuletip:false
        }
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
            accountChanged:'accountChanged',
        }),
        ...mapGetters(
          ['isEzviz']
        ),
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
        },
    },
    beforeRouteEnter(to, from, next){
      console.log(to.meta.keepAlive)
      if(from.name !== 'submitEvent'){
        //to.meta.keepAlive = true
      }
      //to.meta.keepAlive = true
      next(vm=>{
    //     vm.fromName = from.name;
    //     if(from.name == 'submitEvent' && !to.meta.keepAlive){
    //       vm.$destroy()
    //     }
      })
     },
    beforeRouteLeave(to, from, next){
        let self=this;
        console.log(from.meta.keepAlive)
        let canLeave = (((!self.isEzviz) && self.editCount!=0 )) || ( self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.editCount !=0 )
        if(canLeave && to.name !='confirmSum'){
          self.$confirm(self.$t('remotePatrol.changPageInfo'), self.$t('remotePatrol.prompt'), {
            confirmButtonText: self.$t('remotePatrol.confirm'),
            cancelButtonText: self.$t('remotePatrol.cancel'),
            type: 'warning',
            customClass: 'confirmClass',
            cancelButtonClass: 'cancelBtn',
            confirmButtonClass: 'confirmBtn'
          }).then(() => {
            console.log('confirm')
            if(to.name !='confirmSum' ){
              from.meta.keepAlive=false;
              self.previewplayer && self.previewplayer.dispose()
            }
            else{
              from.meta.keepAlive = true;
            }
            if(self.playState){
              self.stopRealTime();
              window.clearInterval(self.timerPlayReal);
              self.timerPlayReal=null;
            }
            if(self.isEzviz && !self.showGuide){
              self.$refs.ezvizVideo.stopRealTime();
            }
            next()
          }).catch(() => {
            // 如果取消跳转地址栏会变化，这时保持地址栏不变
            console.log('cancel')
            next(false)
          })
        }
        else{
          if(to.name !='confirmSum'){
            from.meta.keepAlive=false;
          }
          else{
            from.meta.keepAlive=true;
          }
          if(self.playState){
            self.stopRealTime();
            window.clearInterval(self.timerPlayReal);
            self.timerPlayReal=null;
          }
          if(self.isEzviz && !self.showGuide){
            self.$refs.ezvizVideo.stopRealTime();
          }
          next();
        }
        // if(self.editCount!=0){
        //     let confirm=window.confirm('当前巡检尚未完成，确认是否离开页面？');
        //     if(confirm==true){
        //         if(to.name!='巡检提交事件'){
        //             from.meta.keepAlive=false;
        //             if(self.playState){
        //                 self.stopRealTime();
        //             }
        //         }
        //         next();
        //     }
        //     else{
        //         next(false);
        //     }
        // }
        // self.isPlayingFlag=-1;
        // if(to.name!='confirmSum'){
        //     from.meta.keepAlive=false;
        // }
        // if(self.playState){
        //     self.stopRealTime();
        //     window.clearInterval(self.timerPlayReal);
        //     self.timerPlayReal=null;
        // }
        // next();
    },
    async mounted(){
        let self=this;
        document.onmouseup=self.mouseUpAction;
        self.isREC=false;
        self.getUpLoadBucketInfo();
        self.getOssInfo();
        //self.getInitStoreData();
        self.getFaStoreData();
        self.getDeviceList();
        //self.getVideoAuthority();
      if(!self.isEzviz){
          self.looper();
        }
        else{
          //
        }
        window.onresize=function(){
            if(!self.checkFull()){
                console.log('退出全屏');
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
           //   console.log(self.isEzviz)
           //   if(!self.isEzviz){
           //     if(document.hidden){
           //       console.log("我暂时离开页面了");
           //       if(self.playState){  //当前播放的是实时视频
           //         self.stopRealTimeVisPage();
           //         window.clearInterval(self.timerPlayReal);
           //       }
           //     }else{
           //       console.log("我进入页面了");
           //       console.log(self.isPlayingFlag);
           //       if(self.isPlayingFlag==1){
           //         self.realTime();
           //       }
           //     }
           //   }
           //
           // })
         },
    methods:{
        generatePatrolLang,
        visibilityChange(){
          let self = this;
          console.log(self.isEzviz)
          if(!self.isEzviz){
            if(document.hidden){
              console.log("我暂时离开页面了");
              if(self.playState){  //当前播放的是实时视频
                self.stopRealTimeVisPage();
                window.clearInterval(self.timerPlayReal);
              }
            }else{
              console.log("我进入页面了");
              console.log(self.isPlayingFlag);
              if(self.isPlayingFlag==1){
                self.realTime();
              }
            }
          }
        },
        changeBrand(){
            let self=this;
            if(self.playState){
                self.stopRealTime();
                window.clearInterval(self.timerPlayReal);
                self.timerPlayReal = null
            }
            self.activeIndex='0';
            self.showGuide=true;
            self.accountId=localStorage.getItem('oss_bucket');
            self.showChannelBtns = [];
            //self.getInitStoreData();
            self.getFaStoreData();
            //self.videoEl=document.getElementById('previewVideo').children[0];
            self.getDeviceList();
            //self.getVideoAuthority();
        },
        anchorLinkTo () {
            let self=this;
            if(document.getElementById('inspectContent')!=null){
                if(self.$refs['myScrollbar']!=undefined){
                    self.$refs['myScrollbar'].wrap.scrollTop = document.getElementById('inspectContent').offsetTop;
                }
            }
        },
        getAccountId(){
            let self=this;
            let userId=getCookie('UserId');
            self.userId=userId;
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
        getFileUrl(fileName){
            let self=this;
            //let bucketName='viumo-'+self.accountId;
            //let bucketName='viumo-aaoompqqpjy4';
            //let bucketName = self.oss.ossBucketName;
            let bucketName = 'viumo-n3azju2aknpw';
            let endpoint=self.oss.ossEndPoint;
            let key=fileName;
            let url=`http://${bucketName}.${endpoint}/${fileName}`;
            return url;
        },
        deleteEvent(item,index){
            let self=this;
            console.log(item);
            console.log(index);
            self.eventList.splice(index,1);
        },
        addFeedBack(){
            let self=this;
            self.showFeedDialog1=true;
            self.eventName='';
            self.eventDes='';
            self.showEventNameInfo = false;
        },
        confirmAddFeedBack3(){
            let self=this;
            let srcObj=null;
            srcObj=self.feedBackVideoFileObj;
            let obj={
                eventName:self.eventName,
                eventDes:self.eventDes,
                sourceObj:srcObj
            }
            if(self.eventName.trim().length==0){
                self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
                return false;
            }
            self.eventList.push(obj);
            self.showFeedDialog3=false;
            self.showFeedBackInfo=false;
        },
        confirmAddFeedBack2(){
            let self=this;
            let srcObj=null;
            let src=self.canvasEl.toDataURL("image/jpeg");
            srcObj={
                mediaType:2,
                src:src,
                height:'100px',
                width:'140px',
                fileName:self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.curItemId+'.jpg',
                file:util.base64ToBlob(src),
                deviceId: self.channel.id
            }

            let obj={
                eventName:self.eventName,
                eventDes:self.eventDes,
                sourceObj:srcObj
            }
            if(self.eventName.trim().length==0){
                //self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
                self.showEventNameInfo = true;
                return false;
            }
            self.eventList.push(obj);
            self.showFeedDialog2=false;
            self.showFeedBackInfo=false;
        },
        confirmAddFeedBack1(){
            let self=this;
            let obj={
                eventName:self.eventName,
                eventDes:self.eventDes,
                sourceObj:null
            }
            if(self.eventName.trim().length==0){
                self.showEventNameInfo = true;
                //self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
                return false;
            }
            self.eventList.push(obj);
            self.showFeedDialog1=false;
            self.showFeedBackInfo=false;
        },
        getIndexById(id){
            let self=this;
            let tempId=null;
            let indexFeed=self.inspectList.map(x=>x.groupId).indexOf('feedBack');
            let inspectList=self.inspectList.slice(0,indexFeed);
            inspectList.forEach((item,index)=>{
                item.items.forEach((_item,_index)=>{
                    if(_item.id==id){
                        tempId={
                            groupIndex:index,
                            itemIndex:_index
                        };
                    }
                })
            })
            return tempId;
        },
        getChannelIndexById(id){
            let self=this;
            let curIndex=0;
            self.channelBtns.forEach((item,index)=>{
                if(item.id==id){
                    curIndex=index;
                }
            })
            return curIndex;
        },
        upLoadFile(fileItem){
            let self=this;
            self.percentage=0;
            let OSS = require('ali-oss');
            //let bucketName = 'viumo-'+self.accountId
            //let bucketName='viumo-aaoompqqpjy4';
            //let bucketName = self.oss.ossBucketName;
            let bucketName = 'viumo-n3azju2aknpw';
            const client = new OSS({
                region: self.oss.ossEndPoint.slice(0,self.oss.ossEndPoint.indexOf('.')),
                accessKeyId: self.oss.ossAccessKeyId,//填入自己的id
                accessKeySecret: self.oss.ossAccessKeySecret,//填入自己的id
                //bucket: 'viumo-'+self.accountId
                bucket:bucketName
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
        getDeviceList(){
            let self=this;
            getDeviceList().then(res=>{
                if(res.errCode==0){
                    let data=res.data;
                    self.deviceList=data;
                }
            })
        },
        addVideoToList(){
            let self=this;
            self.recorder.stopRecording(function(){
                self.isRecordingStarted=false;
                self.isStoppedRecording=true;
                var blob =self.recorder.getBlob();
                let url=URL.createObjectURL(blob);
                let obj={};
                obj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.webm';
                obj.file=blob;
                obj.mediaType=1;
                obj.src=url;
                obj.height='100px';
                self.sourceList.push(obj);
                console.log(self.curItemId);
                let tempId=self.getIndexById(self.curItemId);
                console.log(tempId);
                if(tempId!=null){
                    self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList.push(obj) ;
                }
                else{
                    self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList=self.sourceList;
                }
                self.sourceListLength = self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.length;
            })
        },
        playCutVideo(item,index){
            let self=this;
            self.dialogCommentVideo=true;
            if(self.showFeedBack){
                self.curVideoSrc=item.sourceObj.src;
            }
            else{
                self.curVideoSrc=item.src;
            }
        },
        looper(){
            let self=this;
            if(!self.isRecordingStarted){
                self.timeVideo=setTimeout(self.looper, 0);
            }
            else{
                self.endTImeCutVideo=new Date().getTime();
                console.log((self.endTImeCutVideo-self.startTimeCutVideo)/1000);
                if((self.endTImeCutVideo-self.startTimeCutVideo)/1000>11){
                    clearTimeout(self.timeVideo);
                    self.showGetVideo=false;
                    self.isRecordingStarted=false;
                    self.isREC=false;
                    setTimeout(()=>{
                        if(self.showFeedBack){
                            self.showFeedDialog3=true;
                            self.eventName='';
                            self.eventDes='';
                            this.$nextTick(()=>{
                                self.recorder.stopRecording(function(){
                                    self.isRecordingStarted=false;
                                    self.isStoppedRecording=true;
                                    var blob =self.recorder.getBlob();
                                    let url=URL.createObjectURL(blob);
                                    let obj={};
                                    obj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.webm';
                                    obj.file=blob;
                                    obj.mediaType=1;
                                    obj.src=url;
                                    self.feedBackVideoFileObj=obj;
                                })
                            })
                        }
                        else{
                            self.addVideoToList();
                        }
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
                    textStr= self.$t('remotePatrol.recording');
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
        getVideo(){
            let self=this;
            console.log(self.curGroupIndex);
            if(self.sourceListLength >=5){
                self.notify(self.$t('remotePatrol.maximumAttach'),'warning',3000);
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
        cutPicture(){
            let self=this;
            console.log(self.curGroupIndex);
            self.videoEl=document.getElementById('previewVideo').children[0];
            self.imageCanvasList=[];
            if(self.fullScreen){
                self.exitFullscreen();
                self.fullScreen=false;
            }
            if(self.showFeedBack){
                self.showFeedDialog2=true;
                self.eventName='';
                self.eventDes='';
                self.showEventNameInfo = false;
                this.$nextTick(()=>{
                    self.canvasEl=document.getElementById('icanvas');
                    var ctx = self.canvasEl.getContext('2d');
                    ctx.drawImage(self.videoEl,0,0,520*self.percentHeight,340*self.percentHeight);
                    var oGrayImg=icanvas.toDataURL('image/jpeg');
                    self.imageCanvas.src=oGrayImg;
                    let imgObj=new Image();
                    imgObj.src=oGrayImg;
                    self.imageCanvasList.push(imgObj);
                })
            }
            else{
                self.showCancelContent=false;
                if(self.sourceListLength >= 5){
                    self.notify(self.$t('remotePatrol.maximumAttach'),'warning',3000);
                    return false;
                }
                self.showCutDialog=true;
                this.$nextTick(()=>{
                    self.canvasEl=document.getElementById('icanvas');
                    var ctx = self.canvasEl.getContext('2d');
                    ctx.drawImage(self.videoEl,0,0,767*self.percentHeight,431*self.percentHeight);
                    var oGrayImg=icanvas.toDataURL('image/jpeg');
                    self.imageCanvas.src=oGrayImg;
                    let imgObj=new Image();
                    imgObj.src=oGrayImg;
                    self.imageCanvasList.push(imgObj);
                })
            }
        },
        showPenList(){
            let self=this;
            self.showPen=!self.showPen;
            self.showCancelContent=false;
        },
        checkPen(item,index){
            let self=this;
            item.showContent=true;
            self.penList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.showContent=false;
                }
            })
            self.penChecked=item.id;
        },
        cancelEditCanvas(){
            let self=this;
            self.showCancelContent=false;
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            let vcanvas=null;
            if(self.showFeedBack){
                vcanvas={width:520*self.percentHeight,height:340*self.percentHeight};
            }
            else{
                vcanvas={width:767*self.percentHeight,height:431*self.percentHeight};
            }
            ctx.clearRect(0,0,vcanvas.width,vcanvas.height);
            ctx.drawImage(self.imageCanvas,0,0,vcanvas.width,vcanvas.height);
            self.imageCanvasList=[];
        },
        confirmEditCanvas(){
            let self=this;
            self.showCancelContent=false;
            self.imageCanvasList.pop();
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            let vcanvas=null;
            if(self.showFeedBack){
                vcanvas={width:520*self.percentHeight,height:340*self.percentHeight};
            }
            else{
                vcanvas={width:767*self.percentHeight,height:431*self.percentHeight};
            }
            ctx.clearRect(0,0,vcanvas.width,vcanvas.height);
            if(self.imageCanvasList.length==0){
                ctx.drawImage(self.imageCanvas,0,0,vcanvas.width,vcanvas.height);
            }
            else{
                ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length-1],0,0,vcanvas.width,vcanvas.height);
            }
        },
        confirmEdit(){
            let self=this;
            self.sourceList = [];
            let obj={};
            obj.mediaType=2;
            obj.src=self.canvasEl.toDataURL("image/jpeg");
            obj.height='100px';
            obj.width='140px';
            obj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.curItemId+'.jpg';
            obj.file=util.base64ToBlob(obj.src);
            obj.deviceId = self.channel.id;
            self.sourceList.push(obj);
            self.showCutDialog=false;
            console.log(self.curItemId);
            let tempId=self.getIndexById(self.curItemId);
            console.log(tempId);
            if(tempId!=null){
                //self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList=self.sourceList;
              self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList.push(obj);
            }
            else{
                self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList=self.sourceList;
            }
            self.sourceListLength = self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.length;

        },
        mouseDownAction(e){
           let self=this;
           self.isMouseDown=true;
           self.X=e.offsetX;
           self.Y=e.offsetY;
           self.showCutModel=false;
           self.showPenBtn=false;
           self.showCancelContent=false;
        },
        mouseMoveAction(e){
            let self=this;
            if(self.isMouseDown){
                self.X1=e.offsetX;
                self.Y1=e.offsetY;
                self.drawLine(self.X,self.Y,self.X1,self.Y1);
                self.showPenBtn=false;
                self.flag++;
            }
        },
        mouseUpAction(e){
            let self=this;
            self.isMouseDown=false;
            self.showCutModel=true;
            self.showPenBtn=true;
            self.showCancelContent=true;  //每次鼠标弹起后显示可以取消的框
            if(self.flag!=0&&self.canvasEl!=''){
                let imgObj=new Image();
                imgObj.src=self.canvasEl.toDataURL("image/jpeg");
                self.imageCanvasList.push(imgObj);
            }
            self.flag=0;
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
        getFaStoreList(){
            let self=this;
            return new Promise((resolve,reject)=>{
                getFavoriteList().then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        checkScore(item,itemDS){
            let self=this;
            console.log(item);
            item.itemScore=itemDS.val;
            item.itemScoreTitle=itemDS.scoreTitle;
            if(item.itemScore!='--'){
                if(self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount==0){
                    self.inspectList[self.curGroupIndex].dealCount=self.inspectList[self.curGroupIndex].dealCount+1;
                }
                self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount++;
            }
            else{
                if(self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount!=0){
                    self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount=0;
                    self.inspectList[self.curGroupIndex].dealCount=self.inspectList[self.curGroupIndex].dealCount-1;
                }
            }
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
                    console.log(res);
                    resolve(res);
                })
            })
        },
        saveStoreObj(storeObj){
            let self=this;
            let key='recentStore_reinspect'+'_'+self.accountId+'_'+self.userId;
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
            let key='recentStore_reinspect'+'_'+self.accountId+'_'+self.userId;
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
        async getStoreList(){
            let self=this;
            console.log(self.activeIndex);
            console.log(self.store);
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
                    if(self.appliedInspectList.indexOf(item.storeId)!=-1){
                        obj.hasInspect=true;
                    }
                    else{
                        obj.hasInspect=false;
                    }
                    temp.push(obj);
                })
                return temp;
            }
            let data;
            switch(Number(self.activeIndex)){
                case 0: data=await self.getFaStoreList();
                    console.log(data);
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
                    console.log(self.tabList[2]);
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
        async getFaStoreData(){
            let self=this;
            let getStoreTemp=data=>{
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userId=item.userId;
                    obj.favorite=item.favorite==undefined?true:item.favorite;
                    obj.device=item.device;
                    obj.isActive=false;
                    if(self.appliedInspectList.indexOf(item.storeId)!=-1){
                        obj.hasInspect=true;
                        if(index==0){
                            obj.isActive=true;
                        }
                    }
                    else{
                        obj.hasInspect=false;
                    }
                    temp.push(obj);
                })
                return temp;
            }
            let data=await self.getFaStoreList();
            let allStoreData=await self.getAllStoreList();
            self.getInitStoreData(allStoreData);
            if(data.errCode==0){
                let storeData=data.data;
                self.tabList[0].storeList=getStoreTemp(storeData);
                if(storeData.length==0){
                    self.showStoreUp=false;
                    self.inspectList=[];
                }
                else{
                    if(self.appliedInspectList.indexOf(storeData[0].storeId)!=-1){
                        let obj={};
                        obj.storeId=storeData[0].storeId;
                        obj.storeName=storeData[0].name;
                        obj.storeTitle=storeData[0].name;
                        obj.storeUp=true;
                        obj.storeUpTitle= this.$t('remotePatrol.stared');
                        self.store=obj;
                        self.showStoreUp=true;
                        let curStoreId=storeData[0].storeId;
                        let storeObj={
                            storeId:curStoreId
                        };
                        self.saveStoreObj(storeObj);
                        self.getInspectByStore(self.tabList[0].storeList[0].storeId);
                        self.getChannelByStore(self.tabList[0].storeList[0]);
                    }
                    else{
                        self.showStoreUp=false;
                    }
                }
            }
        },
         async getInitStoreData(data){
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
                            if(data[j].appliedInspect.length!=0&&data[j].appliedInspect.indexOf('远程巡检')!=-1){
                                self.appliedInspectList.push(data[j].storeId);
                                obj.hasInspect=true;
                            }
                            else{
                                obj.hasInspect=false;
                            }
                            temp.push(obj);
                        }
                    }
                    obj.cityName=cityList[i].province+' '+cityList[i].city;
                    obj.storeList=temp;
                    storeListTemp.push(obj);
                }
                return storeListTemp;
            }
            // let data=await self.getAllStoreList();
             if(data.errCode==0){
                let storeData=data.data.content;
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
        handleClick(tab){
            console.log(tab);
            let self=this;
            self.getStoreList();
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
                    console.log(res);
                    if(res.errCode==0){
                        self.store.storeUp=true;
                        self.store.storeUpTitle= this.$t('remotePatrol.stared');
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
                        self.store.storeUpTitle=this.$t('remotePatrol.clickToStar');
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
        getItemByGroup(item,index){
            console.log(item);
            let self=this;
            if(item.groupId=='feedBack'){
                item.isClick=true;
                self.showFeedBack=true;
                if(self.eventList.length==0){
                    self.showFeedBackInfo=true;
                }
                self.showGuide=false;
                console.log(self.channel);
                self.channelBtns = self.allChannelBtns.concat();
                self.channelBtns.forEach((_item,_index)=>{
                    if(self.channel!=null){
                        if(_item.id==self.channel.id){
                            _item.isClick=true;
                        }
                        else{
                            _item.isClick=false;
                        }
                    }
                })
                self.$nextTick(()=>{
                    self.getshowBtns(self.channelBtns);
                })
            }
            else{
                self.curGroupIndex=index;
                self.curGroup=item;
                self.curItemIndex=0;
                self.inspectItemList=item.items;
                self.showFeedBack=false;
                self.hideNext = false;
                self.hideLast = false;
                self.channelBtns = [];
                self.showChannelBtns = [];
                item.isClick=true;
                this.$nextTick(()=>{
                    self.anchorLinkTo();
                })
            }
            self.inspectList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
        },
        getDeviceById(deviceId){
            let self=this;
            let device= [];
            self.deviceList.forEach(item=>{
                // if(deviceId==item.id){
                //     device=item;
                // }
              deviceId.forEach(_item=>{
                if(_item==item.id){
                  device.push(item);
                }
              })
            })
            return device;
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
            item.sourceList.splice(index,1);
            self.sourceListLength--;
        },
        ignoreInspectDialog(val){
            let self=this;
            console.log(val);
            self.curItem.isIgnore=true;
            self.curItem.disabled=true;
            self.showGuide=false;
            self.ignoreTemp.push(self.curItem);
            if(self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount==0){
                self.inspectList[self.curGroupIndex].dealCount=self.inspectList[self.curGroupIndex].dealCount+1;
            }
            self.ignoreInspectObj.dialogCosed=false
        },
        cancelIgnoreInspect(val){
            let self=this;
            console.log(val);
            self.ignoreInspectObj.dialogCosed=false;
        },
        ignoreItem(item,index){
            let self=this;
            self.isEzviz ? self.$refs.ezvizVideo.editCount++: self.editCount++;
            //self.editCount=self.editCount+1;
            self.curItemIndex=index;
            self.curItem=item;
            if(item.isIgnore){
                self.notify( this.$t('remotePatrol.ignoredItem'),'warning',3000);
                return false;
            }
            if(item.deviceId==-1){
                self.noBindDeviceObj.dialogCosed=true;
                return false;
            }
            self.ignoreInspectObj.dialogCosed=true;
        },
        noBindDeviceDialog(val){
            let self=this;
            self.noBindDeviceObj.dialogCosed=false;
        },
        canceldNoBind(val){
            let self=this;
            self.noBindDeviceObj.dialogCosed=false;
        },
        clickBtn(item,index){
            let self=this;
            console.log(item);
            if(self.isLoading || (self.isEzviz && self.$refs.ezvizVideo.isLoading)){
              self.videoLoadingObj.dialogCosed=true;
              return false;
            }
            let obj={
                id:item.id,
                channelId:item.channelId,
                ivsId:item.ivsId,
                channelName:item.name
            };
            self.channel=obj;
            item.isClick=true;
            if(self.showFeedBack){
              self.inspectItemList.forEach(_item=>{
                _item.checked=false;
                _item.disabled=true;
              })
            }
            self.showChannelBtns.forEach((_item,_index)=>{
                if(_index!=index){
                    _item.isClick=false;
                }
            })
            if(!self.isEzviz){
              //非萤石平台
              self.curDeviceId=item.id;
              if(self.playState){
                self.stopAndRealTime();
              }
              else{
                self.realTime();
              }
            }
            else{
              //萤石云平台，切换摄像头
              if(self.$refs.ezvizVideo.playState){ //切换前处于播放状态
                self.$refs.ezvizVideo.stopRealTime();
                self.$nextTick(()=>{
                  self.$refs.ezvizVideo.realTime(); //播放当前通道对应的视频(ivsId,channelId)
                })
              }
              else{
                self.$nextTick(()=>{
                  self.$refs.ezvizVideo.realTime(); //播放当前通道对应的视频(ivsId,channelId)
                })
              }
            }
        },
        clickItem(item,index){
            console.log(item)
            let self=this;
            if(item.isIgnore){
                return false;
            }
            if(self.isLoading || (self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.isLoading)){
              self.videoLoadingObj.dialogCosed = true;
              return false;
            }
            self.sourceList=[];
            self.sourceListLength = item.sourceList.length; //获取总共的媒体文件数目
            let obj={};
            if(item.deviceId.length > 0){  //当前选择的巡检项已绑定设备
                let device=self.getDeviceById(item.deviceId);
                if(device.length > 0){
                    obj.id=device[0].id;
                    obj.ivsId=device[0].ivsId;
                    obj.channelName=device[0].name;
                    obj.channelId=device[0].channelId;
                    self.channel=obj;   //当前巡检项绑定的通道如果跟正在播放的通道不一样，更新通道信息，并播放视频
                    self.channelBtns = []
                    device.forEach(item=>{
                      self.allChannelBtns.forEach(_item=>{
                        if(item.id == _item.id){
                          self.channelBtns.push(_item)
                        }
                      })
                    })
                    self.$nextTick(()=>{
                      self.getshowBtns(self.channelBtns);
                    })
                    self.channelBtns.forEach((_item,_index)=>{
                      if(self.channel!=null){
                        if(_item.id == self.channel.id){
                          _item.isClick=true;
                        }
                        else{
                          _item.isClick=false;
                        }
                      }
                    })
                    item.checked=true;
                    self.curItem=item;
                    self.curItemIndex=index;
                    self.curItemId=item.id;
                    item.disabled=false;
                    self.showError=false;
                    self.showGuide=false;
                    if(item.deviceId[0] != self.curDeviceId){
                      //Dash
                      if(!self.isEzviz){
                        if(self.playState){
                          self.stopAndRealTime();
                        }
                        else{
                          self.realTime();
                        }
                      }
                      else{
                        //Ezviz
                        if(self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.playState){ //切换前处于播放状态
                          self.$refs.ezvizVideo.stopRealTime();
                          self.$nextTick(()=>{
                            self.$refs.ezvizVideo.realTime(); //播放当前通道对应的视频(ivsId,channelId)
                          })
                        }
                        else{
                          self.$nextTick(()=>{
                            self.$refs.ezvizVideo.realTime(); //播放当前通道对应的视频(ivsId,channelId)
                          })
                        }
                      }
                        self.curDeviceId=item.deviceId[0];
                    }
                    // else{
                    //   if(!self.videoAuthority){
                    //     self.showError = true;
                    //     self.errorText = self.$t('remotePatrol.videoLicense');
                    //   }
                    // }
                }
            }
            else if(item.deviceId.length == 0){
                self.noBindDeviceObj.dialogCosed=true;
                return false;
            }
            self.inspectItemList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.checked=false;
                    _item.disabled=true;
                }
            })
            self.inspectList.slice(0,self.inspectList.length-1).forEach((_item,_index)=>{
                _item.items.forEach((itemDS,indexDS)=>{
                    if(itemDS.id!=item.id){
                        itemDS.checked=false;
                        itemDS.disabled=true;
                    }
                })
            })
        },
        getInspectByStore(storeId){
            let self=this;
            self.inspectItemList=[];
            let params={
                storeId:self.store.storeId,
                mode:0
            }
          checkOutInspectItemV3(params).then(res=>{
                if(res.errCode==0){
                    let data=res.data.groups;
                    let temp=[];
                    data.forEach((item,index)=>{
                        let obj={};
                        obj.groupId=item.groupId;
                        obj.mode=item.mode;
                        obj.groupName=item.groupName;
                        obj.dealCount=0;
                        if(index==0){
                            obj.isClick=true;
                        }
                        else{
                            obj.isClick=false;
                        }
                        let tempItems=[];
                        item.items.forEach((_item,_index)=>{
                            let itemObj={};
                            itemObj.id=_item.id;
                            itemObj.groupId=item.groupId;
                            itemObj.subject=_item.subject;
                            itemObj.description=_item.description;
                            itemObj.itemScore='--';
                            itemObj.itemScoreTitle='--';
                            //itemObj.deviceId=_item.deviceId;
                            itemObj.deviceId=_item.deviceIds;
                            itemObj.inspectInput='';
                            itemObj.inputCount=0;
                            itemObj.disabled=true;
                            itemObj.checked=false;   //是否选中状态
                            itemObj.isIgnore=false;  //是否被忽略
                            itemObj.Ruletip=false;  //是否显示提示语
                            itemObj.sourceList=[];
                            tempItems.push(itemObj);
                        })
                        obj.items=tempItems;
                        temp.push(obj);
                    })
                    self.inspectList=temp;
                    let feedobj={
                        groupId:'feedBack',
                        groupName: self.$t('remotePatrol.feedbacks'), //问题反馈
                        isClick:false,
                    }
                    if(self.inspectList.length!=0){
                        self.inspectList.push(feedobj);
                        self.getItemByGroup(self.inspectList[0],0);
                    }
                }
            })
        },
        leaveDialog(){
          let self=this;
          self.leaveObj.dialogCosed=false;
          self.isEzviz ? self.$refs.ezvizVideo.editCount = 0 : self.editCount = 0;
        },
        cancelLeave(){
          let self=this;
          self.leaveObj.dialogCosed = false;
        },
        noAllInspectDialog(){
            let self=this;
            self.noAllInspectObj.dialogCosed=false;
        },
        canceldNoAllInspect(){
            let self=this;
            self.noAllInspectObj.dialogCosed=false;
        },
        allIgnoreDialog(){
          let self=this;
          self.allIgnoreObj.dialogCosed=false;
        },
        cancelAllIgnore(){
          let self=this;
          self.allIgnoreObj.dialogCosed=false;
        },
        videoLoadingDialog(){
          let self=this;
          self.videoLoadingObj.dialogCosed=false;
        },
        cancelVideoLoading(){
          let self=this;
          self.videoLoadingObj.dialogCosed=false;
        },
        async submit1(){
            let self=this;
            let temp=[];
            let count=0;
            let dealCount=0;
            let ignoreCount = 0;
            let indexFeed=self.inspectList.map(x=>x.groupId).indexOf('feedBack');
            let inspectList=self.inspectList.slice(0,indexFeed);

            inspectList.forEach(item=>{
                count=count+item.items.length;
                dealCount=dealCount+item.dealCount;
                var items = item.items;
                items.forEach((it)=>{
                  if(it.isIgnore){
                    ignoreCount++;
                  }
                })
            })
            if(dealCount<count){
                self.noAllInspectObj.dialogCosed=true;
                return false;
            }
            if(ignoreCount == count){
              self.allIgnoreObj.dialogCosed=true;
              return false;
            }
            let obj={
                inspect:inspectList,
                event:self.eventList,
                store:self.store,
                channel:self.channel
            }
            sessionStorage.setItem('routeData_confirm',JSON.stringify(obj));
            self.$router.push({name:"confirmSum",params:{data:obj}});
        },
        async submit(){
            let self=this;
            let temp=[];
            let count=0;
            let dealCount=0;
            let indexFeed=self.inspectList.map(x=>x.groupId).indexOf('feedBack');
            let inspectList=self.inspectList.slice(0,indexFeed);

            inspectList.forEach(item=>{
                count=count+item.items.length;
                dealCount=dealCount+item.dealCount;
            })
            if(dealCount<count){
                self.noAllInspectObj.dialogCosed=true;
                return false;
            }
            for(let i in inspectList){
                for(let  j in inspectList[i].items){
                    let objItem={};
                    objItem.ts=new Date().getTime();
                    objItem.description=inspectList[i].items[j].inspectInput.trim();
                    objItem.score=inspectList[i].items[j].isIgnore?-1:inspectList[i].items[j].itemScore;
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
                                obj.deviceId = self.channel.id;
                            }
                            else if(inspectList[i].items[j].sourceList[k].mediaType==1){
                                let url=await self.upLoadFile(inspectList[i].items[j].sourceList[k]);
                                obj.mediaType=1;
                                obj.url=url;
                                obj.deviceId = self.channel.id;
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
                        deviceId: self.channel.id
                    }
                    commentTemp.push(commentObj);
                    obj.deviceId=self.channel.id;
                }
                else{                        //通过加号创建的问题反馈
                    obj.diviceId = -1;
                }
                obj.attachment=commentTemp;
                feedEventList.push(obj);
            }
            let params={
                items:temp,
                feedback:feedEventList
            };
            let routeData=null;
            submitInspectItem(params).then(res=>{
                if(res.errCode==0){
                    let data=res.data;
                    self.editFlag=true;
                    routeData={
                        isSuccess:true,
                        user:data.notifiedTo,
                        ignoredItems:data.ignoredItems,
                        submitResult:data.submitResult,
                        store:self.store,
                        ignoreTemp:self.ignoreTemp
                    };
                }
                else{
                    routeData={
                        isSuccess:false
                    };
                }
                if(self.playState){
                    self.stopRealTime();
                }
                sessionStorage.setItem('reinspect_submit',JSON.stringify(routeData));
                self.$router.push({name:"submitEvent",params:{data:routeData}});
            })

        },
        spreadContent(){
            let self=this;
            self.showSpread=true;
        },
        closeContent(){
            let self=this;
            self.showSpread=false;
        },
        async playVideo(url) {
            let self=this;
            console.log('playvideo enter!');
            self.showModelContent=true;
            //self.showInfoContent=true;
            self.playState=true;
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
            // setTimeout(() => {
            //     self.showModelContent=true;
            //     //self.showInfoContent=false;
            // }, 3000);
        },
        destroyVideo(){
            let self=this;
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            self.previewplayer.dispose();
        },
        hiddenModel(){
            let self=this;
            //self.showModelContent=false;
            //self.showInfoContent=false;
        },
        showModel(){
            let self=this;
            //self.showInfoContent=true;
            // if(self.playState){
            //     self.showModelContent=true;
            // }
        },
        async realTime(){
            let self=this;
            self.showError = false;
            // if(!self.videoAuthority){
            //   self.showError = true;
            //   self.errorText = self.$t('remotePatrol.videoLicense');
            //   return false;
            // }
            if(self.channel==null){
                return false;
            }
            window.clearInterval(self.timerPlayReal);
            self.realTimeSpeed=0;
            self.isLoading = true;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            // if(!self.showVideo){
            //     self.showVideo=true;
            // }
            if(sessionId == null){
              self.isLoading = false;
              return;
            }
            self.sessionId=sessionId;
            const data = {
                request: {
                  method: 'connection',
                  sessionID:self.sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if(self.mpdurl == null){
              self.isLoading = false;
              return;
            }
            if (self.mpdurl.ErrorCode==undefined&&self.mpdurl.length!=0) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
                self.editCount=self.editCount+1;
                self.isPlayingFlag=1;
                self.isLoading = false;
                window.clearInterval(self.timerPlayReal);
                self.timerPlayReal=window.setInterval(()=>{
                  console.log(self.realTimeSpeed)
                    self.realTimeSpeed=self.realTimeSpeed+1;
                },1000);
            }
            else{
                self.showGuide=false;
                self.showError=true;
                self.isLoading = false;
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
                self.destroyVideo();
            }
        },
        stopVideo(){
            let self=this;
            self.showModelContent=false;
            self.playState=false;
            var video = document.getElementById("previewVideo");
            self.previewplayer = videojs(video);
            self.previewplayer.pause();
        },
        async stopRealTimeVisPage(){
            let self=this;
            // if(!self.videoAuthority){
            //   self.showError = true;
            //   self.errorText = self.$t('remotePatrol.videoLicense');
            //   return false;
            // }
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
        async stopRealTime(){
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
            self.isPlayingFlag=-1;
            let ret=await dashAPI.RealTime(0,data);
            await dashAPI.Offline(self.sessionId);
            window.clearInterval(self.timerPlayReal);
            self.realTimeSpeed=0;
            //self.showVideo=false;
            //self.destroyVideo();
            //self.showGuide=true;
        },
       async stopAndRealTime(){
            let self=this;
           // if(!self.videoAuthority){
           //   self.showError = true;
           //   self.errorText = self.$t('remotePatrol.videoLicense');
           //   return false;
           // }
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
            window.clearInterval(self.timerPlayReal);
            self.realTimeSpeed=0;
            let url='';
            let ret=await dashAPI.RealTime(0,dataDis);
            await dashAPI.Offline(self.sessionId);
            let sessionId= await dashAPI.Online();
            self.sessionId=sessionId;
           if(sessionId == null){
             self.isLoading = false;
             return
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

            self.mpdurl = url;
            console.log(self.mpdurl);
             if(self.mpdurl == null){
               self.isLoading = false;
               return;
             }
            if (url.ErrorCode==undefined&&url.length!=0) {
                self.isPlayingFlag=1;
                self.playVideo(self.mpdurl);
                self.realTimeSpeed=0;
                self.isLoading = false;
                self.timerPlayReal=window.setInterval(()=>{
                    console.log(self.realTimeSpeed)
                    self.realTimeSpeed=self.realTimeSpeed+1;
                },1000);
            }
            else{   //当前视频如果返回失败，需处于暂停状态
                self.showGuide=false;
                self.showError=true;
                self.isLoading = false;
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
                self.destroyVideo();
            }
        },
        controlScreen(){
            let self=this;
            if(!self.fullScreen){
                self.fullWindowScreen();
                self.fullScreen=true;
                // setTimeout(() => {
                //     self.showModelContent=false;
                //     //self.showInfoContent=false;
                // }, 3000);
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
            //self.showControls=true;
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
            console.log(self.tabList);
            console.log(self.serachVale.trim());
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
                            obj.hasInspect=data[j].hasInspect;
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
            console.log(temp);
            for(var i=0;i<temp.length;i++){
                if(temp[i][0].indexOf(self.serachVale.trim())!=-1||
                    temp[i][1].indexOf(self.serachVale.trim())!=-1){
                    tempArray.push(tempStore[i]);
                }
            }
            self.tabList[2].storeList=getStore2Temp(tempArray);
        },
        //切换门店
        changeStore(item,index,_item,_index){
            let self=this;
            _item.isActive=true;
            self.showStoreUp=true;
            if(!self.isEzviz){
              self.editCount=0;
            }
            else{
              if(!self.showGuide){
                self.$refs.ezvizVideo.editCount = 0
              }
            }
            //self.editCount=0;
            self.showError=false;
            self.curDeviceId=-1;
            self.showFeedBack=false;
            self.eventList=[];
            if(self.playState){
                self.stopRealTime();
            }
            self.showGuide=true;
            let obj={};
            obj.storeId=_item.storeId;
            obj.storeName=_item.name;
            obj.storeTitle=_item.name;
            obj.storeUp=_item.favorite;
            self.channel=null;
            self.getChannelByStore(_item);
            if(_item.favorite){
                obj.storeUpTitle= this.$t('remotePatrol.stared');
            }
            else{
                obj.storeUpTitle= this.$t('remotePatrol.clickToStar');
            }
            self.store=obj;
            let curStoreId='';
            self.getInspectByStore(self.store.storeId);
            let tabIndex=Number(self.activeIndex);
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
        },
        changeStoreDialog(val){
            let self=this;
            self.changeStoreObj.dialogCosed=false;
            //self.changeStore(self.curTabItem,self.curTabIndex,self.curStoreItem,self.curStoreIndex);
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

        lastBar(){
            let self=this;
            let width=document.getElementsByClassName('btn-content')[0].offsetWidth;
            let detailsWidth=window.innerWidth/1440*15+60;
            let count=parseInt(width/detailsWidth);
            if(count>=self.channelBtns.length){
                return false;
            }
            else{
                let index=self.getChannelIndexById(self.showChannelBtns[0].id);
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
                let index=self.getChannelIndexById(self.showChannelBtns[count-1].id);
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
        },
        getChannelByStore(storeItem){
            let self=this;
            let temp=[];
            self.hideLast=false;
            self.hideNext=false;
            storeItem.device.forEach((item,index)=>{
                let obj={};
                obj.id=item.id;
                obj.name=item.name;
                obj.ivsId=item.ivsId;
                obj.channelId=item.channelId;
                obj.isonline=true;
                obj.isClick=false;
                temp.push(obj);
            })
            self.channelBtns=temp;
            self.allChannelBtns = temp;
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
            if(!_item.hasInspect&&_item.hasInspect!=undefined){
                return false;
            }
            self.curTabIndex=index;
            self.curTabItem=item;
            self.curStoreIndex=_index;
            self.curStoreItem=_item;
            if(self.isLoading || (self.isEzviz &&!self.showGuide && self.$refs.ezvizVideo.isLoading)){
              self.videoLoadingObj.dialogCosed=true;
              return false;
            }
            if( (!self.isEzviz && self.editCount!=0) || (self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.editCount != 0)){
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
      /**
       * handle ezviz video snapshot
       */
      editEzvizCanvas(src){
          console.log(src)
          let self=this;
          self.sourceList = [];
          let obj={};
          obj.mediaType=2;
          obj.src= src;
          obj.height='100px';
          obj.width='140px';
          obj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.curItemId+'.jpg';
          obj.file=util.base64ToBlob(obj.src);
          obj.deviceId = self.channel.id;
          self.sourceList.push(obj);
          console.log(self.curItemId);
          let tempId=self.getIndexById(self.curItemId);
          console.log(tempId);
          if(tempId!=null){
            self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList.push(obj);
          }
          else{
            self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList=self.sourceList;
          }
          self.sourceListLength = self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.length;
          console.log(self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList)
        },
      /**
       * handle ezviz video picture feedback
       * @param obj
       */
      ezvizPictureFeedback(obj){
        console.log(obj);
        let self = this;
        let srcObj=null;
        let src = obj.src;
        srcObj={
          mediaType:2,
          src:src,
          height:'100px',
          width:'140px',
          fileName:self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.curItemId+'.jpg',
          file:util.base64ToBlob(src),
          deviceId: self.channel.id
        }

        let picObj={
          eventName:obj.eventName,
          eventDes:obj.eventDes,
          sourceObj:srcObj,
        }
        self.eventList.push(picObj);
        self.showFeedBackInfo=false;
      },
      /**
       * handle ezviz video feedback
       * @param obj
       */
      ezvizVideoFeedback(ezvizObj){
        console.log(ezvizObj);
        let self = this;
        let srcObj = {};
        let tempSrcObj = ezvizObj.sourceObj;
        srcObj.src = tempSrcObj.src;
        srcObj.file = tempSrcObj.blob;
        srcObj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.webm';
        srcObj.mediaType=1;
        let videoObj={
          eventName: ezvizObj.eventName,
          eventDes: ezvizObj.eventDes,
          sourceObj: srcObj,
        }
        self.eventList.push(videoObj);
        self.showFeedBackInfo=false;
      },
      /**
       * handle ezviz record video
       */
      confirmEzvizVideo(blob){
        let self = this;
        let url=URL.createObjectURL(blob);
        self.sourceList = [];
        let obj={};
        obj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.channel.channelId+'.webm';
        obj.file=blob;
        obj.mediaType=1;
        obj.src=url;
        obj.height='100px';
        self.sourceList.push(obj);
        console.log(self.curItemId);
        let tempId=self.getIndexById(self.curItemId);
        console.log(tempId);
        if(tempId!=null){
          self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList.push(obj);
        }
        else{
          self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList=self.sourceList;
        }
      },
      getVideoAuthority(){
        let self = this;
        return new Promise((resolve, reject)=>{
          getVideoAuthority().then(res=>{
            console.log(res);
            resolve(res)
          }).then(result=>{
            self.videoAuthority = result.data.authorized;
          })
            .catch(error=>{
            console.log(error);
          })
        })
      },
      itemDescriptionChanged(val, item){
        let self = this;
        let content = filterString.all(val,200);
        console.log(content);
        item.inspectInput = content;
        let length = filterString.getContentLength(val);
        if(length>200){
              item.Ruletip=true
          }else{
              item.Ruletip=false
          }
      },
      eventNameChanged(val){
        let self = this;
        let content = filterString.standard(val,50);
        console.log(content);
        self.eventName = content;
        self.showEventNameInfo = false;
        let length = filterString.getContentLength(val);
        if(length>50){
              this.eventNameRuletip=true
          }else{
              this.eventNameRuletip=false
          }
      },
      eventDesChanged(val){
        let self = this;
        let content = filterString.all(val,200);
        console.log(content);
        self.eventDes = content;
        let length = filterString.getContentLength(val);
        if(length>200){
              this.eventDesRuletip=true
          }else{
              this.eventDesRuletip=false
          }
      },
      notShowInputRuleTips(e,item){
        if(e=='item'){
            item.Ruletip=false
        }else if(e=='eventName'){
            this.eventNameRuletip=false
        }else if(e=='eventDes'){
            this.eventDesRuletip=false
        }
      },
      onPlayerWaiting(e){
        console.log('video is loading')
        this.showModelContent = false
      },
      onPlayerPlaying(e){
        console.log('video is playing')
        this.showModelContent = true
      }
    },
    beforeDestroy() {
      let self = this;
      window.removeEventListener('visibilitychange', self.visibilityChange);
      window.onresize = null;
      self.visibilityChange = null;
    }
}
</script>
<style lang="scss" scoped>
    $red:#f31d65;
    $black:#182752;
    $border:#e3e9f4;
    $background:#f4f5f9;
    $tab:#7d8cad;
    $h1:#292e36;
    .fade-enter-active {
        transition: all 1s ease;
        width: 68px;
        overflow: hidden;
    }
    .fade-leave-active{
        transition: all 1s ease;
        width: 0;
        overflow: hidden;
    }
    .fade-enter, .fade-leave {
        width: 0;
        opacity: 0;
    }
    .fadepen-enter-active,.fadepen-leave-active{
        transition: opacity .5s
    }
    .fadepen-enter, .fadepen-leave-to{
        opacity: 0;
    }
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
            // margin-right: 15px;
            @include point(margin-right,20);
            font-size: 12px;
            line-height: 12px;
        }
        .canvas-content{
            position: relative;
            .rules{
                margin-left: 20px;
                font-size: 10px;
                margin-top: 5px;
                color: #ff2400;
                display: block;
            }
            .dialog-hr{
                border: 0.5px solid ;
                border-color: #dfe2e9;
                margin-bottom:0px;
                position: relative;
                bottom: 5px;
            }
            #icanvas{
                @include point(margin-top,15);
            }
            .dialog-img-content{
                @include point(padding,15);
            }
            .is-required{
              color: $red;
            }
            .error-class{
              @include point(margin-left,20);
              font-size: 10px;
              margin-top: 5px;
              color: #ff2400;
              display: block;
            }
            .dialog-event-content{
                text-align: left;
                @include point(margin-bottom,20);
                .event-title{
                    color: $black;
                    display: block;
                    margin: 15px;
                    @include point(margin-left,20);
                    @include point(margin-right,20);
                    font-size: 14px;
                }
                .name-input{
                    @include point(width,200);
                    @include point(margin-left,20);
                }
                .des-input{
                    display: block;
                    width: auto;
                    @include point(margin-left,20);
                    @include point(margin-right,20);
                }
            }
            .feed-canvas-content{
                width: 65%;
                float: left;
                position: relative;
                text-align: left;
                margin-left: 1%;
                #icanvas{
                    margin-left: 20px;
                }
                .cancel-content{
                    margin-left: 20px !important;
                    height:30px;
                    line-height: 30px;
                }
            }
            .event-content{
                width:33%;
                float: left;
                text-align: left;
                margin-left: 1%;
                padding-right: 20px;
                box-sizing: border-box;
                .event-title{
                    color: $black;
                    display: block;
                    margin: 15px;
                    margin-left: 0;
                    font-size: 14px;
                }
                .error-class {
                  margin-left: 0;
                }
                .name-input{
                  width: 100%;
                    //@include point(width,150);
                    //@include point(margin-bottom,15);
                }
                .des-input{
                    width: 100%;
                }
            }
            #previewCutVideo{
                @include point(margin-bottom,20);
                @include point(margin-top,10);
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
                    text-align: center;
                    float: left;
                    color: #fff;
                    cursor: pointer;
                    width: 49%;
                    &:first-child{
                        border-right: 1px solid #fff;
                    }
                    .icon-clear{
                        position: relative;
                        @include point(top,3);
                        margin-right: 15px;
                    }
                    @media screen and(max-width: 1366px){
                      span{
                        position: relative;
                        @include point(bottom, 4)
                      }
                    }

                }
            }
            .icon-right{
                width: 120px;
                height: auto;
                position: absolute;
                right: 30px;
                top: 5%;
                text-align: center;
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
                        left: 34%;
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
                        left: 34%;
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
        @mixin arrow-icon{
            .guide-num{
                display: inline-block;
                height: calc(28/1920*100vw);
                width: calc(28/1920*100vw);
                line-height: calc(28/1920*100vw);
                border-radius: 50%;
                background-color: $red;
                color: #fff;
                margin-right: 15px;
                font-size: 14px;
                @media screen and (max-width: 1280px){
                  height: 18px;
                  width: 18px;
                  line-height: 18px;
                }
            }
            .guide-title{
                color: $red;
                font-size: calc(14/1920*100vw);
                font-weight: bold;
            }
        }
        .lside{
            padding-bottom: calc(25/1920*100vw);
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
                @media screen and(min-width: 1366px){
                    .lside-title{
                        font-size: 18px;
                    }
                    .storeUp-content{
                        height:22px;
                        width: 105px;
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
                        width: 100px;
                    }
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

                .storeUp-content{
                    display: inline-block;
                    margin-left: 20px;
                    padding: 1px 6px;
                    line-height: 18px;
                    cursor: pointer;
                    position: relative;
                    bottom: 2px;
                    span{
                        font-size: 12px;
                        /*vertical-align: middle;*/
                        margin-left: 4px;
                    }
                }
                .el-submit{
                    position: absolute;
                    @include point(right,20);
                    //@include point(width,90);
                    color: #fff;
                    width:calc(130/1920*100vw);
                    height: calc(36/1920*100vw);
                    padding: 0 0;
                    font-size: calc(14/1920*100vw);
                }
                .en-el-submit{
                    position: absolute;
                    right: calc(30/1920*100vw);
                    width:calc(130/1920*100vw);
                    color: #fff;
                    height: calc(36/1920*100vw);
                    padding: 0 0;
                    font-size: calc(14/1920*100vw);
                    min-height: 28px;
                    top: 50%;
                    transform: translate(0, -50%);
                    min-width: 85px;
                }
                @media screen and(min-width: 1366px){
                    .el-submit{
                        top: 30%;
                    }
                }
                @media screen and(max-width: 1366px){
                    .el-submit{
                        top: 20%;
                    }
                }
            }
            .errorVideo-model{
                @include point(margin,20);
                margin-bottom: 0;
                height: auto;
                position: relative;
                min-height: 420px;
                background-color: #232730;
                color: $red;
                z-index: 100;
                span{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                }
            }
            .guide-content{
                margin: calc(25/1920*100vw);
                margin-bottom: 0;
                height: auto;
                position: relative;
                min-height: 420px;
                background-color: #000;
                .guide-rside{
                    position: absolute;
                    top: 30%;
                    right: 20px;
                    width: 260px;
                    img{
                        @include point(height,42);
                        position: relative;
                        right: 5%;
                        top: 35px;
                    }
                    .num-content{
                        @include arrow-icon;
                    }
                    .iconright-content{
                        width: auto;
                        height: auto;
                        position: absolute;
                        //top: 30%;
                        top: 60%;
                        right: 0;
                        .iconright{
                            width: 80px;
                            text-align: center;
                            margin-top: 30px;
                            height: 32px;
                            line-height: 30px;
                            border-radius: 4px;
                            padding: 0 6px;
                            background-color: rgba($color: #24293d, $alpha: 0.6);
                            .iconpaizhao{
                                color: #fff;
                                vertical-align:middle;
                            }
                            span{
                                color: #fff;
                                font-size: 12px;
                                margin-left: 12px;
                                vertical-align:middle;
                            }
                        }
                        .en-iconright{
                          width: 100px;
                          text-align: center;
                          margin-top: 30px;
                          height: 32px;
                          line-height: 30px;
                          border-radius: 4px;
                          padding: 0 6px;
                          background-color: rgba($color: #24293d, $alpha: 0.6);
                          .iconpaizhao{
                            color: #fff;
                            vertical-align:middle;
                          }
                          span{
                            color: #fff;
                            font-size: 12px;
                            margin-left: 12px;
                            vertical-align:middle;
                          }
                        }
                    }
                }
            }
            .video-content{
                height: auto;
                position: relative;
                margin: calc(25/1920*100vw);
                //@include point(min-width,500);
                //@include point(min-height,408);
                min-height: 420px;
                background-color: #000;
                margin-bottom: 0;
                z-index: 100;
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
                @media screen and(max-width: 1366px){
                    #channelName{
                        font-size: 12px;
                    }
                    .iconright{
                        span{
                            font-size:12px;
                        }
                    }
                    .en-iconright{
                      span{
                        font-size:12px;
                      }
                    }
                     .iconright1{
                        span{
                            font-size:12px;
                        }
                    }
                  .en-iconright1{
                    span{
                      font-size:12px;
                    }
                  }
                }
                @media screen and(min-width: 1366px){
                    #channelName{
                        font-size: 16px;
                    }
                    .iconright{
                        span{
                            font-size:14px;
                        }
                    }
                    .en-iconright{
                      span{
                        font-size:14px;
                      }
                    }
                    .iconright1{
                        span{
                            font-size:14px;
                        }
                    }
                    .en-iconright1{
                      span{
                        font-size:14px;
                      }
                    }
                }
                #previewVideo{
                    //@include point(min-width,500);
                    //@include point(min-height,405);
                    min-height: 420px;
                }
                #channelName{
                    position: absolute;
                    color: #fff;
                    z-index: 10;
                    display: block;
                    width:-webkit-calc(100% - 30px);
                    width:-moz-calc(100% - 30px);
                    width:calc(100% - 30px);
                    height: 40px;
                    line-height: 40px;
                    text-align: left;
                    padding-left: 30px;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                }
                .icon-footer{
                    width: 100%;
                    height: 45px;
                    line-height: 45px;
                    position: absolute;
                    bottom: 0px;
                    color: #fff;
                    overflow: hidden;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    z-index: 10;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    .iconlside{
                        float: left;
                        text-align: left;
                        margin-left: 30px;
                        .iconplay{
                            font-size: 18px;
                            cursor: pointer;
                            float: left;
                        }
                    }
                }
                .screen-content{
                    display: inline;
                    margin-left: 30px;
                    position: absolute;
                    right: 20px;
                    .iconscreen{
                        margin-right: 20px;
                        font-size: 18px;
                        position: relative;
                        cursor: pointer;
                    }
                }
                .iconright{
                    padding: 0 6px;
                    width: 80px;
                    height: 32px;
                    line-height: 30px;
                    position: absolute;
                    z-index: 900;
                    right: 20px;
                    margin-bottom: 40px;
                    border-radius: 4px;
                    text-align: center;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    //top: 40%;
                    top: 45%;
                    span{
                        // font-size: 12px;
                        margin-left: 12px;
                        color: #fff;
                        //margin-right: 35px;
                        cursor: pointer;
                        vertical-align:middle;
                    }
                    .iconpaizhao{
                        color: #fff;
                        cursor: pointer;
                        vertical-align:middle;
                    }
                }
              .en-iconright{
                padding: 0 6px;
                width: 108px;
                height: 32px;
                line-height: 30px;
                position: absolute;
                z-index: 900;
                right: 20px;
                margin-bottom: 40px;
                border-radius: 4px;
                background-color: rgba($color: #24293d, $alpha: 0.6);
                //top: 40%;
                top: 45%;
                span{
                  // font-size: 12px;
                  margin-left: 12px;
                  color: #fff;
                  /*margin-right: 35px;*/
                  cursor: pointer;
                  vertical-align:middle;
                }
                .iconpaizhao{
                  color: #fff;
                  cursor: pointer;
                  vertical-align:middle;
                }
              }
                .iconright1{
                    padding: 0 6px;
                    width: 80px;
                    height: 32px;
                    line-height: 30px;
                    position: absolute;
                    z-index: 900;
                    right: 20px;
                    margin-bottom: 40px;
                    border-radius: 4px;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    top: 56%;
                    text-align: center;
                    span{
                        margin-left: 12px;
                        color: #fff;
                        //margin-right: 32px;
                        cursor: pointer;
                        vertical-align:middle;
                    }
                    .iconpaizhao{
                        color: #fff;
                        cursor: pointer;
                        vertical-align:middle;
                    }
                }
              .en-iconright1{
                padding: 0 6px;
                width: 108px;
                height: 32px;
                line-height: 30px;
                position: absolute;
                z-index: 900;
                right: 20px;
                margin-bottom: 40px;
                border-radius: 4px;
                background-color: rgba($color: #24293d, $alpha: 0.6);
                top: 56%;
                span{
                  margin-left: 12px;
                  color: #fff;
                  //margin-right: 32px;
                  cursor: pointer;
                  vertical-align:middle;
                }
                .iconpaizhao{
                  color: #fff;
                  cursor: pointer;
                  vertical-align:middle;
                }
              }
            }
            .el-inspect{
                border-left: 1px solid $border;
                border-right: 1px solid $border;
                border-bottom: 1px solid $border;
                margin: 0;
                margin-left: calc(25/1920*100vw);
                margin-right: calc(25/1920*100vw);
                position: relative;
                .guide-lside{
                    position: absolute;
                    width: auto;
                    z-index: 1000;
                    img{
                        @include point(height,42);
                        position: relative;
                        right: 15%;
                    }
                }
                .num-content{
                    @include arrow-icon;
                }
                .inspect-header{
                    text-align: left;
                    font-size: 12px;
                    font-weight: bold;
                    color: $tab;
                    background-color: $background;
                    border-bottom:1px solid $border;
                    position: relative;
                    z-index: 100;
                }
                @media screen and (min-width: 1600px){
                    .inspect-header{
                        height: 50px;
                        line-height: 50px;
                    }
                    .inspect-details{
                        height: 50px;
                        line-height: 50px;
                        font-size: 14px;
                    }
                    .guide-lside{
                        top: 10px;
                        right: 10%;
                    }
                }
                @media screen and (max-width: 1600px){
                     .inspect-header{
                        height: 40px;
                        line-height: 40px;
                        span{
                          margin-left: 16px !important;
                        }
                    }
                    .inspect-details{
                        height: 40px;
                        line-height: 40px;
                        font-size: 12px;
                        span{
                          width: 100%;
                          display: block;
                          white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
                          overflow: hidden; //隐藏超出单元格的部分。
                          text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
                        }
                    }
                  .guide-lside{
                    top: 5px;
                    right: 5%;
                  }
                }
                .inspect-content{
                    padding: 15px auto;
                    .item-content{
                        .feedbacks-content{

                            .feedbacks-details{

                                text-align: left;
                                @include point(margin-top,15);
                                @include point(margin-bottom,15);
                                @include point(padding-left,20);
                                @include point(padding-right,15);
                                position: relative;
                                .feedback-eventname{
                                    font-size: 14px;
                                    display: block;
                                    margin-bottom: 8px;
                                    color: $black;
                                }
                                .feedback-eventdes{
                                    font-size: 12px;
                                    display: block;
                                    margin-bottom: 15px;
                                    color: $tab;
                                    margin-left: 15px;
                                    white-space:pre-wrap;
                                }
                                .icon-delete-event{
                                    position: absolute;
                                    right: 0;
                                    @include point(margin-right,15);
                                    cursor: pointer;
                                    color: #fff;
                                    background-color: #D9DBE3;
                                    border-radius: 50%;

                                }
                                .img-content{
                                    position: relative;
                                    width: 140px;
                                    height: 100px;
                                    margin-left: 15px;
                                    .start-icon{
                                        position: absolute;
                                        left: 35%;
                                        top: 30%;
                                        cursor: pointer;
                                    }
                                }
                                .feedbacks-hr{
                                    border: 0.5px solid $border;
                                }
                            }
                        }
                    }
                    #feedback-content{
                        @include point(padding-top,20);
                        @include point(margin-left,30);
                        text-align: left;
                        .feedback-info{
                            display: block;
                            color: $red;
                            font-size: calc(18/1920*100vw);
                            font-weight: bold;
                            &:last-child{
                                @include point(margin-top,30);
                            }
                        }
                    }
                    .feed-arrow{
                        position: relative;
                        @include point(left,30);
                    }
                    .plus-icon{
                        position: absolute;
                        @include point(bottom,10);
                        @include point(right,30);
                        cursor: pointer;
                    }
                    .inspect-details{
                        text-align: left;
                        padding-left: 35px;
                        color: $tab;
                        border-bottom:1px solid #ddd;
                        cursor: pointer;
                        background-color: $background;
                        &:last-child{
                            margin-bottom: 15px;
                        }
                        span{
                          width: 100%;
                          display: block;
                          white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
                          overflow: hidden; //隐藏超出单元格的部分。
                          text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
                        }
                    }
                    .noraml-title{
                        cursor: pointer;
                        opacity: 1;
                    }
                    .ignore-title{
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                    .item-details{
                        text-align: left;
                        min-height: 60px;
                        position: relative;
                        padding: 15px;
                        @include point(padding-left,20);
                        padding-bottom: 0;
                        margin-top: 5px;
                        .rules{
                            margin-left: 20px;
                            font-size: 10px;
                            margin-top: 5px;
                            color: #ff2400;
                            display: block;
                        }
                        &:last-child{
                            margin-bottom: 35px;
                        }
                        .icon-clicked{
                            width: 4px;
                            min-height: 40px;
                            height: calc(100% - 50px);
                            position: absolute;
                            top:50px;
                            background-color: $red;
                        }
                        @media screen and(max-width:1366px) {
                            .titles{
                                font-size: 12px;
                                width: 50%;
                                display: inline-block;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                            .details-content{
                                @include point(font-size,12);
                            }
                        }
                        @media screen and(min-width:1366px) {
                            .titles{
                                font-size: 14px;
                                width: 55%;
                                display: inline-block;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                            .details-content{
                                font-size: 12px;
                            }
                        }
                        .details-content{
                            // font-size: 12px;
                            color: $tab;
                            margin-top: 15px;
                            span{
                                margin-left: 15px;
                                display: block;
                            }
                        }
                        .source-content{
                            min-height: 110px;
                            width: 90%;
                            margin: auto 20px;
                            .source-details{
                                display: inline-block;
                                margin-right: 15px;
                                padding-top: 15px;
                                position: relative;
                                span{
                                    font-size: 12px;
                                    color: #FCB83B;
                                    margin-top: 0;
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
                                .img-content{
                                    width: 100%;
                                    height: 100%;
                                    position: relative;
                                }
                                .start-icon{
                                    position: absolute;
                                    left: 35%;
                                    top: 30%;
                                    cursor: pointer;
                                }
                            }
                        }
                        .des-input{
                            margin-left: 15px;
                            width:-webkit-calc(100% - 20px);
                            width:-moz-calc(100% - 20px);
                            width:calc(100% - 20px);
                            margin-top: 15px;
                        }
                        .iconhulve{
                            position: absolute;
                            color: #ddd;
                            font-size: 20px;
                            @include point(right,20);
                            @include point(top,10);
                            cursor: pointer;
                        }
                        .ignored-icon{
                            display:inline-block;
                            position: absolute;
                            @include point(right,10);
                            // @include point(top,10);
                            font-size: 12px;
                            padding:2px 6px;
                            border-radius: 4px;
                            color: #fff;
                            background-color: $black;
                            cursor: not-allowed;
                            max-width: 58px;
                        }
                        .dropdown-model{
                            position: absolute;
                            @include point(right,60);
                            @include point(top,12);
                            margin-right: 10px;
                            width: 120px;
                            height: 22px;
                            background-color: transparent;
                            z-index: 20;
                            cursor: not-allowed;
                        }
                        .item-score{
                            box-sizing: border-box;
                            position: absolute;
                            @include point(right,60);
                            @include point(top,12);
                            font-size: 12px;
                            margin-right: 20px;
                            //width: 96px;
                            width: 110px;
                            height: 22px;
                            // @include point(width,86);
                            //@include point(padding-left,10);
                            background-color: orange;
                            line-height: 22px;
                            color: #fff;
                            border-radius: 13px;
                            cursor: pointer;
                            .iconscore{
                                //margin-left: 10px;
                            }
                          .el-dropdown-link{
                            display: inline-block;
                            font-size: 12px;
                            margin-right: 20px;
                            width: 120px;
                            height: 22px;
                            background-color: orange;
                            line-height: 22px;
                            color: #fff;
                            border-radius: 13px;
                            cursor: pointer;
                            padding-right: 10px;
                            box-sizing: border-box;
                            padding-left: 10px
                          }
                        }
                        .score-menu{
                            max-height: 160px;
                            overflow: hidden;

                        }
                    }
                    .inspect-empty{
                        height: 160px;
                        position: relative;
                        span{
                            position: absolute;
                            top: 40%;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .rside{
            border: 1px solid $border;
            background-color: #fff;
            //@include point(margin-right,20);
            .el-header-title{
                text-align: left;
                position: relative;
                color:$black;
                font-size: calc(16/1920*100vw);
                height: 80px;
                line-height: 80px;
                border-bottom: 1px solid $border;
                padding-left: calc(10/1920*100vw);
                span{
                    display: block;
                    margin-left: calc(30/1920*100vw);
                }
            }
            #storetab-content, #en-storetab-content{
                margin-top: 10px;
                margin-left: calc(20/1920*100vw);
                margin-right: calc(20/1920*100vw);
                .storeList-content{
                    padding: 0 10px;
                    text-align: left;
                    height: 392px;
                    color: $black;
                    .icon-info{
                        color: #FF9803;
                        font-size: 12px;
                        display: block;
                        @include point(margin,5);
                        @include point(margin-left,15);
                    }
                    .activeClass{
                        background-color: #FDE8EF !important;
                        color: $red;
                        border-color: $red !important;
                    }
                    .stores{
                        &:last-child{
                            @include point(margin-bottom,20);
                        }
                    }
                    .el-search-input{
                        @include point(width,200);
                        @include point(margin-left,15);
                        @include point(margin,15);
                        @include point(margin-top,10);
                    }
                    .storename{
                        display: inline-block;
                        @include point(margin-left,15);
                        margin-top: 10px;
                        margin-bottom: 15px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        @include point(width,76);
                        @include point(padding,6);
                        white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
                        overflow: hidden; //隐藏超出单元格的部分。
                        text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
                    }
                    .store-name{
                        display: inline-block;
                        @include point(margin-left,15);
                        margin-top: 10px;
                        margin-bottom: 15px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        @include point(width,76);
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
                        @include point(margin-left,20);
                    }
                }
            }
            .patrol-select{
                height:160px;
                width:92%;
                text-align: left;
                margin:0 auto;
                border-top:0.5px solid #e3e9f4;
                .patrol-content{
                    padding: 0 30px;
                    .patrol-title{
                        font-size:14px;
                        color:#182752;
                        font-weight: bold;
                        margin:30px 0 20px 0;
                        .patrol-elselect{
                            width:234px;
                        }
                    }
                }
            }
            .channelbar-content{
                .rside-hr{
                    width: 100%;
                    border: 0.5px solid $border;
                }
                .channel-content{
                    width: 100%;
                    overflow: hidden;
                    margin-top: 10px;
                    span{
                        display: block;
                        text-align: left;
                        margin-left: 40px;
                        color: $black;
                        margin-bottom: 15px;
                        font-size: calc(16/1920*100vw);
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
                            display: inline-block;
                            margin-bottom: 5px;
                            margin-left: calc(20/1920*100vw);
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            &:last-child{
                              margin-right: calc(20/1920*100vw);
                            }
                        }
                    }
                }
            }
        }
        .noraml-color{
            background-color: #fff !important;
            color: $black !important;
            font-weight: bold;
        }
        .noraml-groupColor{
            background-color: $background !important;
        }
    }
</style>
<style>
#storetab-content .el-tabs__nav-scroll{
    width: 100%;
}


#storetab-content.el-tabs__item{
    color:#7d8cad !important;
}
#storetab-content.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #f31d65 !important;
}
#storetab-content.el-tabs__item:hover{
    color: #f31d65 !important;
}

@media screen and (min-width: 1366px){
    #storetab-content .el-tabs__nav.is-top{
        margin-left: 10%;
        width: 80%;
    }

}
@media screen and (max-width: 1366px){
    #storetab-content .el-tabs__nav.is-top{
        width: 100%;
    }
    span.el-tabs__nav-prev{
        visibility: hidden;
    }
    .el-tabs__nav-next{
        visibility: hidden;
    }
}
#storetab-content div#tab-0{
    width:33.33%;
}
#storetab-content div#tab-1{
    width:33.33%;
}
#storetab-content div#tab-2{
    width:33.33%;
}
.item-score .el-icon--right{
    position: absolute !important;
    right: 1px !important;
    top: 6px !important;
}
#storetab-content .el-tabs__active-bar .is-top{
  width: 115px !important;
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
        font-family:Roboto, Arial, 'Microsoft YaHei';
    }
  .score-menu.el-dropdown-menu{
    z-index: 0 !important;
  }
  .confirmClass{
    width: 28%;
    font-family: Roboto, Arial, 'Microsoft YaHei';
  }
  .confirmClass .el-message-box__header{
    border-bottom: 0.5px solid #dfe2e9;
    padding: 20px;
    padding-bottom: 17px;
    font-size: 14px;
  }
  .confirmClass .el-message-box__content{
    padding: 20px;
  }
  .confirmClass .el-message-box__header .el-message-box__title{
    font-size: 14px;
    line-height: 24px;
  }
  .confirmClass .cancelBtn{
    width: 4.75rem;
    margin-right: calc(20/1920*100vw);
    background-color: #EAEDF2 !important;
    color: #708090 !important;
    font-size: 12px;
    line-height: 12px;
  }
 .confirmClass .confirmBtn{
    width: 4.75rem;
    background-color: #f31d65;;
    color: #fff !important;
    font-size: 12px;
    line-height: 12px;
    }
  .confirmClass .el-message-box__btns{
    padding: 20px;
    padding-top: 10px;
  }
  .confirmClass .el-message-box__headerbtn{
    font-size: calc(20/1920*100vw);
    top: 20px;
  }
</style>
