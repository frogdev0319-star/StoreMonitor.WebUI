<template>
  <el-row class="el-setRule">
    <el-col :span="24" class="el-rute-title">
      <span class="tab-name">【{{ routeName }}】{{ $t('insSettingView.ruleInspect') }}</span>
      <div style="float:right;">
        <el-button
          class="storevue-button-filled"
          @click="submitRule">
          {{ $t('titleView.save') }}
        </el-button>
      </div>
    </el-col>
    <el-col :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.PatrolScoreCalculation')">
        <div slot="tableDetail">
          <p class="rule-item">
            <el-checkbox class="storevue-checkbox-outlined" v-model="includedInTotalScoreWithType1">
              {{ $t('insSettingView.tab1CalculateScore') }}
            </el-checkbox>
          </p>
          <p class="rule-item">
            <el-checkbox class="storevue-checkbox-outlined" v-model="qualifiedForIgnoredWithType1">
              <span>
                {{ $t('insSettingView.tab1IgnoredQualified') }}
              </span>
            </el-checkbox>
          </p>
          <p class="rule-item">
            <el-checkbox class="storevue-checkbox-outlined" v-model="qualifiedForIgnoredWithType2">
              <span>{{ $t('insSettingView.tab2IgnoredQualified') }}</span>
            </el-checkbox>
          </p>
          <p class="rule-score">
            {{ $t('insSettingView.CalculationMethod') }}：
          </p>
          <p class="rule-item">
            <el-radio v-model="hundredMarkType" label="0" class="radio">
              {{ $t('insSettingView.Proportional') }}
            </el-radio>
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom-end">
              <div slot="content">{{ $t('insSettingView.ProportionalDes') }}</div>
              <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>
            </el-tooltip>
            <el-radio v-model="hundredMarkType" label="-1" class="radio" style="margin-left: calc(40/1920*100vw);">
              {{ $t('insSettingView.totalScore') }}
            </el-radio>
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom-end">
              <div slot="content">{{ $t('insSettingView.totalScoreDes') }}</div>
              <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>
            </el-tooltip>
            <el-radio v-model="hundredMarkType" label="1" class="radio" style="margin-left: calc(40/1920*100vw);">
              {{ $t('insSettingView.accumulateTotalScore') }}
            </el-radio>
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom-end">
              <div slot="content">{{ $t('insSettingView.accumulateTotalScoreInfo') }}</div>
              <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>
            </el-tooltip>
          </p>
          <p class="rule-item">
            <template v-if="hundredMarkType === '1'">
              <span class="rangeScore">
                {{ $t('remotePatrol.startingScore') }}
              </span>
              <el-input
                :placeholder="$t('insSettingView.setMinScore')"
                v-model="baseScore"
                class="input"
                @blur="inputChangeBaseScore"/>
              <span class="input-text">
                {{ $t('remotePatrol.scorecount') }}
              </span>
              <span v-if="MinScoreMsg" class="score_msg">
                * {{ $t('insSettingView.minScoreEmpty') }}
              </span>
            </template>

            <!-- 考評總分範圍設置 -->
            <template>
              <span class="rangeScore">
                {{ $t('insSettingView.totalScorRange') }}：
              </span>
              <el-input
                :placeholder="$t('insSettingView.setMinScore')"
                ref="min_score"
                v-model="minScore"
                class="input"
                @blur="inputChangeMin"/>
              <span class="input-text">
                {{ $t('remotePatrol.scorecount') }}~
              </span>
              <el-input
                :placeholder="$t('insSettingView.setMaxScore')"
                ref="max_score"
                v-model="maxScore"
                class="input"
                @blur="inputChangeMax"/>
              <span class="input-text">
                {{ $t('remotePatrol.scorecount') }}
              </span>
            </template>
            <template>
              <span class="rangeScore">
                {{ $t('insSettingView.standardScore') }}
              </span>
              <el-input
                v-model="standardScore"
                class="input"
                @blur="inputChangeStandardScore"/>
              <span class="input-text">
                {{ $t('remotePatrol.scorecount') }}
              </span>
            </template>

            <span v-if="ScoreMsg" class="score_msg">
              *{{ $t('insSettingView.rangeScoreTips') }}
            </span>
          </p>

          <!-- 顯示區域計分(僅支援網頁版) -->
          <p class="rule-item">
            <el-checkbox class="storevue-checkbox-outlined" v-model="aaa">
              顯示區域計分(僅支援網頁版)
            </el-checkbox>
          </p>
          <!-- 顯示巡檢類別計分 -->
          <p class="rule-item">
            <el-checkbox class="storevue-checkbox-outlined" v-model="bbb">
              顯示巡檢類別計分
            </el-checkbox>
          </p>
          

        </div>
      </setting-table>
    </el-col>
    

    <!-- 巡檢總評選項顯示 -->
    <el-col :span="24" class="el-rute-content storeLevel">
      <setting-table :table-name="$t('insSettingView.commentStatus')">
        <div slot="tableDetail" class="setting-config rule-item" style="flex-direction: column; align-items: flex-start">
          <div class="overall_options">

            <div class="overall_row" v-for="(item, index) in defaultDefineName" :key="index">
              <el-radio-group class="storevue-radio radio_item" v-model="item.defineStatus">
                <el-radio :label="0" style="margin-right: 60px; min-width: 100px;" >{{item.name}}</el-radio> 
                <el-radio :label="1" style=" width: fit-content;">{{ $t('insSettingView.userDefined')}} </el-radio> 
              </el-radio-group>
              <el-input
                :ref=item.refName
                :placeholder="$t('audit.workFlows.defineItem')" 
                v-model="item.newName"
                :disabled="item.defineStatus == 0"
                style="width: 200px;  margin: 0 20px ;"
                @input="(val) => itemInputChanged_overall({ val, item })"
                />
            </div>
            
            <span class="text_limit_sign" v-if="showInputLimit_overallItem"> {{$t('insSettingView.inputRuletip')}} </span>
          </div>
        </div>
      </setting-table>
    </el-col>



    <!-- 巡檢建議值 -->
    <el-col :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.isCheckSuggest')">
        <div slot="tableDetail" class="setting-config rule-item" style="flex-direction: column; align-items: flex-start">
          <el-checkbox class="storevue-checkbox-outlined" v-model="setting_isAutoMappingActivate" @change="switchIsAutoMappingActivate">
            <span>
              {{$t('insSettingView.autoSelectComment')}} 
            </span>
          </el-checkbox>

          <div v-if="setting_isAutoMappingActivate" style="width: 100%;">
          <!-- radio 1 -->
          <el-radio-group class="storevue-radio suggestvalue" v-model="setting_autoMappingByTotalScore">
            <div class="suggestvalue_section" style="margin-bottom: 3px">

              <el-radio :label="true" style="margin-bottom: 10px">{{$t('insSettingView.selectByScore')}} </el-radio> 

                <div class="for_flex">
                  <div class="suggestvalue_naming">
                      <div class="item_name">
                        <div v-if="defaultDefineName[0].newName !== ''">{{defaultDefineName[0].newName}}</div>
                        <div style="color: #c0c0c0" v-if="defaultDefineName[0].newName == ''">{{$t('insSettingView.noUserDefinedName')}}</div>
                      </div>
                      <div class="item_name">
                        <div v-if="defaultDefineName[1].newName !== ''">{{defaultDefineName[1].newName}}</div>
                        <div style="color: #c0c0c0" v-if="defaultDefineName[1].newName == ''">{{$t('insSettingView.noUserDefinedName')}}</div>
                      </div>
                      
                      <div class="item_name">
                        <div v-if="defaultDefineName[2].newName !== ''">{{defaultDefineName[2].newName}}</div>
                        <div style="color: #c0c0c0" v-if="defaultDefineName[2].newName == ''">{{$t('insSettingView.noUserDefinedName')}}</div>
                      </div>
                  </div>

                  <div class="suggestvalue_score">
                    <!-- low score -->
                    <div class="item_score">
                      <div class="score">{{minScore}} {{$t('statistics.score')}}</div>   
                      <span style="margin: 0 15px"> ~ </span>  
                      <div class="score"> {{showScoreMin}} {{$t('statistics.score')}}</div>
                    </div>

                    <!-- middle score -->
                    <div class="item_score">
                      <div class="score">
                        <el-input
                          placeholder="" 
                          style="width: 90px;"
                          v-model="scoreMiddleLow"
                          :disabled = "!setting_autoMappingByTotalScore"
                          @blur="inputScoreMiddleMin"
                          
                          />
                          {{$t('statistics.score')}}
                        </div>  
                      <span style="margin: 0 15px"> ~ </span>  
                      <div class="score"> 
                        <el-input
                          placeholder="" 
                          style="width: 90px;"
                          v-model="scoreMiddleHeight"
                          :disabled = "!setting_autoMappingByTotalScore"
                          @blur="inputScoreMiddleMax"/>
                          {{$t('statistics.score')}} 
                      </div>
                      <span v-if="ScoreMsg" class="score_msg" style="margin-left: 20px">
                          * {{$t('insSettingView.needHeighterThan')}}
                      </span>
                    </div>
                    
                    <!-- hight score -->
                    <div class="item_score">
                      <div class="score">{{showScoreMax}}  {{$t('statistics.score')}}</div>   
                      <span style="margin: 0 15px"> ~ </span>  
                      <div class="score"> {{maxScore}}  {{$t('statistics.score')}}</div>
                    </div>

                    
                  </div>
                </div>

            </div>

            <!-- radio 2 -->
            <div class="suggestvalue_section">
              <el-radio :label="false" v-model="dangerousOnFailedItem">
                <span  style="font-weight: 400">{{$t('insSettingView.tab1FailedDangeous')}}</span> ： <span style="color: #1375bc; font-weight: 900">{{defaultDefineName[0].newName}}</span></el-radio> 
            </div>
            
          </el-radio-group>
          </div>

        </div>
      </setting-table>
    </el-col>

    <!-- 巡檢附件上傳 -->
    <el-col v-if="mode === 1" :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.isCheckAnnex')">
        <div slot="tableDetail">
          <p class="rule-item">
            <el-checkbox class="storevue-checkbox-outlined" v-model="onSitePhotoOnly">
              <span>
                {{ $t('insSettingView.AllowPhotos') }}
              </span>
            </el-checkbox>
          </p>
        </div>
      </setting-table>
    </el-col>
    

    <!-- 巡檢簽名 -->
    <el-col v-if="mode === 1" :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.inspectionSignature')">
        <div slot="tableDetail" class="setting-config rule-item" style="flex-direction: column; align-items: flex-start">
          <el-checkbox class="storevue-checkbox-outlined" v-model="onSiteSignature" >
            <span>
              {{ $t('insSettingView.needSignature') }}
            </span>
          </el-checkbox>

          <div class="signatrue_section" v-if="onSiteSignature">
            <div class="define_sign">
              <div class="title">{{$t('insSettingView.defineTitle')}}</div> 
              <el-button
                @click="addSignature"
                v-if="signatureData.extra.length < 4"
                class="addsign_button_outlined"
                size="mini" type="primary">
                <i class="iconfont el-icon-plus"/>{{$t('insSettingView.addSignature')}}
              </el-button>
            </div>
            <div class="signatrue_row"  v-for="(item, index) in signatureData.extra" :key="index">
              {{$t('insSettingView.principal')}}
              <el-input
                :placeholder="$t('insSettingView.inputData')" 
                v-model="item.header"
                ref="workflowName"
                style="width: 250px;  margin: 0 20px ;"
                @input="(val) => itemInputChanged({ val, item })"
                />
                
              <el-radio-group class="storevue-radio" v-model="item.optional" >
                <el-radio :label="true">{{$t('insSettingView.mustSignature')}}</el-radio> 
                <el-radio :label="false" v-if="index !== 0">{{$t('insSettingView.uncertainSignature')}}</el-radio> 
              </el-radio-group>
              <div class="delete_sign">
                <img 
                  v-if="index !== 0"
                  :key="index"
                  class="child-space"
                  :src="`./static/img/table-delete.png`" 
                  height="24px"
                  width="24px"
                  @click="deleteSign(index)"
              />
              </div>
            </div>
            <span class="text_limit_sign" v-if="showInputLimit"> {{$t('insSettingView.inputRuletip')}}  </span>
          </div>
        </div>
      </setting-table>
    </el-col>

    <!-- 自定義評估選項 -->
    <el-col :span="24" class="el-rute-content" style="margin-bottom:20px;">
      <setting-table :table-name="$t('insSettingView.btnAttributeValues')">
        <div slot="tableDetail" class="setting-config" >
          <div class="radio-setting-content">
            <div class="btn-title rule-score">{{ $t('insSettingView.passFailAttr') }}</div>
            <div class="attribute-group">
              <div v-for="(btnAttrItem, btnAttrIndex) in itemOptionsForType1">
                <el-radio
                  v-if="btnAttrIndex < btnAttrItem.items.length"
                  :label="btnAttrItem.key"
                  :key="btnAttrIndex"
                  v-model="passFailBtnAttr">
                  {{ btnAttrItem.items[0].name }} {{ slash }} {{ btnAttrItem.items[1].name }}
                </el-radio>
                <div v-else class="input-list">
                  <el-radio :label="btnAttrItem.key" :key="btnAttrIndex" v-model="passFailBtnAttr">
                    {{ $t('insSettingView.userDefined') }}
                  </el-radio>
                  <template>
                    <validate-input
                      ref="tab1PassInput"
                      :input-limit-length="8"
                      :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                      :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                      :input-name="btnAttrItem.items[0].name"
                      @getInputValue="val => getPassFailBtnName(val, 0)"/>
                    {{ slash }}
                    <validate-input
                      ref="tab1FailInput"
                      :input-limit-length="8"
                      :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                      :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                      :input-name="btnAttrItem.items[1].name"
                      @getInputValue="val => getPassFailBtnName(val, 1)"/>
                  </template>
                </div>
              </div>
            </div>
            <div class="radio-setting-content">
              <div class="btn-title rule-score">{{ $t('insSettingView.othersAttr') }}</div>
              <div class="attribute-group">
                <div v-for="(btnAttrItem, btnAttrIndex) in itemOptionsForType3">
                  <el-radio
                    v-if="btnAttrIndex < btnAttrItem.items.length"
                    :label="btnAttrItem.key"
                    :key="btnAttrIndex"
                    v-model="otherBtnAttr">
                    {{ btnAttrItem.items[0].name }} {{ slash }} {{ btnAttrItem.items[1].name }}
                  </el-radio>
                  <div v-else class="input-list">
                    <el-radio :label="btnAttrItem.key" :key="btnAttrIndex" v-model="otherBtnAttr">
                      {{ $t('insSettingView.userDefined') }}
                    </el-radio>
                    <template>
                      <validate-input
                        ref="tab3PassInput"
                        :input-limit-length="8"
                        :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                        :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                        :input-name="btnAttrItem.items[0].name"
                        @getInputValue="val => getOtherBtnName(val, 0)"/>
                      {{ slash }}
                      <validate-input
                        ref="tab3FailInput"
                        :input-limit-length="8"
                        :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                        :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                        :input-name="btnAttrItem.items[1].name"
                        @getInputValue="val => getOtherBtnName(val, 1)"/>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </setting-table>
    </el-col>

    <!-- 事件超時未處理提醒 -->
    <el-col :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.eventTimeoutReminder')">
        <div slot="tableDetail" class="setting-config rule-item">
          <div>
            <div>
              <el-checkbox class="storevue-checkbox-outlined" v-model="enableDelay">
                <span>
                  {{ $t('insSettingView.sendMsgRemind') }}
                </span>
              </el-checkbox>
            </div>
            <div class="flex-center">
              <span style="white-space:nowrap;">{{ $t('insSettingView.moreThan') }}</span>
              <el-input
                ref="delay_day"
                style="margin: 0 20px"
                v-model="delayDay"
                type="number"
                :disabled="!enableDelay"
                :min="1"
                @change="onMsgRemindChanged"
              />
              <span>{{ $t('overview.day') }}</span>
            </div>
          </div>
        </div>
      </setting-table>
    </el-col>


    <el-col v-if="mode === 1" :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.inspectionCheckin')">
        <div slot="tableDetail" class="setting-config rule-item">
          <el-checkbox class="storevue-checkbox-outlined" v-model="checkin">
            <span>
              {{ $t('insSettingView.needCheckin') }}
            </span>
          </el-checkbox>
        </div>
      </setting-table>
    </el-col>
    
    <!-- binding workflow -->
    <el-col :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.bindWorkFLow')">
        <div slot="tableDetail" class="setting-config rule-item">
          <span style="margin-right: 20px"> {{ $t('insSettingView.bindWorkflow') }}</span>  
          <el-select v-model="workFlowToBind" :placeholder="$t('insSettingView.select') ">
              <el-option
                v-for="item in workFlowList"
                :key="item.processDefinitionKey"
                :label="item.name"
                :value="item.processDefinitionKey"
                >
                
              </el-option>
            </el-select>
        </div>
      </setting-table>
    </el-col>
  </el-row>
</template>

<script>
import { inpectRESTful } from '@/api/index';
import { workflowItems, bindWorkflow, unbindWorkflow} from '@/api/workflow';
import util from '@/common/util';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import ValidateInput from '@/components/ValidateInput';
import filterString from '@/common/filterString.js';

export default {
  name: 'SetRuleInspect',
  components: { ValidateInput, SettingTable, DelayButton },
  data() {
    return {
      delayDay: 1,
      enableDelay: false,
      hundredMarkType: '0',
      minScore: 0,
      maxScore: 100,
      includedInTotalScoreWithType1: false,
      qualifiedForIgnoredWithType1: false,
      qualifiedForIgnoredWithType2: false,
      aaa: false,
      bbb: false,

      setting_isAutoMappingActivate: false,
      setting_autoMappingByTotalScore: true,
      dangerousOnFailedItem: false,


      onSitePhotoOnly: false,
      lang: this.$i18n.locale,
      ScoreMsg: false,
      inspectId: 0,
      routeName: '',
      mode: 0,
      onSiteSignature: true,
      checkin: false,
      btnAttribute: 0,
      slash: '/',
      baseScore: 100,
      itemOptionsForType1: {},
      passFailBtnAttr: '',
      itemOptionsForType3: {},
      otherBtnAttr: '',
      standardScore: 100,
      MinScoreMsg:false,

      workFlowToBind:'',
      workFlowList:[],
      bindWorkFlowData:{},
      workFlowInfoValue:{},
      signatureData:{
          "name": "onSiteSignature",
          "value": true,
          "extra": [
              {
                "optional": true,
                "header": this.$t('audit.auditStatus.sign')+"1"
              }
          ]
        },
      n : 1,
      showInputLimit: false,
      showInputLimit_overallItem: false,
      defaultDefineName:[
        {
          name: this.$t('overview.danger') ,
          newName:  this.$t('overview.danger'),
          defineStatus: 0,
          refName: 'bad',
          is_customize: false
        },
        {
          name: this.$t('overview.improve'),
          newName: this.$t('overview.improve'),
          defineStatus: 0,
          refName: 'fair',
          is_customize: false
        },
        {
          name: this.$t('overview.echartGood'),
          newName: this.$t('overview.echartGood'),
          defineStatus: 0,
          refName: 'good',
          is_customize: false
        },
      ],
      scoreMiddleLow: 0,
      scoreMiddleHeight: 0,
      inspectStatus:"",
      settingStatus: true
    };
  },
  watch: {
    passFailBtnAttr() {
      if (this.$refs.tab1PassInput) {
        this.$refs.tab1PassInput[0].showPromotMsgFlag = false;
        this.$refs.tab1FailInput[0].showPromotMsgFlag = false;
      }
    },

    otherBtnAttr() {
      if (this.$refs.tab3PassInput) {
        this.$refs.tab3PassInput[0].showPromotMsgFlag = false;
        this.$refs.tab3FailInput[0].showPromotMsgFlag = false;
      }
    },
    workFlowToBind(processDefinitionKey){
      this.bindWorkFlowData.processDefinitionKey = processDefinitionKey
      this.bindWorkFlowData.type = 0
      this.bindWorkFlowData.inspectTagId = this.inspectId
      // console.log('this.workFlowToBind ~~~~>> ', this.workFlowToBind);
    },

    
    enableDelay(val){
      if(val == true && this.delayDay == undefined)  this.delayDay = 1
    },


    onSiteSignature:{
      immediate: false, 
      deep: true,
      handler (val,old ) {
        const self = this;
        console.log("onSiteSignature:",val)
        self.signatureData.value = self.onSiteSignature;
        console.log("this.signatureData:",self.signatureData)
        self.n = 1
        if(val){
          var tempSign = {
            "name": "onSiteSignature",
            "value": true,
            "extra": [
                {
                  "optional": true,
                  "header": self.$t('audit.auditStatus.sign')+"1"
                }
            ]
          }
          self.signatureData = tempSign;
          self.n++;
        }
      }
    },

    setting_autoMappingByTotalScore(val){
      if(this.setting_isAutoMappingActivate) {
        this.dangerousOnFailedItem = !val
        this.settingStatus = val
      }     
    },

    defaultDefineName:{
      immediate: false, 
      deep: true,
      handler (val, old ) {
        // if(val[0].defineStatus == 0) val[0].newName = val[0].name
        for(let i of val ){
          if(i.defineStatus == 0) {
            i.newName = i.name
            i.is_customize = false
          } else if(i.defineStatus == 1){
            i.is_customize = true
          }
          
        }
        console.log('val :>> ', val);
      }
    },

  },
  computed:{
    showScoreMin(){
      var tempScore =  (parseFloat(this.scoreMiddleLow) - 0.1)
      return Number.isInteger(tempScore) ? tempScore.toFixed(0) : tempScore.toFixed(1)
    },
    showScoreMax(){
      var tempScore =  (parseFloat(this.scoreMiddleHeight) + 0.1)
      return Number.isInteger(tempScore) ? tempScore.toFixed(0) : tempScore.toFixed(1)
    }
  },

  async mounted() {
    
    await this.getRule();
    await this.workflowItems()
    await this.getInspectStatus()

    console.log('this.defaultDefineName >>>>>>>> ', this.defaultDefineName);
    console.log('this.inspectStatuse >>>>>>>> ', this.inspectStatus);
    for (let i = 0; i < 3; i++) {
      if(this.inspectStatus["is_customize_" + i] == false){
        this.defaultDefineName[i].defineStatus = 0
        this.defaultDefineName[i].newName = this.defaultDefineName[i].name
      } else {
          this.defaultDefineName[i].defineStatus = 1
          this.defaultDefineName[i].newName = this.inspectStatus["status_"+ i]
      }
      
      // if(this.defaultDefineName[i].name !== this.inspectStatus["status_" + i]) {
      //     this.defaultDefineName[i].defineStatus = 1
      //     this.defaultDefineName[i].newName = this.inspectStatus["status_"+ i]
      //   } else {
      //     this.defaultDefineName[i].defineStatus = 0
      //     this.defaultDefineName[i].newName = this.defaultDefineName[i].name
      //   }
    }
    
    // console.log('this.inspectStatus  mounted:>> ', this.inspectStatus);
    // console.log('this.defaultDefineName  mounted:>> ', this.defaultDefineName);
    // console.log('this.setting_autoMappingByTotalScore  mounted >>>>>>>----->> ', this.setting_autoMappingByTotalScore);

  },

  methods: {

    switchIsAutoMappingActivate(val){
      if(!val){
        this.setting_autoMappingByTotalScore = false
        this.dangerousOnFailedItem = false
      } else {
        this.setting_autoMappingByTotalScore = this.settingStatus
        this.dangerousOnFailedItem = !this.settingStatus
      }
      // console.log('this.setting_autoMappingByTotalScore :>> ', this.setting_autoMappingByTotalScore);
      // console.log('this.dangerousOnFailedItem :>> ', this.dangerousOnFailedItem);
    },

    countNumMin(){
      var minScore = parseFloat(this.minScore)
      var maxScore = parseFloat(this.maxScore)

      var middleLow = (((maxScore - minScore) * .5) + minScore)
      this.scoreMiddleLow = Number.isInteger(middleLow) ? middleLow.toFixed(0) : middleLow.toFixed(1)
    },
    countNumMax(){
      var minScore = parseFloat(this.minScore)
      var maxScore = parseFloat(this.maxScore)
      var middleHeight = (((maxScore - minScore) * .8) + minScore)
      this.scoreMiddleHeight = Number.isInteger(middleHeight) ? middleHeight.toFixed(0) : middleHeight.toFixed(1)
    },
    


    async submitRule() {
      const self = this;
      if(this.enableDelay && this.delayDay == undefined){
        util.notify(this.$t('audit.workFlows.cantEmptyDays'), 'error', 2000 );
        this.$refs.delay_day.focus()
        return 
      } 
      else if(this.delayDay > 365){
        util.notify(this.$t('audit.workFlows.cantTooMuchDays'), 'error', 2000 );
        this.$refs.delay_day.focus()
        return
      }

       // handle bind workflow
      if( !!this.workFlowToBind ){
        if(this.bindWorkFlowData.processDefinitionKey == -1){   
          this.bindWorkFlowData.processDefinitionKey = this.workFlowInfoValue.processDefinitionKey
          await this.unbindWorkflow(this.bindWorkFlowData)
        }else {
          await this.bindWorkflow(this.bindWorkFlowData)
        }
      }

      for (let i = 0; i < 3; i++) {
        if(this.defaultDefineName[i].defineStatus == 1 && this.defaultDefineName[i].newName == "") {
          // this.$refs.stayOver.focus()
          util.notify(this.defaultDefineName[i].name + ", "+ this.$t('audit.workFlows.cantEmptyInspectStatus'), 'error', 2000)
          return 
          } 
      }
  
      if ((this.passFailBtnAttr === 'userDefined' && !this.validateUserDefinedPassFailBtnValue()) ||
          (this.otherBtnAttr === 'userDefined' && !this.validateUserDefinedOtherBtnValue())) {
        util.notify(this.$t('insSettingView.enterBtnAttr'), 'warning', 3000);
        return false;
      }
      self.MinScoreMsg = (self.hundredMarkType==1 && self.baseScore.toString()=="");
      if (!self.ScoreMsg && !self.MinScoreMsg) {
        const params = {
          inspectTagId: self.inspectId,
          ruleItems: [
            { name: 'includedInTotalScoreWithType1', value: self.includedInTotalScoreWithType1 },
            { name: 'qualifiedForIgnoredWithType1', value: self.qualifiedForIgnoredWithType1 },
            { name: 'qualifiedForIgnoredWithType2', value: self.qualifiedForIgnoredWithType2 },
            { name: 'hundredMarkType', value: parseInt(self.hundredMarkType) },
            { name: 'minScore', value: parseFloat(self.minScore) },
            { name: 'maxScore', value: parseFloat(self.maxScore) },
            { name: 'baseScore', value: parseFloat(self.baseScore) },
            { name: 'standardScore', value: parseFloat(self.standardScore) },
            

            { name: 'setting_isAutoMappingActivate', 
              category: "generalRule",
              value: self.setting_isAutoMappingActivate 
            },
            
            {
              name: "setting_autoMappingByTotalScore", // 依分數條件自動選取
              category: "generalRule",
              value: self.setting_autoMappingByTotalScore ,
              extra: [
                  {
                    key: "mappingScore_bottom", // 下標值
                    value: self.scoreMiddleLow
                  },
                  {
                    key: "mappingScore_top", // 上標值
                    value: self.scoreMiddleHeight
                  }
                ]
            },

            { name: 'dangerousOnFailedItem', value: this.dangerousOnFailedItem },

            { name: 'onSitePhotoOnly', value: self.onSitePhotoOnly },
            { name: 'onSiteSignature', value: self.onSiteSignature },
            { name: 'checkin', value: self.checkin },
            {
              'name': 'itemOptionsForType1',
              'value': this.passFailBtnAttr,
              'extra': this.itemOptionsForType1[2]
            },
            {
              'name': 'itemOptionsForType3',
              'value': this.otherBtnAttr,
              'extra': this.itemOptionsForType3[2]
            },
            {
              'name': 'eventUnHandleNotify',
              'value': this.enableDelay,
              'extra': Number(this.delayDay)
            }
          ]
        };
    
      if(this.onSiteSignature) params.ruleItems.push(this.signatureData)
        console.log('params', params)
        
      if(this.minScore === undefined || this.minScore === '') {
        util.notify(this.$t('insSettingView.cantEmptyScoreLow'), 'error', 2000 );
        this.$refs.min_score.focus()
        return
      }
      if(this.maxScore === undefined || this.maxScore === null || this.maxScore === '') {
        util.notify(this.$t('insSettingView.cantEmptyScoreHeight'), 'error', 2000 );
        this.$refs.max_score.focus()
        return
      }

      const statusNameRes = await self.updateInspectStatus();
      const res = await self.updateInspectRule(params);
      if (res.errCode === 0 && statusNameRes.errCode == 0) {
          util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          return false;
        } else {
          util.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          return false;
        }
      }
    },

    async getRule() {
      const self = this;
      const ruleData = JSON.parse(sessionStorage.getItem('ruleData'));
      self.inspectId = ruleData.inspectId;
      self.routeName = ruleData.routeName;
      self.mode = ruleData.mode;
      const params = { inspectId: self.inspectId };
      try {
        const res = await self.getInspectRule(params);
        if (res.errCode === 0) {
          res.data.forEach(item => {
            switch (item.name) {
              case 'eventUnHandleNotify':
                self.enableDelay = item.value;
                self.delayDay = item.extra;
                break;
              case 'includedInTotalScoreWithType1':
                self.includedInTotalScoreWithType1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType1':
                self.qualifiedForIgnoredWithType1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType2':
                self.qualifiedForIgnoredWithType2 = item.value;
                break;
              case 'hundredMarkType':
                self.hundredMarkType = item.value.toString();//item.value === 0 ? '-1' =>加回比例制,不用default
                break;
              case 'minScore':
                self.minScore = item.value;
                break;
              case 'maxScore':
                self.maxScore = item.value;
                break;

              case 'dangerousOnFailedItem':
                self.dangerousOnFailedItem = item.value;
                break;
              case 'setting_isAutoMappingActivate':
                self.setting_isAutoMappingActivate = item.value;
                break;
              case 'setting_autoMappingByTotalScore':
                self.setting_autoMappingByTotalScore = item.value
                self.settingStatus= item.value

                self.scoreMiddleLow = item.extra[0].value
                self.scoreMiddleHeight = item.extra[1].value
                break;

              case 'onSitePhotoOnly':
                self.onSitePhotoOnly = item.value;
                break;
              case 'onSiteSignature':
                self.onSiteSignature = item.value;
              case 'checkin':
                self.checkin = item.value;
                break;
              case 'baseScore':
                self.baseScore = item.value;
                break;
              case 'itemOptionsForType1': {
                this.itemOptionsForType1 = item.extra;
                this.passFailBtnAttr = item.value;
                break;
              }
              case 'itemOptionsForType3': {
                this.itemOptionsForType3 = item.extra;
                this.otherBtnAttr = item.value;
                break;
              }
              case 'standardScore' : {
                this.standardScore = item.value;
                break;
              }
              default:
                break;
            }
          });
        }
      } catch (err) {
        console.log('SetInspectRule-getRule: ' + err);
      }
    },
    updateInspectRule(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.UpdateInspectRuleSettings(params).then(res => {
          resolve(res);
          
        }).catch(err => {
          reject(err);
        });
      });
    },
    getInspectRule(params) {
      const self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectRuleSettings(params).then(res => {
          resolve(res);
          
          
          var tempSign = res.data.filter(i => i.name == "onSiteSignature");
          if(tempSign[0].value == true && !tempSign[0].hasOwnProperty('extra')){
            tempSign[0]['extra'] = [];
          }
          self.signatureData = tempSign[0];
          
          if(self.signatureData.value == true && self.signatureData.extra.length == 0)  {
            self.signatureData.extra.push(
              {
                "optional": true,
                "header": self.$t('audit.auditStatus.sign')+self.n
              }
            )
            self.n++;
          }

          const tempArry = res.data.filter(list => list.name == "workflow")
          console.log('tempArry :>> ', tempArry);
          self.workFlowInfoValue = tempArry[0].value

        }).catch(err => {
          console.log("getInspectRule err:",err);
          reject(err);
        });
      });
    },



    getInspectStatus(){
      return new Promise((resolve, reject) => {
        inpectRESTful.getInspectStatus().then(res => {
          resolve(res);
          this.inspectStatus = res.data.settingContent.general_setting_inspect_status_name
          delete this.inspectStatus.update_time
          delete this.inspectStatus.update_user_id
          console.log('this.inspectStatus :>> ', this.inspectStatus);
        }).catch(err => {
          reject(err);
        });
      });
    },

    updateInspectStatus(){
      var status = {
          status_0: this.defaultDefineName[0].newName,
          is_customize_0: this.defaultDefineName[0].is_customize,
          status_1: this.defaultDefineName[1].newName,
          is_customize_1: this.defaultDefineName[1].is_customize,
          status_2: this.defaultDefineName[2].newName,
          is_customize_2: this.defaultDefineName[2].is_customize,
      }



      console.log('status ~~~~~~~~>> ', status);
      return new Promise((resolve, reject) => {
        inpectRESTful.updateInspectStatus(status).then(res => {
          resolve(res);
          
        }).catch(err => {
          reject(err);
        });
      });

    },

    inputChangeMin(e) {
      const self = this;
      let minScore = self.getUtilScore(e.target.value);
      // if(minScore == "") minScore = 0

      if(minScore === self.maxScore) minScore = minScore - 1
      this.countNumMin()
      this.countNumMax()
      self.minScore = minScore
      self.ScoreMsg = parseFloat(self.minScore) > parseFloat(self.maxScore);
      self.MinScoreMsg = (self.hundredMarkType=='1' && self.baseScore.toString()=="");
    },
    
    inputChangeMax(e) {
      let maxScore = this.getUtilScore(e.target.value);
      // if(maxScore < 1) maxScore = 1

      if(this.minScore === maxScore) maxScore = maxScore + 1
      this.countNumMin()
      this.countNumMax()

      if (this.hundredMarkType === '1') {
        maxScore = parseFloat(maxScore) > parseFloat(this.baseScore) ? parseFloat(this.baseScore) : maxScore;
      }
      this.maxScore = maxScore;
      this.standardScore = parseFloat(this.standardScore) > parseFloat(this.maxScore)
        ? parseFloat(this.maxScore) : this.standardScore;
      this.ScoreMsg = parseFloat(this.minScore) >= parseFloat(this.maxScore);
    },

    



    inputScoreMiddleMin(e){
      const self = this;
      // self.scoreMiddleHeight = parseInt(self.scoreMiddleHeight)
      
      var scoreMiddleLow = self.getUtilScore(e.target.value);
      self.scoreMiddleLow = parseFloat(scoreMiddleLow)
      self.minScore = parseFloat(self.minScore)
      self.scoreMiddleHeight = parseFloat(self.scoreMiddleHeight)

      var isNotNumber = isNaN(self.scoreMiddleLow)

      if(self.scoreMiddleLow == '' || self.scoreMiddleLow == null){
        this.countNumMin()
      }
      else if(isNotNumber){
        this.countNumMin()
      }
      else if(self.scoreMiddleLow <= self.minScore + 0.1) {
        self.scoreMiddleLow = (self.minScore + 0.2).toFixed(1)
      } 
      else if(self.scoreMiddleLow >= self.scoreMiddleHeight){
        this.countNumMin()
      }
    },

    inputScoreMiddleMax(e){
      const self = this;
      var scoreMiddleHeight = self.getUtilScore(e.target.value);
      self.scoreMiddleHeight = parseFloat(scoreMiddleHeight)
      self.maxScore = parseFloat(self.maxScore)
      self.scoreMiddleLow = parseFloat(self.scoreMiddleLow)

      var isNotNumber = isNaN(self.scoreMiddleHeight)

      if(self.scoreMiddleHeight == '' || self.scoreMiddleHeight == null){
        this.countNumMax()
      }
      else if(isNotNumber){
        this.countNumMax()
      }
      else if(self.scoreMiddleHeight >= self.maxScore) {
        self.scoreMiddleHeight = (self.maxScore - 0.2).toFixed(1)
      }
      else if(self.scoreMiddleLow >= self.scoreMiddleHeight){
        this.countNumMax()
      }
  
    },


    getUtilScore(val) {
      val = val.replace(/[^-?\d\.]/g, '');
      val = val.replace(/\.{2,}/g, '.');
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      val = val.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-');
      val = val.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
      if (val !== '-0' && !isNaN(val) && val.indexOf('.') < 0 && val != '') {
        val = parseFloat(val);
      }
      return val;
    },

    inputChangeBaseScore(e) {
      this.baseScore = this.getUtilScore(e.target.value);
      this.maxScore = parseFloat(this.maxScore) > parseFloat(this.baseScore)
        ? parseFloat(this.baseScore) : this.maxScore;
      this.standardScore = parseFloat(this.standardScore) > parseFloat(this.maxScore)
        ? parseFloat(this.maxScore) : this.standardScore;
    },

    getPassFailBtnName(val, index) {
      const length = this.itemOptionsForType1.length;
      this.itemOptionsForType1[length - 1].items[index].name = val;
    },

    getOtherBtnName(val, index) {
      const length = this.itemOptionsForType3.length;
      this.itemOptionsForType3[length - 1].items[index].name = val;
    },

    validateUserDefinedPassFailBtnValue() {
      const length = this.itemOptionsForType1.length;
      !this.itemOptionsForType1[length - 1].items[0].name && this.$refs.tab1PassInput[0].onBlur();
      !this.itemOptionsForType1[length - 1].items[1].name && this.$refs.tab1FailInput[0].onBlur();
      return this.itemOptionsForType1[length - 1].items[0].name && this.itemOptionsForType1[length - 1].items[1].name;
    },

    validateUserDefinedOtherBtnValue() {
      const length = this.itemOptionsForType3.length;
      !this.itemOptionsForType3[length - 1].items[0].name && this.$refs.tab3PassInput[0].onBlur();
      !this.itemOptionsForType3[length - 1].items[1].name && this.$refs.tab3FailInput[0].onBlur();
      return this.itemOptionsForType3[length - 1].items[0].name && this.itemOptionsForType3[length - 1].items[1].name;
    },

    inputChangeStandardScore(e) {
      let score = this.getUtilScore(e.target.value);
      if (parseFloat(score) > parseFloat(this.maxScore)) {
        score = parseFloat(this.maxScore);
      } else if (parseFloat(score) < parseFloat(this.minScore)) {
        score = parseFloat(this.minScore);
      }
      this.standardScore = score;
    },
    onMsgRemindChanged(e){
      if(e<=0){
        this.delayDay=1;
      }else{
        this.delayDay = e;
      }
    },

    async workflowItems(){
      await workflowItems().then(res=>{
        this.workFlowList = res.data
        console.log('this.workFlowList ~~~~>> ', this.workFlowList);
        console.log('this.workFlowInfoValue 2:>> ', this.workFlowInfoValue);
        if(this.workFlowInfoValue !== null){
          const firstObj = {
            processDefinitionKey: -1,
            name: "無",
          }
          this.workFlowList = [firstObj, ...res.data]
          this.workFlowToBind = this.workFlowInfoValue.processDefinitionKey
        }
        
      }).catch(err => {
        console.log('error' + err);
      });
    },

    async bindWorkflow(param){
      console.log('param :>> ', param);
      await bindWorkflow(param).then(res=>{
        console.log('bind ~~~~~~>> ', res);
        
        // const firstObj = {
        //   processDefinitionKey: -1,
        //   name: "無",
        // }
        // this.workFlowList = [firstObj, ...this.workFlowList]
        
      }).catch(err => {
        console.log('error' + err);
      });
    },

    async unbindWorkflow(param){
      await unbindWorkflow(param).then(res=>{
        console.log('unbind :>> ', res);
        // this.workFlowList.shift()

      }).catch(err => {
        console.log('error' + err);
      });
    },

    addSignature(index){
      var addObj = {
          "optional": true,
          "header": this.$t('audit.auditStatus.sign')+`${this.n}`
      }
      if(this.signatureData.extra.length < 4) this.signatureData.extra.push(addObj)
      return this.n++
    },

    deleteSign(index){
      console.log('index :>> ', index);
      this.signatureData.extra.splice(index, 1)
      // this.n--;
      // let tempN = this.n;
      // for(var i=this.signatureData.extra.length-1; tempN >1; i--){
      //   tempN--; 
      //   this.signatureData.extra[i].header = this.$t('audit.auditStatus.sign')+tempN;
      // }
    },

    itemInputChanged({ val, item }){
      const content = filterString.all(val, 20);
      item.header = content

      const length = filterString.getContentLength(val);
      if(length > 20) {
        this.showInputLimit = true
      } else {
        this.showInputLimit = false
      }
    },


    itemInputChanged_overall({ val, item }){
      const content = filterString.all(val, 20);
      item.newName = content
      const length = filterString.getContentLength(val);
      if(length > 20) {
        this.showInputLimit_overallItem = true
      } else {
        this.showInputLimit_overallItem = false
      }
    },

 



  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
@import '../../../assets/css/textstyle.css';
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
$itemHeight:50px;
@function rem($val){
    @return $val/16+rem;
}
@function checkRem($val){
    @if($val==auto){@return auto;}
    @else if($val==0){@return 0;}
    @else{@return rem($val);}
}
@mixin point($poi,$val){
    #{$poi}:checkRem($val);
}
.signatrue_section{
  width: 100%;
  background: #f7f9fa;
  margin-bottom: 20px;
  padding: 20px;
  .define_sign{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .title{
      margin-right: 20px;
    }
    .addsign_button_outlined{
      border: 1px solid #f31d65;
      color: #f31d65;
      background: #FFF;
      &:hover{
        background: rgba(243,29,101, .08);
      }
    }
  }
  .signatrue_row{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .delete_sign{
      background: none;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-left: 20px;
      transition: all .3s;
      &:hover{
        transform: scale(1.2);
      }
    }
  }
}

.overall_options{
  width: 100%;
  padding: 10px 0;
  }
  .overall_row{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .radio_item{
      // .el-radio{
      //   width: 60px !important;
      // }
    }  
  }



.text_limit_sign{
  position: relative;
  text-align: left;
  line-height: 20px;
  margin-left: 5px;
  font-size: 10px;
  margin-top: 2px;
  color: #ff2400;
  display: block;

}

.el-setRule{
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 125px - 60/1920*100vw);
    color: #424151;
    border: 1px solid $border;
    background-color: #fff;
    padding:0 calc(20/1920*100vw);
    .el-rute-title{
        width: 100%;
        @include point(height,60);
        @include point(line-height,60);
        height: 80px;
        line-height: 80px;
        border-bottom: 1px solid $border;
        text-align: left;
        position: relative;
        .tab-name{
            text-align: left ;
            margin-left:calc(15/1920*100vw);
            font-weight: bold;
            font-size: calc(20/1920*100vw);
        }
    }
    .el-rute-content{
        margin-top: 20px;
        padding-bottom: 20px;
        .rule-title{
            height:40px;
            margin:0;
            line-height: 40px;
            font-size: calc(16/1920*100vw);
            background-color: #e9eff8;
            padding-left: calc(20/1920*100vw);
            text-align: left ;
            font-weight: bold;
        }
        .rule-score{
            height:40px;
            margin:0;
            line-height: 40px;
            font-size: calc(14/1920*100vw);
            padding-left: calc(20/1920*100vw);
            text-align: left ;
            font-weight: bold;
            border-bottom: 1px solid #e3e9f4;
        }
        .rule-item{
            height:60px;
            margin:0;
            font-size: calc(14/1920*100vw);
            text-align: left ;
            padding-left: 30px;
            line-height: 60px;
            border-bottom: 1px solid #e3e9f4;
            .input{
                width:70px;
            }
            .input-text{
                margin:0 calc(10/1920*100vw);
            }
            .score_msg{
              font-size: calc(10/1920*100vw);
              color:red;
            }
            .rangeScore{
                margin-right: calc(20/1920*100vw);
            }
            .radio{
                margin-right: 10px;
                >>> .el-radio__label{
                    margin-left: calc(30/1920*100vw);
                    padding:0;
                    color:#424151;
                }
            }
            >>> .el-checkbox__label{
              padding-left: calc(30/1920*100vw);
              color:#424151;
            }
        }
      .attribute-group{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 60px;
        padding-left: calc(30/1920*100vw);
        .el-radio{
          margin-right: calc(50/1920*100vw);
        }
      }
      .input-list{
        display: inline-flex;
        align-items: center;
      }
      .setting-config{
        height: auto;
        padding-left: 0;
      }
      .setting-config.rule-item{
        padding-left: calc(30/1920*100vw);
        padding-right: calc(30/1920*100vw);
      }
      .dialog-form-item{
        height: auto;
        margin-bottom: 0;
      }

      .radio-setting-content{
        width: 100%;
        .btn-title{
          padding-left: calc(30/1920*100vw);
          border-bottom: 1px solid #e3e9f4;
          border-top: 1px solid #e3e9f4;
        }
      }
    }
}
</style>

<style lang="sass" scoped>
  .suggestvalue
    width: 100%
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start
    .suggestvalue_section
      width: 100%
      background: #f7f9fa
      margin-bottom: 20px
      padding: 20px 20px
      font-size: 15px
    
      .for_flex
        margin-top: 10px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: flex-start
        .suggestvalue_naming
          margin-left: 30px
          margin-right: 20px
          .item_name
            min-width: 70px
            height: 45px
            display: flex
            flex-direction: row
            justify-content: flex-start
            align-items: center
          
        .suggestvalue_score
          .item_score
            height: 45px
            display: flex
            flex-direction: row
            justify-content: flex-start
            align-items: center
            .score
              width: 110px
              display: flex
              flex-direction: row
              justify-content: flex-end
              align-items: center
              .el-input--medium
                margin-right: 5px

              
  

</style>

<style lang="sass">
.suggestvalue_score
  .item_score 
    .score
      .el-input--medium .el-input__inner
        text-align: right
.score
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button 
    -webkit-appearance: none
    margin: 0

.storeLevel
  .setting-table-container
    .setting-header
      background: #e4f3fd

</style>
