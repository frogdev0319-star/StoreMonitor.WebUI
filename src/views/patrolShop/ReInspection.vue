<template>
  <el-row :class="isREC?'noeventClass':''" class="el-container">
    <el-col :span="16" :class="{liseAnmiClass:showSpread}" class="lside">
      <div class="el-header-title">
        <span v-if="showStoreUp" class="lside-title">
          {{ store.storeTitle }}
        </span>
        <div v-if="showStoreUp" :class="store.storeUp?'coll':'nocoll'" class="storeUp-content" @click="addStoreUp">
          <i :class="store.storeUp?'coll-icon':'nocoll-icon'" class="iconfont icon-iconfontstart" style="vertical-align: middle;"/>
          <span :class="store.storeUp?'coll-font':'nocoll-font'">{{ store.storeUpTitle }}</span>
        </div>
        <el-button v-if="sheetName.length!=0" :disabled="isDisabled?false:true" :class="lang== 'en' ? 'en-el-submit' :'el-submit'" :size="varyWindowWidth>1680?'small':'mini'" type="primary" @click="confirmSummary">
          {{ $t('remotePatrol.confirmSum') }}
        </el-button>
      </div>
      <el-dialog
        v-if="showCutDialog"
        :title="$t('remotePatrol.edit')"
        :visible.sync="showCutDialog"
        :close-on-click-modal="false"
        :width="860*percentHeight+'px'"
        height="300px"
        top="5%">
        <div class="canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
          <hr class="dialog-hr">
          <div v-if="showPenBtn" id="iconR" class="icon-right">
            <img :src="penBtnSrc" class="pen-btn" @click="showPenList">
            <transition name="fadepen">
              <div v-if="showPen" class="pen-content">
                <div v-for="(item,index) in penList" :key="index" class="content">
                  <div :class="{colorActive:item.showContent}"/>
                  <div :id="item.id" class="color" @click="checkPen(item,index)"/>
                </div>
              </div>
            </transition>
          </div>
          <canvas
            id="icanvas"
            :width="767*percentHeight"
            :height="431*percentHeight"
            @mousedown="mouseDownAction($event)"
            @mousemove="mouseMoveAction($event)"/>
          <div
            v-if="showCancelContent"
            :style="{'width':767*percentHeight+'px',
                     'margin-left':47*percentHeight+'px'}"
            class="cancel-content">
            <div class="content" @click="cancelEditCanvas">
              <img :src="clearIconSrc" class="icon-clear" height="22px">
              <span>{{ $t('remotePatrol.clear') }}</span>
            </div>
            <div class="content" @click="confirmEditCanvas">
              <img :src="removeIconSrc" class="icon-clear" height="22px">
              <span>{{ $t('remotePatrol.cancel') }}</span>
            </div>
          </div>
        </div>
        <div slot="footer">
          <el-button id="cancelBtn" size="mini" @click="showCutDialog = false">{{ $t('remotePatrol.cancel') }}</el-button>
          <el-button id="confirmBtn" size="mini" type="primary" @click="confirmEdit">{{ $t('remotePatrol.confirm') }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="dialogCommentVideo"
        :title="$t('remotePatrol.view')"
        :visible.sync="dialogCommentVideo"
        :close-on-click-modal="false"
        :width="680*percentHeight+'px'"
        height="300px"
        top="5%">
        <div class="canvas-content">
          <hr class="dialog-hr">
          <video
            id="previewCutVideo"
            :width="580*percentHeight"
            :height="420*percentHeight"
            :src="curVideoSrc"
            prload
            controls
            autoplay/>
        </div>
      </el-dialog>
      <el-dialog
        v-if="showOuter"
        :title="$t('remotePatrol.view')"
        :visible.sync="showOuter"
        :close-on-click-modal="false"
        :width="680*percentHeight+'px'"
        height="300px"
        top="5%">
        <div class="canvas-content" style="overflow:hidden;">
          <hr class="dialog-hr">
          <div class="dialog-img-content">
            <img :src="checkImgSrc" :width="600*percentHeight" :height="430*percentHeight">
          </div>
        </div>
      </el-dialog>
      <el-dialog
        v-if="showFeedDialog1"
        :title="$t('remotePatrol.feedbacks')"
        :visible.sync="showFeedDialog1"
        :close-on-click-modal="false"
        :width="480*percentHeight+'px'"
        top="12%">
        <div class="canvas-content" style="overflow:hidden;">
          <hr class="dialog-hr">
          <div class="dialog-event-content">
            <span class="event-title"><span class="is-required">*</span>{{ $t('remotePatrol.name') }}</span>
            <el-input v-model="eventName" size="mini" class="name-input" @input="eventNameChanged" @blur="notShowInputRuleTips('eventName')"/>
            <span v-if="eventNameRuletip" class="rules">{{ $t('remotePatrol.eventNameRuletip') }}</span>
            <span v-if="showEventNameInfo" class="error-class">{{ $t('remotePatrol.emptyTitle') }}</span>
            <span class="event-title">{{ $t('remotePatrol.description') }}</span>
            <el-input
              :autosize="{ minRows: 2, maxRows: 7}"
              v-model="eventDes"
              :placeholder="$t('remotePatrol.descPlaceholder')"
              size="mini"
              class="des-input"
              type="textarea"
              resize="none"
              @input="eventDesChanged"
              @blur="notShowInputRuleTips('eventDes')"/>
            <span v-if="eventDesRuletip" class="rules">{{ $t('remotePatrol.comentRuletip') }}</span>
          </div>
        </div>
        <div slot="footer">
          <el-button id="cancelBtn" size="mini" @click="showFeedDialog1 = false">{{ $t('remotePatrol.cancel') }}</el-button>
          <el-button id="confirmBtn" size="mini" type="primary" @click="confirmAddFeedBack1">
            {{ $t('remotePatrol.confirm') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="showFeedDialog2"
        :title="$t('remotePatrol.feedbacks')"
        :visible.sync="showFeedDialog2"
        :close-on-click-modal="false"
        :width="860*percentHeight+'px'"
        height="300px"
        top="5%">
        <div class="canvas-content" style="overflow:hidden;">
          <hr class="dialog-hr">
          <div class="feed-canvas-content" v-if="feedbackIndex === -1" @mouseenter="showCancel" @mouseleave="hiddenCancel">
            <div v-if="showPenBtn" id="iconR" class="icon-right">
              <img :src="penBtnSrc" class="pen-btn" @click="showPenList">
              <transition name="fadepen">
                <div v-if="showPen" class="pen-content">
                  <div v-for="(item,index) in penList" :key="index" class="content">
                    <div :class="{colorActive:item.showContent}"/>
                    <div :id="item.id" class="color" @click="checkPen(item,index)"/>
                  </div>
                </div>
              </transition>
            </div>
            <canvas
              id="icanvas"
              :width="520*percentHeight"
              :height="340*percentHeight"
              @mousedown="mouseDownAction($event)"
              @mousemove="mouseMoveAction($event)"/>
            <div
              v-if="showCancelContent"
              :style="{'width':520*percentHeight+'px',
                       'margin-left':47*percentHeight+'px'}"
              class="cancel-content">
              <div class="content" @click="cancelEditCanvas">
                <img :src="clearIconSrc" class="icon-clear" height="22px">
                <span>{{ $t('remotePatrol.clear') }}</span>
              </div>
              <div class="content" @click="confirmEditCanvas">
                <img :src="removeIconSrc" class="icon-clear" height="22px">
                <span>{{ $t('remotePatrol.cancel') }}</span>
              </div>
            </div>
          </div>
          <div class="feed-canvas-content" v-else>
            <img
              :width="520*percentHeight"
              :height="340*percentHeight"
              class="canvas-img"
              :src="eventList[feedbackIndex].sourceObj.src">
          </div>
          <div class="event-content">
            <span class="event-title"><span class="is-required">*</span>{{ $t('remotePatrol.name') }}</span>
            <el-input v-model="eventName" size="mini" class="name-input" @input="eventNameChanged" @blur="notShowInputRuleTips('eventName')"/>
            <span v-if="eventNameRuletip" class="rules" style="margin-left:0;">{{ $t('remotePatrol.eventNameRuletip') }}</span>
            <span v-if="showEventNameInfo" class="error-class">{{ $t('remotePatrol.emptyTitle') }}</span>
            <span class="event-title">{{ $t('remotePatrol.description') }}</span>
            <el-input
              :autosize="{ minRows: 4, maxRows: 7}"
              v-model="eventDes"
              :placeholder="$t('remotePatrol.descPlaceholder')"
              size="mini"
              class="des-input"
              type="textarea"
              resize="none"
              @input="eventDesChanged"
              @blur="notShowInputRuleTips('eventDes')"/>
            <span v-if="eventDesRuletip" class="rules" style="margin-left:0;">{{ $t('remotePatrol.comentRuletip') }}</span>
          </div>
        </div>
        <div slot="footer">
          <el-button id="cancelBtn" size="mini" @click="showFeedDialog2 = false">{{ $t('remotePatrol.cancel') }}</el-button>
          <el-button id="confirmBtn" size="mini" type="primary" @click="confirmAddFeedBack2">
            {{ $t('remotePatrol.confirm') }}</el-button>
        </div>
      </el-dialog>

      <dialog-vue :dialog-title="changeBrandObj.title" :show-info="changeBrandObj.showInfo" :is-warning="changeBrandObj.isWarning" :dialog-closed="changeBrandObj.dialogCosed" @confirmed="changeBrandDialog" @canceled="canceldChangeBrand"/>
      <dialog-vue :dialog-title="changeStoreObj.title" :show-info="changeStoreObj.showInfo" :is-warning="changeStoreObj.isWarning" :dialog-closed="changeStoreObj.dialogCosed" @confirmed="changeStoreDialog" @canceled="canceldChangeStore"/>
      <dialog-vue :dialog-title="changeInspectObj.title" :show-info="changeInspectObj.showInfo" :is-warning="changeInspectObj.isWarning" :dialog-closed="changeInspectObj.dialogCosed" @confirmed="changeInspectDialog" @canceled="canceldChangeInspect"/>
      <dialog-vue :dialog-title="noBindDeviceObj.title" :show-info="noBindDeviceObj.showInfo" :is-warning="noBindDeviceObj.isWarning" :dialog-closed="noBindDeviceObj.dialogCosed" @confirmed="noBindDeviceDialog" @canceled="canceldNoBind"/>
      <dialog-vue :dialog-title="noAllInspectObj.title" :show-info="noAllInspectObj.showInfo" :is-warning="noAllInspectObj.isWarning" :dialog-closed="noAllInspectObj.dialogCosed" @confirmed="noAllInspectDialog" @canceled="canceldNoAllInspect"/>
      <dialog-vue :dialog-title="allIgnoreObj.title" :show-info="allIgnoreObj.showInfo" :is-warning="allIgnoreObj.isWarning" :dialog-closed="allIgnoreObj.dialogCosed" @confirmed="allIgnoreDialog" @canceled="cancelAllIgnore"/>
      <dialog-vue :dialog-title="leaveObj.title" :show-info="leaveObj.showInfo" :is-warning="leaveObj.isWarning" :dialog-closed="leaveObj.dialogCosed" @confirmed="leaveDialog" @canceled="cancelLeave"/>
      <div v-if="showGuide && inspectList.length > 0" class="guide-content">
        <div class="guide-rside">
          <div class="num-content">
            <span class="guide-num">2</span>
            <span class="guide-title">
              {{ $t('remotePatrol.takeSnapshot') }}
            </span>
          </div>
          <img :src="arrows2Src" alt="arrow2">
          <div class="iconright-content">
            <div :class="lang== 'en'? 'en-iconright' : 'iconright'">
              <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"/>
              <span>{{ $t('remotePatrol.snapshot') }}</span>
            </div>
            <div :class="lang== 'en'? 'en-iconright' : 'iconright'" style="display: none">
              <i v-if="lang =='en' " class="iconfont icon-luxiang iconpaizhao" style="font-size:21px;"/>
              <i v-else class="iconfont icon-luxiang iconpaizhao" style="font-size:21px"/>
              <span>{{ $t('remotePatrol.record') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="!isEzviz">
          <div v-if="showError" class="errorVideo-model">
            <span>{{ errorText }}</span>
          </div>
          <div
            v-loading="isLoading"
            v-else
            id="videoContent"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="video-content"
            @mouseleave="hiddenModel"
            @mouseenter="showModel"
            @mousemove="showModel">
            <div v-if="showGetVideo" class="getvideo-content">
              <div class="btn-graph">
                <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"/>
              </div>
              <canvas id="vcanvas" :width="varyWindowWidth*0.418+'px'" :height="varyWindowWidth*0.282+'px'"/>
            </div>
            <span v-if="showInfoContent" id="channelName">{{ channel!=null?channel.channelName:'' }}</span>
            <div v-if="showInfoContent" class="icon-footer" >
              <div class="iconlside">
                <i :class="paused ? 'icon-bofang1' : 'icon-zantingtingzhi'"class= "iconfont iconplay" @click="onPlay"/>
              </div>
              <div class="screen-content">
                <i
                  :class="fullScreen?'icon-tuichuquanping':'icon-quanping'"
                  class="iconfont iconscreen"
                  @click="controlScreen"/>
                <i v-if="false" class="iconfont icon-gongge iconscreen" @click="gonggeScreen"/>
              </div>
            </div>
            <transition name="fade">
              <div v-if="showModelContent" :class="lang== 'en'? 'en-iconright' : 'iconright'" @click="cutPicture">
                <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"/>
                <span>{{ $t('remotePatrol.snapshot') }}</span>
              </div>
            </transition>
            <video
              v-if="showVideo"
              id="previewVideo"
              :controls="showControls"
              :paused="paused"
              :muted = "muted"
              :src="uri"
              height="83%"
              width="90%"
              prload
              autoplay
              class="video-js vjs-fill"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"/>
          </div>
        </div>
        <ezviz-video
          v-else
          ref="ezvizVideo"
          :channel-info="channel"
          :source-list-length= "sourceListLength"
          :show-feed-back="showFeedBack"
          :show-feed-dialog2="showFeedDialog2"
          :store-id="store.storeId"
          :video-authority="videoAuthority"
          @confirmEzvizCanvas="editEzvizCanvas"
          @ezvizCutPictureFeedback="ezvizPictureFeedback"/>
      </div>
      <div class="el-inspect">
        <div v-if="showGuide && sheetName.length > 0" class="guide-lside">
          <div class="num-content">
            <span class="guide-num">1</span>
            <span class="guide-title">
              {{ $t('remotePatrol.startPatrol') }}
            </span>
          </div>
          <img :src="arrows1Src" alt="arrow1">
        </div>
        <el-row v-if="sheetName.length!=0" class="inspect-title">
          <el-col v-if="!notShowAlert" :span="24">
            <el-alert v-if="!isShowWarn&&!showIgnoreItem" :title="$t('remotePatrol.allIgnored')" :closable="false" type="warning"/>
            <el-alert v-if="isShowWarn" :closable="false" type="warning" show-icon><span style="cursor: pointer;font-weight:bold;" @click="hasIgnoreItem">{{ $t('remotePatrol.clickToContent') }}</span></el-alert>
            <el-alert v-if="showIgnoreItem" :closable="false" type="info" class="info-alert">
              <div class="info-left">{{ $t('remotePatrol.hasIgnoreContent') }}</div>
              <div class="info-right" @click="backToPatrol"><img :src="backicon"><span>{{ $t('remotePatrol.backToallsheet') }}</span></div>
            </el-alert>
          </el-col>
        </el-row>
        <el-row v-if="sheetName.length!=0&&!showIgnoreItem" class="inspect-content">
          <el-col :span="8">
            <el-scrollbar style="height:100%;" class="el-menuscrollbar">
              <div style="background-color:#f4f5f9;height:316.06px;">
                <div v-for="(_item,_index) in sheetName" :key="_index" class="Group-content">
                  <div :class="_item.isClick?'noraml-color':'noraml-groupColor'" class="Group-content-title" @click="changeSheet(_item,_index)">
                    <!-- <span v-if="_item.label==$t('insSettingView.sheetpassfail')" style="color:red;">*</span> -->
                    <span>{{ _item.label }}</span>
                    <span v-if="_item.groupId==undefined">（{{ _item.dealCount+'/'+_item.count }}）</span>
                    <i v-if="_item.groupId==undefined&&!_item.isClick" class="el-icon-arrow-right icon"/>
                    <i v-if="_item.groupId==undefined&&_item.isClick" class="el-icon-arrow-down icon"/>
                  </div>
                  <div v-if="_item.isClick&&_item.groupId==undefined" class="Group-content-details">
                    <div
                      v-for="(item,index) in inspectList"
                      :key="index"
                      :style="item.isHover||item.isClick?'color:#f31b65;background-color:#fddde8;':''"
                      class="inspect-details"
                      @click="getItemByGroup(item,index)"
                      @mouseover="mouseoverGroup(item,index)"
                      @mouseout="mouseoutGroup(item,index)">
                      <span>{{ item.groupName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-col>
          <el-col id="inspectContent" :span="16">
            <el-scrollbar ref="myScrollbar" style="height:100%;" class="el-menuscrollbar">
              <div v-if="!showFeedBack" style="height:299.84px;">
                <div v-for="(item,index) in inspectItemList" :key="index" class="item-details">
                  <span
                    :class="!item.manualIgnore?'noraml-title':'ignore-title'"
                    :style="item.checked?{'font-weight':'bold'}:{}"
                    :title="`${index+1}. ${item.subject}`"
                    class="titles"
                    @click="clickItem(item,index)">{{ `${index+1}. ${item.subject}` }}</span>
                  <div v-if="item.disabled" class="dropdown-model"/>
                  <div v-if="inspectList[0].type!=1" :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="check_scoring">
                    <p v-for="(itemDS,indexDs) in item.scoreList" :key="indexDs" :class="itemDS.isClick?'check_isClick':'check_normal'" @click="checkScore(item,itemDS,0)">{{ itemDS.scoreTitle }}</p>
                  </div>
                  <el-dropdown v-else :class="!item.manualIgnore?'noraml-title':'ignore-title'" trigger="click" class="item-score" size="small">
                    <span class="el-dropdown-link">
                      {{ `${$t('remotePatrol.scoreUnit')}${item.itemScoreTitle}` }}
                      <i class="el-icon-arrow-down el-icon--right"/>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="score-menu">
                      <el-dropdown-item
                        v-for="itemDS in item.itemScoreLength"
                        :key="itemDS"
                        style="width:70px;text-align:center;"
                        @click.native="checkScore(item,itemDS,1)">{{ itemDS }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <i v-if="!item.manualIgnore" class="iconfont icon-hulve iconhulve" @click="ignoreItem(item,index,0)"/>
                  <img v-if="item.manualIgnore" class="iconfont iconhulve" src="../../../static/img/ignore_cancel.png" @click="CancleIgnoreItem(item,index)">
                  <div v-if="item.checked" class="icon-clicked"/>
                  <div :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="details-content">
                    <span>{{ item.description }}</span>
                  </div>
                  <div v-if="item.sourceList.length!=0" :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="source-content">
                    <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                      <div v-if="_item.mediaType==2" class="img-content">
                        <i class="el-icon-close icondelete" @click="deleteImg(item,_index)" />
                        <img :src="_item.src" :width="_item.width" :height="_item.height" style="cursor: pointer" @click="openOuter(_item)">
                      </div>
                      <div v-if="_item.mediaType==1" class="img-content">
                        <i class="el-icon-close icondelete" @click="deleteImg(item,_index)" />
                        <img :src="startIcon" :height="36" class="start-icon" @click="playCutVideo(_item,_index)">
                        <img :src="videoImgSrc" :height="_item.height" class="imgLittle">
                      </div>
                    </div>
                  </div>
                  <el-input
                    :autosize="{ minRows: 2, maxRows:7}"
                    v-model="item.inspectInput"
                    :placeholder="$t('remotePatrol.coment')"
                    :disabled="item.disabled"
                    size="mini"
                    class="des-input"
                    type="textarea"
                    resize="none"
                    @input="(val)=>itemDescriptionChanged(val,item)"
                    @blur="notShowInputRuleTips('item',item)"/>
                  <span v-if="item.Ruletip" class="rules">{{ $t('remotePatrol.comentRuletip') }}</span>
                </div>
              </div>
              <div v-if="!showFeedBackInfo&&showFeedBack" class="item-content" style="height:299.84px;">
                <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                  <div class="feedbacks-content">
                    <div v-for="(item,index) in eventList" :key="index" class="feedbacks-details">
                      <i class="el-icon-close icon-delete-event" @click="deleteEvent(item,index)" />
                      <div @click="editFeedback(item, index)" class="title-description">
                        <span class="feedback-eventname">{{ `${index+1}. ${item.eventName}` }}</span>
                        <span class="feedback-eventdes">{{ item.eventDes }}</span>
                      </div>
                      <div v-if="item.sourceObj!=null&&item.sourceObj.mediaType==2" class="img-content">
                        <img
                          :src="item.sourceObj.src"
                          :width="item.sourceObj.width"
                          :height="item.sourceObj.height"
                          class="feedback-pic"
                          @click="openOuter(item.sourceObj)">
                      </div>
                      <div v-if="item.sourceObj!=null&&item.sourceObj.mediaType==1" class="img-content">
                        <img :src="startIcon" :height="36" class="start-icon" @click="playCutVideo(item,index)">
                        <img :src="videoImgSrc" class="imgLittle" height="100">
                      </div>
                      <hr class="feedbacks-hr">
                    </div>
                  </div>
                </el-scrollbar>
                <img :src="plusSrc" alt="plusSrc" class="plus-icon" @click="addFeedBack">
              </div>
            </el-scrollbar>
            <div v-if="showFeedBackInfo&&showFeedBack" class="item-content" style="height:299.84px;">
              <div id="feedback-content">
                <span class="feedback-info">{{ $t('remotePatrol.methodI') }}</span>
                <span class="feedback-info">{{ $t('remotePatrol.methodII') }}</span>
              </div>
              <img :src="arrows2Src" alt="arrow2" class="feed-arrow" height="70">
              <img :src="plusSrc" alt="plusSrc" class="plus-icon" @click="addFeedBack">
            </div>
          </el-col>
        </el-row>
        <el-row v-if="showIgnoreItem" class="inspect-content" style="padding-left: calc(15/1920*100vw);">
          <el-col id="inspectContent" :span="24">
            <el-scrollbar ref="myScrollbar" style="height:100%;" class="el-menuscrollbar">
              <div style="height:299.84px;">
                <div v-for="(item,index) in hasIgnoretemp" :key="index" class="item-details">
                  <span
                    :class="!item.manualIgnore?'noraml-title':'ignore-title'"
                    :style="item.checked?{'font-weight':'bold'}:{}"
                    :title="`${index+1}. ${item.subject}`"
                    class="titles"
                    @click="clickItem(item,index)">{{ `${index+1}. ${item.subject}` }}</span>
                  <div v-if="item.disabled" class="dropdown-model"/>
                  <div v-if="item.type!=1" :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="check_scoring">
                    <p v-for="(itemDS,indexDs) in item.scoreList" :key="indexDs" :class="itemDS.isClick?'check_isClick':'check_normal'" @click="checkIgnoreScore(item,itemDS,0,index)">{{ itemDS.scoreTitle }}</p>
                  </div>
                  <el-dropdown v-else :class="!item.manualIgnore?'noraml-title':'ignore-title'" trigger="click" class="item-score" size="small">
                    <span class="el-dropdown-link">
                      {{ `${$t('remotePatrol.scoreUnit')}${item.itemScoreTitle}` }}
                      <i class="el-icon-arrow-down el-icon--right"/>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="score-menu">
                      <el-dropdown-item
                        v-for="itemDS in item.itemScoreLength"
                        :key="itemDS"
                        style="width:70px;text-align:center;"
                        @click.native="checkIgnoreScore(item,itemDS,1,index)">{{ itemDS }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <i v-if="!item.manualIgnore" class="iconfont icon-hulve iconhulve" @click="ignoreItem(item,index,1)"/>
                  <img v-if="item.manualIgnore" class="iconfont iconhulve" src="../../../static/img/ignore_cancel.png" @click="CancleIgnoreItem(item,index)">
                  <div v-if="item.checked" class="icon-clicked"/>
                  <div :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="details-content">
                    <span>{{ item.description }}</span>
                  </div>
                  <div v-if="item.sourceList.length!=0" :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="source-content">
                    <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                      <div v-if="_item.mediaType==2" class="img-content">
                        <i class="el-icon-close icondelete" @click="deleteImg(item,_index)" />
                        <img :src="_item.src" :width="_item.width" :height="_item.height" style="cursor: pointer" @click="openOuter(_item)">
                      </div>
                      <div v-if="_item.mediaType==1" class="img-content">
                        <i class="el-icon-close icondelete" @click="deleteImg(item,_index)" />
                        <img :src="startIcon" :height="36" class="start-icon" @click="playCutVideo(_item,_index)">
                        <img :src="videoImgSrc" :height="_item.height" class="imgLittle">
                      </div>
                    </div>
                  </div>
                  <el-input
                    :autosize="{ minRows: 2, maxRows:7}"
                    v-model="item.inspectInput"
                    :placeholder="$t('remotePatrol.coment')"
                    :disabled="item.disabled"
                    size="mini"
                    class="des-input"
                    type="textarea"
                    resize="none"
                    @input="(val)=>itemDescriptionChanged(val,item)"
                    @blur="notShowInputRuleTips('item',item)"/>
                  <span v-if="item.Ruletip" class="rules">{{ $t('remotePatrol.comentRuletip') }}</span>
                </div>
              </div>
            </el-scrollbar>
          </el-col>
        </el-row>
        <el-row v-if="sheetName.length==0" class="inspect-content">
          <div class="inspect-empty">
            <span>{{ $t('remotePatrol.noItems') }}</span>
          </div>
        </el-row>
      </div>
    </el-col>
    <el-col v-if="!showSpread" :span="8" class="rside">
      <div class="el-header-title">
        <span>{{ $t('remotePatrol.selectStrore') }}</span>
      </div>
      <el-tabs v-model="activeIndex" :id="lang== 'en'? 'en-storetab-content': 'storetab-content'" style="heigth: 50%" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
          <el-scrollbar style="height:100%;" class="el-menuscrollbar">
            <div v-if="index!=2" class="storeList-content">
              <span v-if="item.storeList.length!=0" class="icon-info">* {{ $t('remotePatrol.cannotSwitch') }}</span>
              <!-- <span v-for="(_item,_index) in item.storeList" :key="_index" class="storename"
                            :class="_item.isActive?'activeClass':''" @click="clickStore(item,index,_item,_index)">
                                {{_item.name}}
                            </span> -->
              <div
                v-for="(_item,_index) in item.storeList"
                :key="_index"
                :class="_item.isActive?'activeClass':''"
                :style="!_item.hasInspect?{'background-color':'#f4f5f9','cursor': 'not-allowed'}:{}"
                class="storename"
                @click="clickStore(item,index,_item,_index)">
                <el-tooltip
                  :content="_item.name"
                  class="item"
                  effect="dark"
                  placement="bottom">
                  <span>{{ _item.name }}</span>
                </el-tooltip>
              </div>
            </div>
            <div v-else class="storeList-content">
              <el-input
                :placeholder="$t('remotePatrol.enterKeywords')"
                v-model="serachVale"
                size="small"
                class="el-search-input"
                style="width:240px"
                @keyup.enter.native="searchStore">
                <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"/>
              </el-input>
              <span v-if="item.storeList.length!=0" class="icon-info" style="margin-bottom:15px">* {{ $t('remotePatrol.cannotSwitch') }}</span>
              <div v-for="(_item,_index) in item.storeList" :key="_index" class="stores">
                <span class="citys">{{ _item.cityName }}</span>
                <div
                  v-for="(itemDs,indexDs) in _item.storeList"
                  :key="indexDs"
                  :style="!itemDs.hasInspect?{'background-color':'#f4f5f9','cursor': 'not-allowed'}:{}"
                  :class="itemDs.isActive?'activeClass':''"
                  class="store-name"
                  @click="clickStore(item,index,itemDs,indexDs)">
                  <el-tooltip
                    :content="itemDs.name"
                    class="item"
                    effect="dark"
                    placement="bottom">
                    <span>{{ itemDs.name }}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <div class="patrol-select">
        <div class="patrol-content">
          <p v-if="lang!= 'en'" class="patrol-title">{{ $t('storeView.selectPlaceholder') }}，<span v-if="patrolStoreName!=null">{{ patrolStoreName }}</span><span v-else>{{ $t('remotePatrol.stores') }}</span>{{ $t('storeView.bindInspectList') }}</p>
          <p v-if="lang== 'en'" class="patrol-title">Please select the inspection list associated with <span v-if="patrolStoreName!=null">{{ patrolStoreName }}</span><span v-else>{{ $t('remotePatrol.stores') }}</span></p>
          <el-dropdown trigger="click" placement="bottom" class="patrol-dropdown" @command="changeInspect">
            <span class="el-dropdown-link">
              <p v-if="patrolstore!=''" class="link-span">{{ patrolstore }}</p>
              <p v-else class="link-span">{{ $t('storeView.selectPlaceholder') }}</p>
              <i class="el-icon-arrow-down el-icon--right"/>
            </span>
            <el-dropdown-menu slot="dropdown" style="width:calc(264/1920*100vw);">
              <el-dropdown-item v-if="PatrolList.length===0">{{$t('overview.noData')}}</el-dropdown-item>
              <el-dropdown-item v-else v-for="item in PatrolList" :key="item.id" :command="item.id">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </div>
      <div class="channelbar-content">
        <hr class="rside-hr">
        <div class="channel-content">
          <span>{{ $t('remotePatrol.zoneList') }}</span>
          <div class="channels-srollbar">
            <div class="arrow-content">
              <i v-if="hideLast" class="el-icon-arrow-left icon-arrow" @click="lastBar"/>
            </div>
            <div class="btn-content">
              <div v-for="(item,index) in showChannelBtns" :key="index" class="btn-details">
                <channel-icon-btn
                  :channel-name="item.name"
                  :is-online="item.isonline"
                  :is-click="item.isClick"
                  class="channelBtn"
                  @click.native="clickBtn(item,index)"/>
              </div>
            </div>
            <div class="arrow-content">
              <i v-if="hideNext" class="el-icon-arrow-right icon-arrow" @click="nextBar"/>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { checkOutInspectItemV3 } from '@/api/inspect';
import util from '@/common/util';
import { getStoreList, getFavoriteList, addFavoriteStore, deleteFavoriteStore } from '@/api/store';
import { getUserInfo } from '@/api/login';
import { mapGetters } from 'vuex';
import videojs from '../../../static/video.js';
import DialogVue from '@/components/DialogVue.vue';
import ChannelIconBtn from '@/components/ChannelIconBtn.vue';
import { getCookie } from '@/common/auth';
import EzvizVideo from '@/components/EzvizVideo.vue';
import filterString from '@/common/filterString.js';
import { getDashServerInfo } from '@/api/device.js';
import DashHttp from '@/common/DashHttp.js';

export default {
  name: 'ReInspection',
  components: {
    DialogVue,
    ChannelIconBtn,
    EzvizVideo
  },
  data() {
    return {
      sheetName: [],
      isShowWarn: false,
      notShowAlert: false,
      patrolstore: '',
      PatrolList: [],
      showControls: false,
      showGuide: true,
      sourceList: [],
      isDisabled: false,
      penBtnSrc: require('../../../static/img/edit_btn.png'),
      showPenBtn: true,
      showPen: false,
      showStoreUp: false,
      showFeedDialog1: false,
      showFeedDialog2: false,
      arrows1Src: require('../../../static/img/arrows_left.png'),
      arrows2Src: require('../../../static/img/arrows_right.png'),
      plusSrc: require('../../../static/img/add_icon.png'),
      clearIconSrc: require('../../../static/img/clear.png'),
      removeIconSrc: require('../../../static/img/cancel.png'),
      backicon: require('../../../static/img/back.png'),
      checkImgSrc: '',
      showOuter: false,
      showModelContent: false,
      showInfoContent: true,
      activeIndex: '0',
      serachVale: '',
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      showDate: true,
      tempArr: [],
      playDate: new Date(),
      channel: null,
      penList: [
        {
          id: 'white',
          showContent: false
        },
        {
          id: 'red',
          showContent: true
        },
        {
          id: 'yellow',
          showContent: false
        }
      ],
      penChecked: 'red',
      showCutModel: false,
      errorText: '',
      showError: false,
      showVideo: true,
      showCancelContent: false,
      speedList: [
        {
          value: 0,
          label: '0.5 X'
        },
        {
          value: 1,
          label: '1 X'
        },
        {
          value: 2,
          label: '1.5 X'
        },
        {
          value: 3,
          label: '2 X'
        }
      ],
      testSpeed: '1 X',
      backList: [
        {
          value: 0,
          label: '10s'
        },
        {
          value: 1,
          label: '20s'
        },
        {
          value: 2,
          label: '30s'
        },
        {
          value: 3,
          label: '40s'
        }
      ],
      testBack: '10s',
      showSpread: false,
      tabList: [
        {
          label: this.$t('remotePatrol.star'),
          storeList: []
        },
        {
          label: this.$t('remotePatrol.visited'),
          storeList: []
        },
        {
          label: this.$t('remotePatrol.allStores'),
          storeList: []
        }
      ],
      store: {},

      oss: null,
      bucketVideo: '',
      bucketImage: '',
      percentage: 0,
      accountId: '',
      userId: '',
      tempStoreList: [],
      allInitStoreList: [],
      inspectList: [],
      showFeedBack: false,
      curGroup: null,
      curGroupIndex: 0,
      curItemIndex: 0,
      curSheetIndex: 0,
      curItem: null,
      curItemId: 0,
      curhasIgnoreItem: 0,

      curTabIndex: 0,
      curTabItem: null,
      curStoreIndex: 0,
      curStoreItem: null,
      patrolStoreName: null,

      inspectItemList: [],
      allInspectItemList: [],
      deviceList: [],
      protocal: 'DASH',
      curDeviceId: -1,
      videoEl: '',
      canvasEl: '',
      showCutDialog: false,
      imageCanvas: new Image(),
      imageCanvasList: [],
      playState: false,
      editCount: 0,
      ignoreTemp: [],
      appliedInspectList: [],

      changeBrandObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmSwitchBrand'),
        isWarning: true,
        dialogCosed: false
      },
      changeStoreObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmSwitch'),
        isWarning: true,
        dialogCosed: false
      },
      changeInspectObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmSwitchInspect'),
        isWarning: true,
        dialogCosed: false
      },
      noBindDeviceObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.notBindCamera'),
        isWarning: false,
        dialogCosed: false
      },
      noAllInspectObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.incompleteInfo'),
        isWarning: true,
        dialogCosed: false
      },
      allIgnoreObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.allIgnored'),
        isWarning: false,
        dialogCosed: false
      },
      leaveObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.changPageInfo'),
        isWarning: true,
        dialogCosed: false
      },
      recorder: null,
      videoCanvasSrc: '',
      isRecordingStarted: false,
      isStoppedRecording: false,
      dialogCommentVideo: false,
      curVideoSrc: '',
      curFeedBackVideoSrc: '',

      feedBackVideoFileObj: {},
      videoSpeed: 0,
      videoSpeedId: 0,
      showGetVideo: false,
      timeVideo: 0,
      startTimeCutVideo: 0,
      endTImeCutVideo: 0,
      isREC: false,
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),

      eventList: [],
      channelBtns: [],
      showChannelBtns: [],
      allChannelBtns: [],
      hideLast: false,
      hideNext: false,
      eventName: '',
      eventDes: '',
      showFeedBackInfo: true,
      showAddFeedBackBtn: true,
      timerPlayReal: null,
      isPlayingFlag: -1,
      lang: this.$i18n.locale,
      initEzviz: false,
      sourceListLength: 0,
      realTimeSpeed: 0,
      isLoading: false,
      showEventNameInfo: false,
      fromName: '',
      eventNameRuletip: false,
      eventDesRuletip: false,
      oldVal: '',
      historyObj: null,
      beforepatrolstore: '',
      showIgnoreItem: false,
      hasIgnoretemp: [],

      uri: null,
      play: true,
      fullScreen: false,
      paused: true,
      muted: false,
      currentState: 'blank', // 'blank','loading','play','inline'
      error: '',
      streamProtocol: 'DASH',
      sessionId: null,
      userName: null,
      password: null,
      IVSID: null,
      channelId: null,
      realType: true,
      lastTime: null,
      currentTime: null,
      onEndflag: false,
      previewplayer: null,
      feedbackIndex: -1
    };
  },
  computed: {
    graphBtnWidth: function() {
      return this.varyWindowHeight * 0.185;
    },
    btnFontSize: function() {
      return this.varyWindowHeight * 0.022;
    },
    percentHeight: function() {
      return this.varyWindowHeight / 758;
    },
    ...mapGetters({
      accountChanged: 'accountChanged',
      videoAuthority: 'videoAuthority'
    }),
    ...mapGetters(
      ['isEzviz']
    )
  },
  watch: {
    accountChanged(val, oldVal) {
      const self = this;
      if (val != 0) {
        self.changeBrand();
      }
    },

    realTimeSpeed(val) {
      if (val >= 300) {
        this.stopVideoPlay();
        this.stopTimer();
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    const self = this;
    const canLeave = (((!self.isEzviz) && self.editCount != 0)) ||
      (self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.editCount != 0);
    if (canLeave && to.name != 'confirmSum') {
      self.$confirm(self.$t('remotePatrol.changPageInfo'), self.$t('remotePatrol.prompt'), {
        confirmButtonText: self.$t('remotePatrol.confirm'),
        cancelButtonText: self.$t('remotePatrol.cancel'),
        type: 'warning',
        customClass: 'confirmClass',
        cancelButtonClass: 'cancelBtn',
        confirmButtonClass: 'confirmBtn'
      }).then(() => {
        if (to.name != 'confirmSum') {
          //   from.meta.keepAlive=false;
          self.playState && self.previewplayer && self.previewplayer.dispose();
          self.$store.dispatch('setPatrolHistory', null);
          self.$store.dispatch('setPatrolComment', null);
        } else {
          //   from.meta.keepAlive = true;
          self.$store.dispatch('setPatrolHistory', self.historyObj);
        }
        if (self.playState) {
          self.stopVideoPlay();
          window.clearInterval(self.timerPlayReal);
          self.timerPlayReal = null;
        }
        if (self.isEzviz && !self.showGuide) {
          self.$refs.ezvizVideo.stopRealTime();
        }
        next();
      }).catch(() => {
        next(false);
      });
    } else {
      if (to.name != 'confirmSum') {
        // from.meta.keepAlive=false;
        self.$store.dispatch('setPatrolHistory', null);
        self.$store.dispatch('setPatrolComment', null);
      } else {
        // from.meta.keepAlive=true;
        self.$store.dispatch('setPatrolHistory', self.historyObj);
      }
      if (self.playState) {
        self.stopVideoPlay();
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal = null;
      }
      if (self.isEzviz && !self.showGuide) {
        self.$refs.ezvizVideo.stopRealTime();
      }
      next();
    }
  },

  async mounted() {
    const self = this;
    const PatrolHistory = self.$store.getters.PatrolHistory;
    if (PatrolHistory != null) {
      self.activeIndex = PatrolHistory.activeIndex;
      self.tabList[Number(self.activeIndex)].storeList = PatrolHistory.storeList;

      const indexFeed = PatrolHistory.sheetName.map(x => x.groupId).indexOf('feedBack');
      let getdealnum = 0;
      const sheetName = PatrolHistory.sheetName.slice(0, indexFeed);
      sheetName.forEach(s_item => {
        s_item.count != s_item.Effective ? getdealnum++ : '';
        s_item.inspectList.forEach(n_item => {
          n_item.items.forEach(item => {
            item.isIgnore = false;
          });
        });
      });
      self.isShowWarn = getdealnum != 0;
      self.sheetName = PatrolHistory.sheetName;
      self.PatrolList = PatrolHistory.PatrolList;
      self.patrolstore = PatrolHistory.patrolstore;
      self.inspectList = PatrolHistory.sheetName[PatrolHistory.curSheetIndex].inspectList;
      self.showChannelBtns = PatrolHistory.showChannelBtns;
      self.allChannelBtns = PatrolHistory.allChannelBtns;
      self.curSheetIndex = PatrolHistory.curSheetIndex;
      self.curGroupIndex = PatrolHistory.curGroupIndex;
      self.curItemIndex = PatrolHistory.curItemIndex;

      self.isDisabled = true;
      const isClick = self.sheetName[self.sheetName.length - 1].isClick;
      if (isClick) {
        if (PatrolHistory.eventList.length > 0) {
          self.eventList = PatrolHistory.eventList;
          self.showFeedBackInfo = false;
          self.showFeedBack = true;
        } else {
          self.showFeedBackInfo = true;
          self.showFeedBack = true;
        }
      } else {
        self.inspectItemList = PatrolHistory.inspectItemList;
      }
      self.store = PatrolHistory.store;
      self.patrolStoreName = PatrolHistory.store.storeName;
      self.showGuide = false;
      self.showStoreUp = true;
      if (PatrolHistory.hasIgnoretemp.length === 0) {
        self.notShowAlert = true;
      }
    } else {
      self.getFaStoreData();
      this.videoAuthority && self.getDashUrlInfo();
    }
    document.onmouseup = self.mouseUpAction;
    self.isREC = false;
    self.getUpLoadBucketInfo();
    self.getOssInfo();
    window.onresize = function() {
      if (!self.checkFull()) {
        self.fullScreen = false;
        var ele = document.getElementById('videoContent');
        ele.style.width = 'auto';
        ele.style.height = 'auto';
      }
    };
    window.addEventListener('visibilitychange', self.visibilityChange, false);
  },

  beforeDestroy() {
    const self = this;
    window.removeEventListener('visibilitychange', self.visibilityChange);
    window.onresize = null;
    self.visibilityChange = null;
  },

  methods: {
    getDashUrlInfo() {
      getDashServerInfo().then(result => {
        if(result.errCode === 0){
          const apiport = result.data.url.indexOf('https') !== -1 ? result.data.httpsCmdPort : result.data.httpCmdPort;
          this.userName = result.data.loginId;
          this.password = result.data.password;
          const url = result.data.url + ':' + apiport + '/AdvStreamingService/';
          DashHttp.setDashHost(url);
        } else {
          console.log(result.errMsg);
        }
      }).catch(error => {
        if (error.message !== 'Network request failed') {
          this.currentState = 'blank';
          this.errorText = error;
          this.showError = true;
        }
      });
    },

    visibilityChange() {
      const self = this;
      if (!self.isEzviz) {
        if (document.hidden) {
          self.stopVideoPlay();
          self.stopTimer();
        } else {
          if (this.currentState === 'loading') {
            self.startVideo(self.channel.ivsId, self.channel.channelId, null);
          }
        }
      }
    },

    changeBrand() {
      const self = this;
      if (!self.isEzviz) {
        self.stopVideoPlay();
        self.playState && self.previewplayer && self.previewplayer.dispose();
      }
      if (self.isEzviz && !self.showGuide) {
        self.$refs.ezvizVideo.stopRealTime();
      }
      self.patrolStoreName = null;
      self.activeIndex = '0';
      self.PatrolList = [];
      self.patrolstore = '';
      self.inspectList = [];
      self.inspectItemList = [];
      self.store = '';
      self.showStoreUp = false;
      self.showGuide = true;
      self.eventList = [];
      self.sheetName = [];
      self.tempArr = [];
      self.hasIgnoretemp = null;
      self.showIgnoreItem = false;
      self.isShowWarn = false;
      self.notShowAlert = false;
      self.showFeedBackInfo = true;
      self.accountId = localStorage.getItem('oss_bucket');
      self.showChannelBtns = [];
      self.showError = false;
      self.errorText = '';
      self.getFaStoreData();
    },
    anchorLinkTo() {
      const self = this;
      if (document.getElementById('inspectContent') != null) {
        if (self.$refs['myScrollbar'] != undefined) {
          self.$refs['myScrollbar'].wrap.scrollTop = document.getElementById('inspectContent').offsetTop;
        }
      }
    },
    getAccountId() {
      const self = this;
      const userId = getCookie('UserId');
      self.userId = userId;
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          res.data.forEach(item => {
            if (item.userId == userId) {
              const accountId = item.accountId.toLowerCase();
              self.accountId = accountId;
              localStorage.setItem('oss_bucket', accountId);
              resolve(accountId);
            }
          });
        });
      });
    },
    async getOssInfo() {
      const self = this;
      await self.getAccountId();
      self.accountId = localStorage.getItem('oss_bucket');
    },
    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
    },
    getFileUrl(fileName) {
      const self = this;
      const bucketName = 'viumo-n3azju2aknpw';
      const endpoint = self.oss.ossEndPoint;
      const url = `http://${bucketName}.${endpoint}/${fileName}`;
      return url;
    },
    deleteEvent(item, index) {
      const self = this;
      self.eventList.splice(index, 1);
      self.showFeedBackInfo = self.eventList.length == 0;
    },

    addFeedBack() {
      this.feedbackIndex = -1;
      this.showFeedDialog1 = true;
      this.eventName = '';
      this.eventDes = '';
      this.showEventNameInfo = false;
    },

    confirmAddFeedBack2() {
      const self = this;
      if (self.eventName.trim().length === 0) {
        self.showEventNameInfo = true;
        return false;
      }
      if(this.feedbackIndex === -1){
        let srcObj = null;
        const src = self.canvasEl.toDataURL('image/jpeg');
        srcObj = {
          mediaType: 2,
          src: src,
          height: '100px',
          width: '140px',
          fileName: `${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${self.curItemId}.jpg`,
          file: util.base64ToBlob(src),
          deviceId: self.channel.id
        };

        const obj = {
          eventName: self.eventName,
          eventDes: self.eventDes,
          sourceObj: srcObj
        };
        self.eventList.push(obj);
      } else {
        self.eventList[this.feedbackIndex].eventName = self.eventName;
        self.eventList[this.feedbackIndex].eventDes = self.eventDes;
      }
      self.showFeedDialog2 = false;
      self.showFeedBackInfo = false;
    },

    confirmAddFeedBack1() {
      const self = this;
      if(this.feedbackIndex == -1){
        const obj = {
          eventName: self.eventName,
          eventDes: self.eventDes,
          sourceObj: null
        };
        if (self.eventName.trim().length == 0) {
          self.showEventNameInfo = true;
          return false;
        }
        self.eventList.push(obj);
      } else {
        self.eventList[this.feedbackIndex].eventName = self.eventName;
        self.eventList[this.feedbackIndex].eventDes = self.eventDes;
      }
      self.showFeedDialog1 = false;
      self.showFeedBackInfo = false;
    },

    getIndexById(id) {
      const self = this;
      let tempId = null;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      if (self.showIgnoreItem) {
        self.hasIgnoretemp.forEach((item, index) => {
          if (item.id == id) {
            tempId = {
              itemIndex: index
            };
          }
        });
      } else {
        sheetName.forEach(s_item => {
          s_item.inspectList.forEach((item, index) => {
            item.items.forEach((_item, _index) => {
              if (_item.id == id) {
                tempId = {
                  groupIndex: index,
                  itemIndex: _index
                };
              }
            });
          });
        });
      }
      return tempId;
    },
    getChannelIndexById(id) {
      const self = this;
      let curIndex = 0;
      self.channelBtns.forEach((item, index) => {
        if (item.id == id) {
          curIndex = index;
        }
      });
      return curIndex;
    },
    upLoadFile(fileItem) {
      const self = this;
      self.percentage = 0;
      const OSS = require('ali-oss');
      const bucketName = 'viumo-n3azju2aknpw';
      const client = new OSS({
        region: self.oss.ossEndPoint.slice(0, self.oss.ossEndPoint.indexOf('.')),
        accessKeyId: self.oss.ossAccessKeyId,
        accessKeySecret: self.oss.ossAccessKeySecret,
        // bucket: 'viumo-'+self.accountId
        bucket: bucketName
      });
      const name = fileItem.fileName;
      return new Promise((resolve, reject) => {
        client.put(name, fileItem.file, {
          progress: function * (percentage, cpt) {
            self.percentage = percentage;
          }
        })
          .then((results) => {
            const url = self.getFileUrl(results.name);
            resolve(url);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },

    playCutVideo(item, index) {
      const self = this;
      self.dialogCommentVideo = true;
      if (self.showFeedBack) {
        self.curVideoSrc = item.sourceObj.src;
      } else {
        self.curVideoSrc = item.src;
      }
    },

    cutPicture() {
      const self = this;
      self.videoEl = document.getElementById('previewVideo').children[0];
      self.imageCanvasList = [];
      if (self.fullScreen) {
        self.exitFullscreen();
        self.fullScreen = false;
      }
      if (self.showFeedBack) {
        self.feedbackIndex = -1;
        self.showFeedDialog2 = true;
        self.eventName = '';
        self.eventDes = '';
        self.showEventNameInfo = false;
        this.$nextTick(() => {
          self.canvasEl = document.getElementById('icanvas');
          var ctx = self.canvasEl.getContext('2d');
          ctx.drawImage(self.videoEl, 0, 0, 520 * self.percentHeight, 340 * self.percentHeight);
          var oGrayImg = icanvas.toDataURL('image/jpeg');
          self.imageCanvas.src = oGrayImg;
          const imgObj = new Image();
          imgObj.src = oGrayImg;
          self.imageCanvasList.push(imgObj);
        });
      } else {
        self.showCancelContent = false;
        if (self.sourceListLength >= 10) {
          self.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
          return false;
        }
        self.showCutDialog = true;
        this.$nextTick(() => {
          self.canvasEl = document.getElementById('icanvas');
          var ctx = self.canvasEl.getContext('2d');
          ctx.drawImage(self.videoEl, 0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
          var oGrayImg = icanvas.toDataURL('image/jpeg');
          self.imageCanvas.src = oGrayImg;
          const imgObj = new Image();
          imgObj.src = oGrayImg;
          self.imageCanvasList.push(imgObj);
        });
      }
    },
    showPenList() {
      const self = this;
      self.showPen = !self.showPen;
      self.showCancelContent = false;
    },
    checkPen(item, index) {
      const self = this;
      item.showContent = true;
      self.penList.forEach((_item, _index) => {
        if (index != _index) {
          _item.showContent = false;
        }
      });
      self.penChecked = item.id;
    },
    cancelEditCanvas() {
      const self = this;
      self.showCancelContent = false;
      self.canvasEl = document.getElementById('icanvas');
      var ctx = self.canvasEl.getContext('2d');
      let vcanvas = null;
      if (self.showFeedBack) {
        vcanvas = { width: 520 * self.percentHeight, height: 340 * self.percentHeight };
      } else {
        vcanvas = { width: 767 * self.percentHeight, height: 431 * self.percentHeight };
      }
      ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
      ctx.drawImage(self.imageCanvas, 0, 0, vcanvas.width, vcanvas.height);
      self.imageCanvasList = [];
    },
    confirmEditCanvas() {
      const self = this;
      self.showCancelContent = false;
      self.imageCanvasList.pop();
      self.canvasEl = document.getElementById('icanvas');
      var ctx = self.canvasEl.getContext('2d');
      let vcanvas = null;
      if (self.showFeedBack) {
        vcanvas = { width: 520 * self.percentHeight, height: 340 * self.percentHeight };
      } else {
        vcanvas = { width: 767 * self.percentHeight, height: 431 * self.percentHeight };
      }
      ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
      if (self.imageCanvasList.length == 0) {
        ctx.drawImage(self.imageCanvas, 0, 0, vcanvas.width, vcanvas.height);
      } else {
        ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length - 1], 0, 0, vcanvas.width, vcanvas.height);
      }
    },
    confirmEdit() {
      const self = this;
      self.sourceList = [];
      const obj = {};
      obj.mediaType = 2;
      obj.src = self.canvasEl.toDataURL('image/jpeg');
      obj.height = '100px';
      obj.width = '140px';
      obj.fileName = `${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${self.curItemId}.jpg`;
      obj.file = util.base64ToBlob(obj.src);
      obj.deviceId = self.channel.id;
      self.sourceList.push(obj);
      self.showCutDialog = false;
      const tempId = self.getIndexById(self.curItemId);
      if (tempId != null) {
        if (!self.showIgnoreItem) {
          self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList.push(obj);
        } else {
          self.hasIgnoretemp[tempId.itemIndex].sourceList.push(obj);
        }
      } else {
        self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList = self.sourceList;
      }
      if (!self.showIgnoreItem) {
        self.sourceListLength = self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.length;
      } else {
        self.sourceListLength = self.hasIgnoretemp[self.curItemIndex].sourceList.length;
      }
    },
    mouseDownAction(e) {
      const self = this;
      self.isMouseDown = true;
      self.X = e.offsetX;
      self.Y = e.offsetY;
      self.showCutModel = false;
      self.showPenBtn = false;
      self.showCancelContent = false;
    },
    mouseMoveAction(e) {
      const self = this;
      if (self.isMouseDown) {
        self.X1 = e.offsetX;
        self.Y1 = e.offsetY;
        self.drawLine(self.X, self.Y, self.X1, self.Y1);
        self.showPenBtn = false;
        self.flag++;
      }
    },
    mouseUpAction(e) {
      const self = this;
      self.isMouseDown = false;
      self.showCutModel = true;
      self.showPenBtn = true;
      self.showCancelContent = true;
      if (self.flag != 0 && self.canvasEl != '') {
        const imgObj = new Image();
        imgObj.src = self.canvasEl.toDataURL('image/jpeg');
        self.imageCanvasList.push(imgObj);
      }
      self.flag = 0;
    },
    drawLine(x, y, x1, y1) {
      const self = this;
      var ctx = self.canvasEl.getContext('2d');
      if (self.flag) {
        ctx.beginPath();
      }
      ctx.moveTo(x, y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = self.penChecked;
      ctx.lineTo(x1, y1);
      ctx.stroke();
      if (self.flag != 0) {
        self.X = self.X1;
        self.Y = self.Y1;
      }
    },
    showCancel() {
      this.showCancelContent = true;
      this.showPenBtn = true;
    },
    hiddenCancel() {
      this.showCancelContent = false;
      this.showPenBtn = false;
    },
    getFaStoreList() {
      return new Promise((resolve, reject) => {
        getFavoriteList().then(res => {
          resolve(res);
        });
      });
    },
    checkIgnoreScore(item, itemDS, e, index) {
      const self = this;
      item.manualIgnore = false;
      self.curhasIgnoreItem = index;
      item.scoreList.forEach(s_item => {
        s_item.val === itemDS.val ? s_item.isClick = true : s_item.isClick = false;
      });
      if (e === 0) {
        if (item.type === 2) {
          if (item.itemScore < 0) {
            item.itemgetScore = itemDS.val === -1 ? item.itemScore : 0;
          } else {
            item.itemgetScore = itemDS.val === item.itemScore ? item.itemScore : 0;
          }
        } else {
          item.itemgetScore = itemDS.val === -1 ? 0 : item.itemScore;
        }
        item.isQualified = !(itemDS.val === -1);
        item.itemScoreTitle = itemDS.scoreTitle;
      } else {
        item.itemgetScore = itemDS;
        item.itemScoreTitle = itemDS;
      }
      item.dealCount = item.Effective = item.inputCount = 1;
    },
    checkScore(item, itemDS, e) {
      const self = this;
      item.scoreList.forEach(s_item => {
        s_item.val === itemDS.val ? s_item.isClick = true : s_item.isClick = false;
      });
      self.isEzviz ? self.$refs.ezvizVideo.editCount++ : self.editCount++;
      if (e === 0) {
        if (item.type === 2) {
          if (item.itemScore < 0) {
            item.itemgetScore = itemDS.val === -1 ? item.itemScore : 0;
          } else {
            item.itemgetScore = itemDS.val === item.itemScore ? item.itemScore : 0;
          }
        } else {
          item.itemgetScore = itemDS.val === -1 ? 0 : item.itemScore;
        }
        item.isQualified = !(itemDS.val === -1);
        item.itemScoreTitle = itemDS.scoreTitle;
      } else {
        item.itemgetScore = itemDS;
        item.itemScoreTitle = itemDS;
      }
      if (item.itemScoreTitle !== '--') {
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount === 0) {
          self.sheetName[self.curSheetIndex].dealCount++;
          self.sheetName[self.curSheetIndex].Effective++;
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].dealCount++;
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].Effective++;
        }
        self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount++;
      }
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = JSON.parse(JSON.stringify(self.sheetName.slice(0, indexFeed)));
      self.isDisabled = sheetName.some(item => item.Effective !== 0);
      self.isShowWarn = self.isDisabled && sheetName.some(item => item.Effective !== item.count);
      const hasIgnoretemp = [];
      sheetName.forEach(s_item => {
        s_item.inspectList.forEach(item => {
          item.items.forEach((_item, _index) => {
            if (_item.inputCount === 0 && !_item.manualIgnore) {
              hasIgnoretemp.push(_item);
            }
          });
        });
      });
      hasIgnoretemp.length === 0 ? self.notShowAlert = true : null;
    },

    getAllStoreList() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          resolve(res);
        });
      });
    },
    saveStoreObj(storeObj) {
      const self = this;
      const key = 'recentStore_reinspect' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      temp.forEach((item, index) => {
        if (item.userId == storeObj.userId && item.storeId == storeObj.storeId) {
          temp.splice(index, 1);
        }
      });
      temp.unshift(storeObj);
      temp = temp.slice(0, 3);
      localStorage.setItem(key, JSON.stringify(temp));
    },
    getStoreObj() {
      const self = this;
      const key = 'recentStore_reinspect' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      const tempArray = [];
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      let indexArray = [];
      temp.forEach((item, index) => {
        indexArray.push(self.allInitStoreList.map(x => x.storeId).indexOf(item.storeId));
      });
      indexArray = indexArray.filter(function(x) {
        return x != -1;
      });
      indexArray.forEach(item => {
        tempArray.push(self.allInitStoreList[item]);
      });
      return tempArray;
    },
    async getStoreList() {
      const self = this;
      const getStoreTemp = data => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
          if (self.store.storeId == item.storeId) {
            obj.isActive = true;
          } else {
            obj.isActive = false;
          }
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          if (item.authorizedInspect.length != 0) {
            obj.authorizedInspect = item.authorizedInspect;
            obj.hasInspect = true;
          } else {
            obj.hasInspect = false;
          }
          temp.push(obj);
        });
        return temp;
      };
      let data;
      switch (Number(self.activeIndex)) {
        case 0: data = await self.getFaStoreList();
          if (data.errCode == 0) {
            const storeData = data.data;
            self.tabList[0].storeList = getStoreTemp(storeData);
          }
          if (data.errCode == 500) {
            self.tabList[0].storeList = [];
          }
          break;
        case 1:
          data = self.getStoreObj();
          self.tabList[1].storeList = getStoreTemp(data);
          break;
        case 2:
          self.tabList[2].storeList.forEach((item, index) => {
            item.storeList.forEach(_item => {
              if (_item.storeId == self.store.storeId) {
                _item.isActive = true;
              } else {
                _item.isActive = false;
              }
            });
          });
          break;
      }
    },
    async getFaStoreData() {
      const self = this;
      const getStoreTemp = data => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          obj.isActive = false;
          if (item.authorizedInspect.length != 0) {
            obj.authorizedInspect = item.authorizedInspect;
            obj.hasInspect = true;
            if (index == 0) {
              obj.isActive = true;
            }
          } else {
            obj.hasInspect = false;
          }
          temp.push(obj);
        });
        return temp;
      };
      const data = await self.getFaStoreList();
      const allStoreData = await self.getAllStoreList();
      self.getInitStoreData(allStoreData);
      if (data.errCode == 0) {
        const storeData = data.data;
        self.tabList[0].storeList = getStoreTemp(storeData);
        if (storeData.length == 0) {
          self.showStoreUp = false;
          self.inspectList = [];
        } else {
          if (storeData[0].authorizedInspect.length != 0) {
            const obj = {};
            obj.storeId = storeData[0].storeId;
            obj.storeName = storeData[0].name;
            obj.storeTitle = storeData[0].name;
            obj.storeUp = true;
            obj.storeUpTitle = this.$t('remotePatrol.stared');
            self.store = obj;
            self.showStoreUp = true;
            const curStoreId = storeData[0].storeId;
            const storeObj = {
              storeId: curStoreId
            };
            self.patrolStoreName = storeData[0].name;
            storeData[0].authorizedInspect.forEach(au_item => {
              if (au_item.mode == 0) {
                self.PatrolList.push(au_item);
              }
            });
            self.saveStoreObj(storeObj);
            self.deviceList = storeData[0].device;
            self.getChannelByStore(self.tabList[0].storeList[0]);
          } else {
            self.showStoreUp = false;
          }
        }
      }
    },
    async getInitStoreData(data) {
      const self = this;
      const getStore2Temp = data => {
        const cityList = [];
        data.forEach(item => {
          if (cityList.map(x => x.city).indexOf(item.city) == -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city == data[j].city) {
              const obj = {};
              obj.isActive = false;
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite = data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              if (data[j].authorizedInspect.length != 0) {
                obj.authorizedInspect = data[j].authorizedInspect;
                obj.hasInspect = true;
              } else {
                obj.hasInspect = false;
              }
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      // let data=await self.getAllStoreList();
      if (data.errCode == 0) {
        const storeData = data.data.content;
        self.allInitStoreList = storeData;
        if (storeData.length == 0) {
          self.tabList[2].storeList = [];
          self.tempStoreList = [];
        } else {
          self.tabList[2].storeList = getStore2Temp(storeData);
          self.tempStoreList = getStore2Temp(storeData);
        }
      }
    },
    async handleClick(tab) {
      const self = this;
      const allStoreData = await self.getAllStoreList();
      self.getInitStoreData(allStoreData);
      self.getStoreList();
    },
    addStoreUp() {
      const self = this;
      const temp = [];
      temp.push(self.store.storeId);
      const params = {
        storeIds: temp
      };
      if (!self.store.storeUp) {
        addFavoriteStore(params).then(res => {
          if (res.errCode == 0) {
            self.store.storeUp = true;
            self.store.storeUpTitle = this.$t('remotePatrol.stared');
            self.getStoreList();
            self.tabList[2].storeList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = true;
                }
              });
            });
            self.tempStoreList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = true;
                }
              });
            });
            self.allInitStoreList.forEach((item, index) => {
              if (self.store.storeId == item.storeId) {
                item.favorite = true;
              }
            });
          }
        });
      } else {
        deleteFavoriteStore(params).then(res => {
          if (res.errCode == 0) {
            self.store.storeUp = false;
            self.store.storeUpTitle = this.$t('remotePatrol.clickToStar');
            self.getStoreList();
            self.tabList[2].storeList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = false;
                }
              });
            });
            self.tempStoreList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = false;
                }
              });
            });
            self.allInitStoreList.forEach((item, index) => {
              if (self.store.storeId == item.storeId) {
                item.favorite = false;
              }
            });
          }
        });
      }
    },
    mouseoverGroup(item, index) {
      item.isHover = true;
    },
    mouseoutGroup(item, index) {
      item.isHover = false;
    },
    getItemByGroup(item, index) {
      const self = this;

      // else{
      self.curGroupIndex = index;
      self.curGroup = item;
      self.curItemIndex = 0;
      self.inspectItemList = item.items;
      self.showFeedBack = false;
      self.hideNext = false;
      self.hideLast = false;
      self.channelBtns = [];
      item.isClick = true;
      this.$nextTick(() => {
        self.anchorLinkTo();
      });
      self.inspectList.forEach((_item, _index) => {
        if (index != _index) {
          _item.isClick = false;
        }
      });
    },
    getDeviceById(deviceId) {
      const self = this;
      const device = [];
      self.deviceList.forEach(item => {
        deviceId.forEach(_item => {
          if (_item == item.id) {
            device.push(item);
          }
        });
      });
      return device;
    },
    openOuter(item) {
      const self = this;
      if (item != null) {
        self.showOuter = true;
        self.checkImgSrc = item.src;
      }
    },
    deleteImg(item, index) {
      const self = this;
      item.sourceList.splice(index, 1);
      self.sourceListLength--;
    },
    handleIgnore() {
      const self = this;
      self.curItem.manualIgnore = true;
      self.curItem.disabled = true;
      if (self.showIgnoreItem) {
        if (self.hasIgnoretemp[self.curItemIndex].dealCount == 0) {
          self.hasIgnoretemp[self.curItemIndex].dealCount = 1;
        }
        if (self.hasIgnoretemp[self.curItemIndex].manualIgnore) {
          self.hasIgnoretemp[self.curItemIndex].inspectInput = '';
          self.hasIgnoretemp[self.curItemIndex].sourceList = [];
          self.hasIgnoretemp[self.curItemIndex].itemScoreTitle = '--';
          self.hasIgnoretemp[self.curItemIndex].inputCount = 0;
          self.hasIgnoretemp[self.curItemIndex].scoreList.forEach(x => {
            x.isClick = false;
          });
        }
      } else {
        self.showGuide = false;
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount != 0 && self.sheetName[self.curSheetIndex].Effective != 0) {
          self.sheetName[self.curSheetIndex].Effective--;
        }
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount == 0) {
          self.sheetName[self.curSheetIndex].dealCount++;
        }
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].manualIgnore) {
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inspectInput = '';
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList = [];
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].itemScoreTitle = '--';
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount = 0;
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].scoreList.forEach(x => {
            x.isClick = false;
          });
        }
        const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
        const sheetName = JSON.parse(JSON.stringify(self.sheetName.slice(0, indexFeed)));
        const hasIgnoretemp = [];
        let count = 0, manualCount = 0;
        sheetName.forEach(s_item => {
          count += s_item.count;
          s_item.inspectList.forEach(item => {
            item.items.forEach((_item, _index) => {
              _item.manualIgnore ? manualCount++ : null;
              if (_item.inputCount == 0 && !_item.manualIgnore) {
                hasIgnoretemp.push(_item);
              }
            });
          });
        });
        if (count !== manualCount) {
          hasIgnoretemp.length == 0 ? self.notShowAlert = true : null;
        }else{
          self.notShowAlert = false;
        }
        self.isDisabled = sheetName.some(item => item.Effective !== 0);
        self.isDisabled ? self.isShowWarn = true : self.isShowWarn = false;
      }
    },
    cancleIgnore() {
      const self = this;
      self.curItem.manualIgnore = false;
      if (self.showIgnoreItem) {
        self.hasIgnoretemp[self.curItemIndex].dealCount != 0 ? self.hasIgnoretemp[self.curItemIndex].dealCount-- : null;
      } else {
        self.sheetName[self.curSheetIndex].dealCount != 0 ? self.sheetName[self.curSheetIndex].dealCount-- : null;
        self.notShowAlert ? self.notShowAlert = false : null;
      }
    },
    cancelIgnoreInspect(val) {
      const self = this;
      self.ignoreInspectObj.dialogCosed = false;
    },
    IgnoreInspect() {
      const self = this;
      self.CancleIgnoreInspectObj.dialogCosed = false;
    },
    ignoreItem(item, index, e) {
      const self = this;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      if (e === 0) {
        self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[index].checked = false;
        self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[index].disabled = false;
      }else{
        self.hasIgnoretemp[index].checked = false;
        self.hasIgnoretemp[index].disabled = false;
      }
      if(self.isEzviz && self.$refs.ezvizVideo !== undefined){
        self.$refs.ezvizVideo.editCount++;
      }else{
        self.editCount++;
      }
      self.curItemIndex = index;
      self.curItem = item;
      if (item.deviceId == -1) {
        self.noBindDeviceObj.dialogCosed = true;
        return false;
      }
      self.handleIgnore();
    },
    CancleIgnoreItem(item, index) {
      const self = this;
      self.isEzviz ? self.$refs.ezvizVideo.editCount-- : self.editCount--;
      self.curItemIndex = index;
      self.curItem = item;
      self.cancleIgnore();
    },
    noBindDeviceDialog(val) {
      const self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },
    canceldNoBind(val) {
      const self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },

    clickBtn(item, index) {
      const self = this;
      const obj = {
        id: item.id,
        channelId: item.channelId,
        ivsId: item.ivsId,
        channelName: item.name
      };
      self.channel = obj;
      item.isClick = true;
      if (self.showFeedBack) {
        self.inspectItemList.forEach(_item => {
          _item.checked = false;
          _item.disabled = true;
        });
      }
      self.showChannelBtns.forEach((_item, _index) => {
        if (_index !== index) {
          _item.isClick = false;
        }
      });
      if (!self.isEzviz) {
        self.curDeviceId = item.id;
        self.startVideo(self.channel.ivsId, self.channel.channelId, null);
      } else {
        self.curDeviceId = item.id;
        if (self.$refs.ezvizVideo.playState) {
          self.$refs.ezvizVideo.stopRealTime();
          self.$nextTick(() => {
            self.$refs.ezvizVideo.realTime();
          });
        } else {
          self.$nextTick(() => {
            self.$refs.ezvizVideo.realTime();
          });
        }
      }
    },
    clickItem(item, index) {
      const self = this;
      if (item.isIgnore) {
        return false;
      }
      self.sourceList = [];
      self.sourceListLength = item.sourceList.length;
      const obj = {};
      if (item.deviceId.length > 0) {
        const device = self.getDeviceById(item.deviceId);
        if (device.length > 0) {
          obj.id = device[0].id;
          obj.ivsId = device[0].ivsId;
          obj.channelName = device[0].name;
          obj.channelId = device[0].channelId;
          self.channel = obj;
          self.channelBtns = [];
          self.showError = false;
          self.showGuide = false;
          device.forEach(item => {
            self.allChannelBtns.forEach(_item => {
              if (item.id === _item.id) {
                self.channelBtns.push(_item);
              }
            });
          });
          self.$nextTick(() => {
            self.getshowBtns(self.channelBtns);
          });
          self.channelBtns.forEach((_item, _index) => {
            if (self.channel != null) {
              if (_item.id == self.channel.id) {
                _item.isClick = true;
              } else {
                _item.isClick = false;
              }
            }
          });
          if (!self.isEzviz) {
            self.startVideo(self.channel.ivsId, self.channel.channelId, null);
          } else {
            // Ezviz
            if (self.$refs.ezvizVideo != undefined) {
              if (self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.playState) {
                self.$refs.ezvizVideo.stopRealTime();
                self.$nextTick(() => {
                  self.$refs.ezvizVideo.realTime();
                });
              } else {
                self.$nextTick(() => {
                  self.$refs.ezvizVideo.realTime();
                });
              }
            }
          }
          self.curDeviceId = item.deviceId[0];
          item.checked = true;
          self.curItem = item;
          self.curItemIndex = index;
          self.curItemId = item.id;
          item.disabled = false;
        }
      } else if (item.deviceId.length == 0) {
        self.noBindDeviceObj.dialogCosed = true;
        return false;
      }
      self.inspectItemList.forEach((_item, _index) => {
        if (index != _index) {
          _item.checked = false;
          _item.disabled = true;
        }
      });
      if (self.hasIgnoretemp.length != 0 && self.showIgnoreItem) {
        self.hasIgnoretemp.forEach((_item, _index) => {
          if (index != _index) {
            _item.checked = false;
            _item.disabled = true;
          } else {
            _item.checked = true;
            _item.disabled = false;
          }
        });
      }
      self.sheetName.slice(0, self.sheetName.length - 1).forEach((_item, _index) => {
        _item.inspectList.forEach((p_item, p_index) => {
          p_item.items.forEach((itemDS, indexDS) => {
            if (itemDS.id != item.id) {
              itemDS.checked = false;
              itemDS.disabled = true;
            }
          });
        });
      });
    },

    leaveDialog() {
      const self = this;
      self.leaveObj.dialogCosed = false;
      self.isEzviz ? self.$refs.ezvizVideo.editCount = 0 : self.editCount = 0;
    },
    cancelLeave() {
      const self = this;
      self.leaveObj.dialogCosed = false;
    },
    noAllInspectDialog() {
      const self = this;
      self.noAllInspectObj.dialogCosed = false;
      const temp = [];
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      const inspectSettings = JSON.parse(sessionStorage.getItem('inspectSettings'));
      if (self.hasIgnoretemp.length == 0) {
        sheetName.forEach(s_item => {
          s_item.inspectList.forEach(item => {
            temp.push(item);
            item.items.forEach((_item, _index) => {
              if (_item.inputCount == 0) {
                _item.isIgnore = true;
                _item.inspectInput = '';
                _item.sourceList = [];
                if (inspectSettings.qualifiedForIgnoredWithType1 && _item.type === 0 || inspectSettings.qualifiedForIgnoredWithType2 && _item.type === 1) {
                  _item.itemgetScore = _item.itemScore;
                }
                _item.itemgetScore = _item.manualIgnore ? '--' : null;
              }
            });
          });
        });
      } else {
        sheetName.forEach(s_item => {
          const dealtemp = [];
          s_item.inspectList.forEach(item => {
            item.items.forEach((_item, _index) => {
              self.hasIgnoretemp.forEach((h_item, h_index) => {
                if (self.hasIgnoretemp[h_index].inputCount == 0) {
                  self.hasIgnoretemp[h_index].isIgnore = true;
                  self.hasIgnoretemp[h_index].inspectInput = '';
                  self.hasIgnoretemp[h_index].sourceList = [];
                  if (inspectSettings.qualifiedForIgnoredWithType1 && h_item.type === 0 || inspectSettings.qualifiedForIgnoredWithType2 && h_item.type === 1) {
                    h_item.itemgetScore = h_item.itemScore;
                  }
                  h_item.itemgetScore = h_item.manualIgnore ? '--' : null;
                }
                if (self.hasIgnoretemp[h_index].id == item.items[_index].id) {
                  item.items[_index] = self.hasIgnoretemp[h_index];
                }
              });
              if (_item.inputCount != 0 || _item.manualIgnore) {
                const obj = {};
                obj.dealCount = 1;
                dealtemp.push(obj);
              }
            });
            temp.push(item);
          });
          s_item.dealCount = dealtemp.length;
        });
      }
      const obj = {
        inspect: sheetName,
        event: self.eventList,
        store: self.store,
        channel: self.channel
      };
      const hasIgnoretemp = [];
      temp.forEach(item => {
        item.items.forEach(_item => {
          if (_item.inputCount == 0 && !_item.manualIgnore) {
            _item['type'] = item.type;
            hasIgnoretemp.push(_item);
          }
        });
      });
      self.historyObj = {
        storeList: self.tabList[Number(self.activeIndex)].storeList,
        patrolstore: self.patrolstore,
        sheetName: self.sheetName,
        PatrolList: self.PatrolList,
        activeIndex: self.activeIndex,
        store: self.store,
        hasIgnoretemp: hasIgnoretemp,
        inspectItemList: self.inspectItemList,
        eventList: self.eventList,
        showChannelBtns: self.showChannelBtns,
        allChannelBtns: self.allChannelBtns,
        curSheetIndex: self.curSheetIndex,
        curGroupIndex: self.curGroupIndex,
        curItemIndex: self.curItemIndex
      };
      self.hasIgnoretemp = [];
      const params = { data: obj, rule: inspectSettings };
      self.$router.push({ name: 'confirmSum', params: params });
    },
    canceldNoAllInspect() {
      const self = this;
      self.noAllInspectObj.dialogCosed = false;
    },
    allIgnoreDialog() {
      const self = this;
      self.allIgnoreObj.dialogCosed = false;
    },
    cancelAllIgnore() {
      const self = this;
      self.allIgnoreObj.dialogCosed = false;
    },

    async confirmSummary() {
      const self = this;
      const temp = [];
      let count = 0;
      let dealCount = 0;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      const inspectSettings = JSON.parse(sessionStorage.getItem('inspectSettings'));
      if (self.hasIgnoretemp.length == 0) {
        sheetName.forEach(s_item => {
          s_item.inspectList.forEach(item => {
            temp.push(item);
            item.items.forEach((_item, _index) => {
              if (_item.inputCount == 0) {
                _item.isIgnore = true;
                _item.inspectInput = '';
                _item.sourceList = [];
                if (inspectSettings.qualifiedForIgnoredWithType1 && _item.type === 0 || inspectSettings.qualifiedForIgnoredWithType2 && _item.type === 1) {
                  _item.itemgetScore = _item.itemScore;
                }
                _item.itemgetScore = _item.manualIgnore ? '--' : null;
              }
            });
          });
          dealCount = dealCount + s_item.dealCount;
          count = count + s_item.count;
        });
      } else {
        sheetName.forEach(s_item => {
          const dealtemp = [];
          s_item.inspectList.forEach(item => {
            item.items.forEach((_item, _index) => {
              self.hasIgnoretemp.forEach((h_item, h_index) => {
                if (self.hasIgnoretemp[h_index].inputCount == 0) {
                  self.hasIgnoretemp[h_index].isIgnore = true;
                  self.hasIgnoretemp[h_index].inspectInput = '';
                  self.hasIgnoretemp[h_index].sourceList = [];
                  if (inspectSettings.qualifiedForIgnoredWithType1 && h_item.type === 0 || inspectSettings.qualifiedForIgnoredWithType2 && h_item.type === 1) {
                    h_item.itemgetScore = h_item.itemScore;
                  }
                  h_item.itemgetScore = h_item.manualIgnore ? '--' : null;
                }
                if (self.hasIgnoretemp[h_index].id == item.items[_index].id) {
                  item.items[_index] = self.hasIgnoretemp[h_index];
                }
              });
              if (_item.inputCount != 0 || _item.manualIgnore) {
                const obj = {};
                obj.dealCount = 1;
                dealtemp.push(obj);
              }
            });
            temp.push(item);
          });
          s_item.dealCount = dealtemp.length;
          dealCount = dealCount + s_item.dealCount;
          count = count + s_item.count;
        });
      }
      if (dealCount < count) {
        self.noAllInspectObj.dialogCosed = true;
        return false;
      }
      const hasIgnoretemp = [];
      temp.forEach(item => {
        item.items.forEach(_item => {
          if (_item.inputCount == 0 && !_item.manualIgnore) {
            _item['type'] = item.type;
            hasIgnoretemp.push(_item);
          }
        });
      });
      const obj = {
        inspect: sheetName,
        event: self.eventList,
        store: self.store,
        channel: self.channel
      };
      self.historyObj = {
        storeList: self.tabList[Number(self.activeIndex)].storeList,
        patrolstore: self.patrolstore,
        sheetName: self.sheetName,
        PatrolList: self.PatrolList,
        activeIndex: self.activeIndex,
        store: self.store,
        hasIgnoretemp: hasIgnoretemp,
        inspectItemList: self.inspectItemList,
        eventList: self.eventList,
        showChannelBtns: self.showChannelBtns,
        allChannelBtns: self.allChannelBtns,
        curSheetIndex: self.curSheetIndex,
        curGroupIndex: self.curGroupIndex,
        curItemIndex: self.curItemIndex
      };
      self.hasIgnoretemp = [];
      const params = { data: obj, rule: inspectSettings };
      self.$router.push({ name: 'confirmSum', params: params });
    },
    spreadContent() {
      const self = this;
      self.showSpread = true;
    },
    closeContent() {
      const self = this;
      self.showSpread = false;
    },
    async playVideo(url) {
      const self = this;
      self.showModelContent = true;
      self.playState = true;
      var video = document.getElementById('previewVideo');
      this.previewplayer = videojs(video);
      this.previewplayer.src({ src: url, type: this.protocal == 'HLS' ? 'application/x-mpegURL' : 'application/dash+xml' });
      this.previewplayer.play();
    },
    destroyVideo() {
      const self = this;
      var video = document.getElementById('previewVideo');
      this.previewplayer = videojs(video);
      self.previewplayer.dispose();
    },
    hiddenModel() {
      const self = this;
      // self.showModelContent=false;
      // self.showInfoContent=false;
    },
    showModel() {
      const self = this;
      // self.showInfoContent=true;
      // if(self.playState){
      //     self.showModelContent=true;
      // }
    },

    async onPlay() {
      const paused = !this.paused;
      this.showError = false;
      this.errorText = '';
      if (this.realType === true) {
        if (paused) {
          await this.stopVideo();
          await this.disconnectVideo();
          await this.offline();
          this.paused = true;
        } else {
          if (this.channel === null) {
            this.paused = true;
          } else {
            await this.startVideo(this.channel.ivsId, this.channel.channelId, null);
          }
        }
      } else {
        if (paused) {
          this.paused = true;
        } else {
          if (this.onEndflag) {
            this.startVideo(this.channel.ivsId, this.channel.channelId, this.lastTime);
          } else {
            this.paused = false;
          }
        }
      }
    },

    async startVideo(IVSID, channelId, startTs) {
      try {
        if (this.videoAuthority === false) {
          this.showError = true;
          this.errorText = this.$t('remotePatrol.videoLicense');
          return;
        }
        if (IVSID === null || channelId === null) {
          const error = this.$t('remotePatrol.dashServerError') + '5';
          this.currentState = 'blank';
          this.errorText = error;
        } else {
          this.showError = false;
          this.isLoading = true;
          if (!await this.stopVideoPlay()) {
            return;
          }
          if (!await this.online()) {
            return;
          }
          this.IVSID = IVSID;
          this.channelId = channelId.toString();
          if (startTs) {
            await this.history(startTs);
          } else {
            if (await this.connectVideo()) {
              this.startTimer();
            }
          }
        }
      } catch (e) {
        if (e.message !== 'Network request failed') {
          this.currentState = 'blank';
          this.errorText = e.message;
          this.showError = true;
          this.isLoading = false;
        }
      }
    },

    startTimer() {
      this.realTimeSpeed = 0;
      this.isLoading = false;
      this.timerPlayReal = window.setInterval(() => {
        this.realTimeSpeed = this.realTimeSpeed + 1;
      }, 1000);
    },

    stopTimer() {
      window.clearInterval(this.timerPlayReal);
      this.realTimeSpeed = 0;
    },

    async stopVideoPlay() {
      if (this.sessionId) {
        const state = this.currentState;
        this.currentState = 'loading';
        if (state === 'play') {
          this.stopVideo();
          await this.disconnectVideo();
        }
        this.paused = true;
        return await this.offline();
      } else {
        this.paused = true;
        return true;
      }
    },

    async online() {
      const data = {};
      const request = {};
      request.username = this.userName;
      request.password = this.password;
      data.request = request;
      this.currentState = 'loading';
      if (await DashHttp.putDash('Authority/Online', data)) {
        this.sessionId = DashHttp.getResult().SessionID;
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
        }
        this.currentState = 'blank';
        this.errorText = error;
        this.showError = true;
        this.isLoading = false;
        this.destroyVideo();
        return false;
      }
    },

    async offline() {
      if (this.sessionId != null) {
        const data = {};
        const request = {};
        request.sessionID = this.sessionId;
        data.request = request;
        if (await DashHttp.putDash('Authority/Offline', data)) {
          this.sessionId = null;
          return true;
        } else {
          if (DashHttp.getResult() != null) {
            const errorCode = DashHttp.getResult().ErrorCode;
            if (errorCode === 3) {
              this.sessionId = null;
              return true;
            } else {
              const error = this.$t('remotePatrol.dashServerError') + errorCode;
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    },

    async connectVideo() {
      const data = {};
      const request = {};
      request.method = 'connection';
      request.sessionID = this.sessionId;
      request.streamingProtocol = this.streamProtocol;
      request.withAudio = true;
      request.streamType = 'SubStream';
      request.IVSID = this.IVSID;
      request.channel = this.channelId;
      data.request = request;
      this.realType = true;
      if (await DashHttp.putDash('LiveStream', data)) {
        const url = DashHttp.getResult().mpd;
        this.uri = url;
        this.playVideo(url);
        this.currentState = 'play';
        this.paused = false;
        this.errorText = '';
        this.isLoading = false;
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
        }
        this.currentState = 'blank';
        this.errorText = error;
        this.showError = true;
        this.isLoading = false;
        this.destroyVideo();
        return false;
      }
    },

    async history(startTs) {
      const data = {};
      const request = {};
      request.method = 'connection';
      request.sessionID = this.sessionId;
      request.streamingProtocol = this.streamProtocol;
      request.withAudio = true;
      request.transcodeResolution = 'D1';
      request.IVSID = this.IVSID;
      request.channel = this.channelId;
      request.beginTime = startTs.toString();
      request.endTime = (startTs + 300).toString();

      data.request = request;
      this.realType = false;
      if (await DashHttp.putDash('PlaybackStream', data)) {
        const url = DashHttp.getResult().mpd;
        this.uri = url;
        this.currentState = 'play';
        this.paused = false;
        this.errorText = '';
        this.onEndflag = false;
        this.lastTime = startTs + 300;
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
        }
        this.currentState = 'blank';
        this.paused = false;
        this.errorText = error;
        this.isLoading = false;
        this.showError = true;
        return false;
      }
    },

    async disconnectVideo() {
      if (this.sessionId != null) {
        const data = {};
        const request = {};
        request.method = 'disconnection';
        request.sessionID = this.sessionId;
        request.IVSID = this.IVSID;
        request.channel = this.channelId;
        request.streamType = 'SubStream';
        data.request = request;
        const url = this.realType ? 'LiveStream' : 'PlaybackStream';
        if (await DashHttp.putDash(url, data)) {
          return true;
        } else {
          if (DashHttp.getResult() != null) {
            const errorCode = DashHttp.getResult().ErrorCode;
            if (errorCode === 3) {
              return true;
            } else {
              if (errorCode !== 24) {
                const error = this.$t('remotePatrol.dashServerError') + errorCode;
              }
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    },

    stopVideo() {
      const self = this;
      self.showModelContent = false;
      self.playState = false;
      var video = document.getElementById('previewVideo');
      self.previewplayer = videojs(video);
      self.previewplayer.pause();
      self.stopTimer();
    },

    controlScreen() {
      const self = this;
      if (!self.fullScreen) {
        self.fullWindowScreen();
        self.fullScreen = true;
      } else {
        self.exitFullscreen();
        self.fullScreen = false;
      }
    },

    fullWindowScreen(...val) {
      var ele = document.getElementById('videoContent');
      ele.style.width = '100%';
      ele.style.height = '100%';
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    },

    exitFullscreen() {
      var de = document;
      var ele = document.getElementById('videoContent');
      ele.style.width = 'auto';
      ele.style.height = 'auto';
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
    },

    gonggeScreen() {
      const self = this;
      self.showgongge = true;
    },
    recoverScreen() {
      const self = this;
      self.showgongge = false;
    },
    searchStore() {
      const self = this;
      const tempStoreList = self.tempStoreList;
      const getStore2Temp = data => {
        const cityList = [];
        data.forEach(item => {
          if (cityList.map(x => x.city).indexOf(item.city) == -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city == data[j].city) {
              const obj = {};
              if (self.store.storeId == data[j].storeId) {
                obj.isActive = true;
              } else {
                obj.isActive = false;
              }
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite = data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              obj.hasInspect = data[j].hasInspect;
              if (data[j].authorizedInspect != undefined && data[j].authorizedInspect.length != 0) {
                obj.authorizedInspect = data[j].authorizedInspect;
                obj.hasInspect = true;
              } else {
                obj.hasInspect = false;
              }
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      const temp = [];
      const tempArray = [];
      const tempStore = [];
      tempStoreList.forEach((_item, _index) => {
        _item.storeList.forEach((itemDs, indexDs) => {
          temp.push(util.getPinyinList(itemDs.name));
          tempStore.push(itemDs);
        });
      });
      for (var i = 0; i < temp.length; i++) {
        if (temp[i][0].indexOf(self.serachVale.trim()) != -1 ||
          temp[i][1].indexOf(self.serachVale.trim()) != -1) {
          tempArray.push(tempStore[i]);
        }
      }
      self.tabList[2].storeList = getStore2Temp(tempArray);
    },

    changeStore(item, index, _item, _index) {
      const self = this;
      self.patrolstore = '';
      self.curSheetIndex = 0;
      self.inspectItemList = [];
      self.inspectList = [];
      self.sheetName = [];
      self.tempArr = [];
      self.showChannelBtns = [];
      self.patrolStoreName = _item.name;
      self.PatrolList = [];
      self.hasIgnoretemp = [];
      self.$store.dispatch('setPatrolHistory', null);
      self.isShowWarn = false;
      self.notShowAlert = false;
      self.showIgnoreItem = false;
      _item.authorizedInspect.forEach(au_item => {
        if (au_item.mode == 0) {
          self.PatrolList.push(au_item);
        }
      });
      _item.isActive = true;
      self.showStoreUp = true;
      if (!self.isEzviz) {
        self.editCount = 0;
        self.stopVideoPlay();
      } else {
        !self.showGuide ? self.$refs.ezvizVideo.editCount = 0 : '';
        if (self.$refs.ezvizVideo != undefined) {
          self.$refs.ezvizVideo.playState ? self.$refs.ezvizVideo.stopRealTime() : '';
        }
      }
      // self.editCount=0;
      self.showError = false;
      self.curDeviceId = -1;
      self.showFeedBack = false;
      self.eventList = [];
      self.showGuide = true;
      const obj = {};
      obj.storeId = _item.storeId;
      obj.storeName = _item.name;
      obj.storeTitle = _item.name;
      obj.storeUp = _item.favorite;
      self.channel = null;
      self.getChannelByStore(_item);
      if (_item.favorite) {
        obj.storeUpTitle = this.$t('remotePatrol.stared');
      } else {
        obj.storeUpTitle = this.$t('remotePatrol.clickToStar');
      }
      self.store = obj;
      let curStoreId = '';
      const tabIndex = Number(self.activeIndex);
      if (tabIndex != 2) {
        item.storeList.forEach((itemS, indexS) => {
          if (_index != indexS) {
            itemS.isActive = false;
          }
        });
        curStoreId = _item.storeId;
      } else {
        item.storeList.forEach((itemS, indexS) => {
          itemS.storeList.forEach((itemChild, indexChild) => {
            if (itemChild.storeId != _item.storeId) {
              itemChild.isActive = false;
            } else {
              curStoreId = itemChild.storeId;
            }
          });
        });
      }
      const storeObj = {
        storeId: curStoreId
      };
      self.saveStoreObj(storeObj);
    },
    changeBrandDialog() {
      const self = this;
    },
    changeStoreDialog(val) {
      const self = this;
      self.changeStoreObj.dialogCosed = false;
      self.changeStore(self.curTabItem, self.curTabIndex, self.curStoreItem, self.curStoreIndex);
    },
    changeInspectDialog() {
      const self = this;
      self.changeInspectObj.dialogCosed = false;
      self.changeInspectList(self.beforepatrolstore);
      self.isEzviz ? self.$refs.ezvizVideo.editCount = 0 : self.editCount = 0;
    },
    canceldChangeInspect() {
      const self = this;
      self.changeInspectObj.dialogCosed = false;
    },
    canceldChangeStore() {
      const self = this;
      self.changeStoreObj.dialogCosed = false;
    },
    canceldChangeBrand() {
      const self = this;
      self.changeBrandObj.dialogCosed = false;
    },

    lastBar() {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0].offsetWidth;
      const detailsWidth = window.innerWidth / 1440 * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        const index = self.getChannelIndexById(self.showChannelBtns[0].id);
        self.showChannelBtns.unshift(self.channelBtns[index - 1]);
        self.showChannelBtns.pop();
        self.showChannelBtns.forEach((item, index) => {
          if (item.id == self.channel.id) {
            item.isClick = true;
          } else {
            item.isClick = false;
          }
        });
        if (self.showChannelBtns[0].id == self.channelBtns[0].id) {
          self.hideLast = false;
        }
        if (self.showChannelBtns[count - 1].id != self.channelBtns[self.channelBtns.length - 1].id) {
          self.hideNext = true;
        }
      }
    },
    nextBar() {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0].offsetWidth;
      const detailsWidth = window.innerWidth / 1440 * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        const index = self.getChannelIndexById(self.showChannelBtns[count - 1].id);
        self.showChannelBtns.push(self.channelBtns[index + 1]);
        self.showChannelBtns.shift();
        self.showChannelBtns.forEach((item, index) => {
          if (item.id == self.channel.id) {
            item.isClick = true;
          } else {
            item.isClick = false;
          }
        });
        if (self.showChannelBtns[0].id != self.channelBtns[0].id) {
          self.hideLast = true;
        }
        if (self.showChannelBtns[count - 1].id == self.channelBtns[self.channelBtns.length - 1].id) {
          self.hideNext = false;
        }
      }
    },
    getshowBtns(list) {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0].offsetWidth;
      const detailsWidth = window.innerWidth / 1440 * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= list.length) {
        self.showChannelBtns = list;
      } else {
        self.showChannelBtns = list.slice(0, count);
      }
      if (count < self.channelBtns.length) {
        self.hideNext = true;
      }
    },
    getChannelByStore(storeItem) {
      const self = this;
      const temp = [];
      self.hideLast = false;
      self.hideNext = false;
      storeItem.device.forEach((item, index) => {
        const obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.ivsId = item.ivsId;
        obj.channelId = item.channelId;
        obj.isonline = true;
        obj.isClick = false;
        temp.push(obj);
      });
      self.channelBtns = temp;
      self.allChannelBtns = temp;
    },
    changeInspect(val) {
      const self = this;
      if(val!==undefined){
        if ((!self.isEzviz && self.editCount != 0) ||
          (self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.editCount != 0) ||
          (self.$store.getters.PatrolHistory != null)) {
          self.changeInspectObj.dialogCosed = true;
          self.beforepatrolstore = val;
        } else {
          self.changeInspectList(val);
        }
      }
    },
    changeInspectList(val) {
      const self = this;
      if (!self.isEzviz) {
        self.editCount = 0;
        self.playState ? self.stopVideoPlay() : '';
      } else {
        !self.showGuide ? self.$refs.ezvizVideo.editCount = 0 : '';
        if (self.$refs.ezvizVideo != undefined) {
          self.$refs.ezvizVideo.playState ? self.$refs.ezvizVideo.stopRealTime() : '';
        }
      }
      self.isDisabled = false;
      self.hasIgnoretemp = [];
      self.tempArr = [];
      self.$store.dispatch('setPatrolHistory', null);
      self.$store.dispatch('setPatrolComment', null);
      self.isShowWarn = false;
      self.notShowAlert = false;
      self.showIgnoreItem = false;
      self.eventList = [];
      self.showChannelBtns = [];
      self.curSheetIndex = 0;
      self.PatrolList.forEach(item => {
        if (item.id == val) {
          self.patrolstore = item.name;
        }
      });
      const params = {
        storeId: self.store.storeId,
        mode: 0,
        authorizedOnly: 1,
        tagName: self.patrolstore,
        inspectId: val
      };
      self.inspectItemList = [];
      checkOutInspectItemV3(params).then(res => {
        if (res.errCode == 0) {
          const data = res.data.groups;
          const inspectSettings = {};
          res.data.inspectSettings.forEach(item => {
            switch (item.name) {
              case 'includedInTotalScoreWithType1':
                inspectSettings.includedInTotalScoreWithType1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType1':
                inspectSettings.qualifiedForIgnoredWithType1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType2':
                inspectSettings.qualifiedForIgnoredWithType2 = item.value;
                break;
              case 'hundredMarkType':
                inspectSettings.hundredMarkType = item.value.toString();
                break;
              case 'minScore':
                inspectSettings.minScore = item.value;
                break;
              case 'maxScore':
                inspectSettings.maxScore = item.value;
                break;
              case 'dangerousOnFailedItem':
                inspectSettings.dangerousOnFailedItem = item.value;
                break;
              default:
                break;
            }
          });
          sessionStorage.setItem('inspectSettings', JSON.stringify(inspectSettings));
          const temp = [];
          data.forEach((item, index) => {
            const obj = {};
            obj.groupId = item.groupId;
            obj.mode = item.mode;
            obj.type = item.type;
            obj.groupName = item.groupName;
            obj.dealCount = 0;
            obj.Effective = 0;
            obj.isHover = false;
            if (index == 0) {
              obj.isClick = true;
            } else {
              obj.isClick = false;
            }
            const tempItems = [];
            item.items.forEach((_item, _index) => {
              const itemObj = {};
              itemObj.id = _item.id;
              itemObj.groupId = item.groupId;
              itemObj.subject = _item.subject;
              itemObj.description = _item.description;
              itemObj.itemScore = _item.itemScore;
              let itemScoreLength = [];
              if (_item.availableScores.length !== 0) {
                itemScoreLength = _item.availableScores;
              } else {
                for (let i = 0; i < _item.itemScore + 1; i++) {
                  itemScoreLength.push(i);
                }
              }
              itemScoreLength.sort((a, b) => { return a - b; });
              itemObj.itemScoreLength = itemScoreLength.reverse();
              itemObj.itemgetScore = '--';
              itemObj.isQualified = false;
              itemObj.qualifiedScore = _item.qualifiedScore;
              itemObj.type = item.type;
              itemObj.itemScoreTitle = '--';
              // itemObj.deviceId=_item.deviceId;
              itemObj.deviceId = _item.deviceIds;
              itemObj.inspectInput = '';
              itemObj.inputCount = 0;
              itemObj.disabled = true;
              itemObj.checked = false;
              itemObj.isIgnore = false;
              itemObj.Ruletip = false;
              itemObj.manualIgnore = false;
              itemObj.sourceList = [];
              itemObj.scoreList = [{ val: _item.itemScore, scoreTitle: this.$t('remotePatrol.pass'), isClick: false },
                { val: -1, scoreTitle: this.$t('remotePatrol.failed'), isClick: false }];
              tempItems.push(itemObj);
            });
            obj.items = tempItems;
            temp.push(obj);
          });
          const te_temp = [];
          for (let i = 0; i < 3; i++) {
            const Typeindex = temp.filter(x => x.type == i);
            if (Typeindex.length != 0) {
              let count = 0, label = '';
              Typeindex.forEach(item => {
                count += item.items.length;
              });
              if (Typeindex[0].type == 0) {
                label = self.$t('insSettingView.sheetpassfail');
              }
              if (Typeindex[0].type == 1) {
                label = self.$t('insSettingView.sheetscore');
              }
              if (Typeindex[0].type == 2) {
                label = self.$t('insSettingView.sheetother');
              }
              te_temp.push({ inspectList: Typeindex, dealCount: 0, Effective: 0, count: count, isClick: false, label: label, type: Typeindex[0].type });
            }
          }
          self.sheetName = te_temp;
          self.sheetName[0].isClick = true;
          self.inspectList = self.sheetName[0].inspectList;
          const feedobj = { groupId: 'feedBack', label: self.$t('remotePatrol.feedbacks'), isClick: false };
          if (self.sheetName.length != 0) {
            self.sheetName.push(feedobj);
            self.getItemByGroup(self.sheetName[0].inspectList[0], 0);
          }
        }
      });
    },
    hasIgnoreItem() {
      const self = this;
      self.showIgnoreItem = true;
      self.showFeedBack = false;
      self.isShowWarn = false;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      const hasIgnoretemp = [];
      sheetName.forEach(s_item => {
        s_item.inspectList.forEach(item => {
          item.items.forEach((_item, _index) => {
            if (_item.inputCount == 0 && !_item.manualIgnore) {
              hasIgnoretemp.push(_item);
            } else if (_item.inputCount != 0) {
              self.tempArr.push(_item.type);
            }
          });
        });
      });
      self.hasIgnoretemp = hasIgnoretemp;
    },
    backToPatrol() {
      const self = this;
      self.showIgnoreItem = false;
      self.showFeedBack = self.sheetName[Number(self.sheetName.length - 1)].isClick;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      sheetName.forEach(s_item => {
        let dealtemp = [], notIgnoretemp = [];
        s_item.inspectList.forEach(item => {
          item.items.forEach((_item, _index) => {
            self.hasIgnoretemp.forEach((h_item, h_index) => {
              if (h_item.id == _item.id) {
                item.items[_index] = self.hasIgnoretemp[h_index];
              }
            });
            if (item.items[_index].inputCount == 1 || item.items[_index].manualIgnore) {
              const obj = {};
              obj.dealCount = 1;
              dealtemp.push(obj);
            }
            if (item.items[_index].inputCount == 1) {
              const obj = {};
              obj.manualCount = 1;
              notIgnoretemp.push(obj);
            }
          });
        });
        s_item.dealCount = dealtemp.length;
        s_item.Effective = notIgnoretemp.length;
        if (s_item.isClick && !self.showFeedBack) {
          self.inspectItemList = s_item.inspectList[self.curGroupIndex].items;
        }
      });
      self.isShowWarn = self.hasIgnoretemp.some(x => x.inputCount == 0);
      self.notShowAlert = self.sheetName.every(x => x.count == x.dealCount);
    },
    changeSheet(item, index) {
      const self = this;
      if (item.groupId == 'feedBack') {
        const PatrolHistory = self.$store.getters.PatrolHistory;
        if (PatrolHistory != null) {
          self.eventList = PatrolHistory.eventList;
          self.showFeedBackInfo = self.eventList.length == 0;
          self.showFeedBack = true;
        } else {
          self.showFeedBack = true;
          self.showFeedBackInfo = self.eventList.length == 0;
          self.showGuide = false;
          self.channelBtns = self.allChannelBtns.concat();
          self.channelBtns.forEach((_item, _index) => {
            if (self.channel != null) {
              if (_item.id == self.channel.id) {
                _item.isClick = true;
              } else {
                _item.isClick = false;
              }
            }
          });
          self.$nextTick(() => {
            self.getshowBtns(self.channelBtns);
          });
        }
      } else {
        self.inspectList = item.inspectList;
        self.curSheetIndex = index;
        self.getItemByGroup(item.inspectList[0], 0);
      }
      self.sheetName.forEach((_item, _index) => {
        if (index == _index) {
          _item.isClick = _item.isClick == false;
        } else {
          _item.isClick = false;
        }
      });
    },
    clickStore(item, index, _item, _index) {
      const self = this;
      if (!_item.hasInspect && _item.hasInspect != undefined) {
        return false;
      }
      self.curTabIndex = index;
      self.curTabItem = item;
      self.curStoreIndex = _index;
      self.curStoreItem = _item;
      self.deviceList = _item.device;
      if ((!self.isEzviz && self.editCount != 0) ||
        (self.isEzviz && !self.showGuide && self.$refs.ezvizVideo.editCount != 0) ||
        (self.$store.getters.PatrolHistory != null)) {
        self.changeStoreObj.dialogCosed = true;
      } else {
        self.changeStore(item, index, _item, _index);
      }
    },
    checkFull() {
      var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },
    /**
     * handle ezviz video snapshot
     */
    editEzvizCanvas(src) {
      const self = this;
      self.sourceList = [];
      const obj = {};
      obj.mediaType = 2;
      obj.src = src;
      obj.height = '100px';
      obj.width = '140px';
      obj.fileName = `${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${self.curItemId}.jpg`;
      obj.file = util.base64ToBlob(obj.src);
      obj.deviceId = self.channel.id;
      self.sourceList.push(obj);
      const tempId = self.getIndexById(self.curItemId);
      if (tempId != null) {
        if (!self.showIgnoreItem) {
          self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList.push(obj);
        } else {
          self.hasIgnoretemp[tempId.itemIndex].sourceList.push(obj);
        }
      } else {
        self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList = self.sourceList;
      }
      if (!self.showIgnoreItem) {
        self.sourceListLength = self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.length;
      } else {
        self.sourceListLength = self.hasIgnoretemp[self.curItemIndex].sourceList.length;
      }
    },

    ezvizPictureFeedback(obj) {
      const self = this;
      let srcObj = null;
      const src = obj.src;
      srcObj = {
        mediaType: 2,
        src: src,
        height: '100px',
        width: '140px',
        fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${self.curItemId}.jpg`,
        file: util.base64ToBlob(src),
        deviceId: self.channel.id
      };

      const picObj = {
        eventName: obj.eventName,
        eventDes: obj.eventDes,
        sourceObj: srcObj
      };
      self.eventList.push(picObj);
      self.showFeedBackInfo = false;
    },

    itemDescriptionChanged(val, item) {
      const content = filterString.all(val, 200);
      item.inspectInput = content;
      const length = filterString.getContentLength(val);
      if (length > 200) {
        item.Ruletip = true;
      } else {
        item.Ruletip = false;
      }
    },
    eventNameChanged(val) {
      const self = this;
      const content = filterString.all(val, 50);
      self.eventName = content;
      self.showEventNameInfo = false;
      const length = filterString.getContentLength(val);
      if (length > 50) {
        this.eventNameRuletip = true;
      } else {
        this.eventNameRuletip = false;
      }
    },
    eventDesChanged(val) {
      const self = this;
      const content = filterString.all(val, 200);
      self.eventDes = content;
      const length = filterString.getContentLength(val);
      if (length > 200) {
        this.eventDesRuletip = true;
      } else {
        this.eventDesRuletip = false;
      }
    },
    notShowInputRuleTips(e, item) {
      if (e == 'item') {
        item.Ruletip = false;
      } else if (e == 'eventName') {
        this.eventNameRuletip = false;
      } else if (e == 'eventDes') {
        this.eventDesRuletip = false;
      }
    },

    onPlayerWaiting(e) {
      this.showModelContent = false;
    },

    onPlayerPlaying(e) {
      this.showModelContent = true;
    },

    editFeedback(feedbackObj, index){
      this.feedbackIndex = index;
      !feedbackObj.sourceObj ? this.showFeedDialog1 = true : this.showFeedDialog2 = true;
      this.eventName = feedbackObj.eventName;
      this.eventDes = feedbackObj.eventDes;
      this.showEventNameInfo = false;
    }
  }
};
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
        .canvas-img{
          margin-left: 20px;
          margin-top: 15px;
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
        height: 420px;
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
        .inspect-title >>> .el-alert__title{
          font-weight: bold;
          color:#f59f23;
          font-size: 14px;
        }

        .inspect-title >>> .el-alert__icon{
          font-size: 16px;
          margin-right: calc(10/1920*100vw);
        }
        .inspect-title >>> .el-alert__description{
          font-size: 14px;
          margin:0;
        }
        .inspect-title >>> .el-alert__content{
          padding:0;
        }
        .inspect-title{
          .el-alert{
            height:40px;
            line-height: 40px;
            padding-left: calc(35/1920*100vw);
            padding-right: calc(26/1920*100vw);
            vertical-align: middle;
          }
          .info-alert >>> .el-alert__content{
            width:100%;
          }
          .info-alert{
            .info-left{
              float: left;
              color:#182752;
              font-weight: bold;
              font-size:calc(14/1920*100vw);
            }
            .info-right{
              float: right;
              color:#6097f4;
              cursor: pointer;
              img{
                vertical-align: middle;
              }
              span{
                text-decoration: underline;
                margin-left:calc(10/1920*100vw);
                vertical-align: middle;
              }
            }
          }
        }
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
          // z-index: 100;
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
            right: 8%;
          }
        }
        .inspect-content{
          padding: 15px auto;
          .Group-content{
            text-align: left;
            .Group-content-title{
              padding-left:calc(35/1920*100vw);
              padding-right:calc(26/1920*100vw);
              height:50px;
              line-height: 50px;
              border-bottom:1px solid #ddd;
              font-size: calc(14/1920*100vw);
              color:$tab;
              cursor: pointer;
              .icon{
                float:right;
                line-height: 50px;
              }
            }
            .Group-content-details{

            }
          }
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
              .title-description{
                cursor: pointer;
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
            height:40px;
            line-height: 40px;
            text-align: left;
            padding-left: calc(55/1920*100vw);
            color: $tab;
            border-bottom:1px solid #ddd;
            cursor: pointer;
            background-color: #f9fafe;
            // &:last-child{
            //     margin-bottom: 15px;
            // }
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
              @include point(right,50);
              @include point(top,12);
              margin-right: 10px;
              width: 120px;
              height: 22px;
              background-color: transparent;
              z-index: 20;
              cursor: not-allowed;
            }
            .check_scoring{
              box-sizing: border-box;
              position: absolute;
              @include point(right,60);
              @include point(top,12);
              font-size: 12px;
              width: 120px;
              height: 25px;
              line-height: 23px;
              border:1px solid #dcdcdc;
              background-color: #f7f8fc;
              display: inline-block;
              border-radius: 4px;
              margin-top: -2px;
              p{
                margin:0;
                width:58.5px;
                text-align: center;
                display: inline-block;
              }
              p:nth-child(1){
                border-radius: 4px 0 0 4px;
                border-right: 1px solid #dcdcdc;
              }
              p:nth-child(2){
                border-radius: 0 4px 4px 0;
              }
              .check_normal{
                color:#7b8da0;
                font-size: calc(12/1920*100vw);
              }
              .check_isClick{
                background-color:#fcba3f;
                font-size: calc(14/1920*100vw);
                color:#fff;
              }
            }
            .item-score{
              box-sizing: border-box;
              position: absolute;
              @include point(right,70);
              @include point(top,12);
              font-size: 12px;
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
      .patrol-select >>> .el-icon--right{
        float:right;
      }
      .patrol-select{
        height:160px;
        width:92%;
        text-align: left;
        margin:0 auto;
        border-top:0.5px solid #e3e9f4;
        .patrol-dropdown{
          padding:5px 12px;
          border:1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          .link-span{
            width:calc(220/1920*100vw);
            min-width:100px;
            margin:0;
            display: inline-block;
          }
        }
        .patrol-content{
          padding: 0 30px;
          .patrol-title{
            font-size:14px;
            color:#182752;
            font-weight: bold;
            margin:30px 0 20px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
  .patrol-content >>> .el-select .el-input--medium .el-input__inner{
    color:#333;
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
  .el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .des-input .el-textarea__inner{
    font-family:Roboto, Arial, 'Microsoft YaHei';
  }
  /* .score-menu.el-dropdown-menu{
    z-index: 0 !important;
  } */
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
