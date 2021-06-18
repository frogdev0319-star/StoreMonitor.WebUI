<template>
  <el-row class="el-setRule">
    <el-col :span="24" class="el-rute-title">
      <span class="tab-name">【{{ routeName }}】{{ $t('insSettingView.ruleInspect') }}</span>
      <div style="float:right;">
        <delay-button
          size="mini"
          type="primary"
          class="bind-btn"
          @click="submitRule">
          {{ $t('titleView.save') }}
        </delay-button>
      </div>
    </el-col>
    <el-col :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.PatrolScoreCalculation')">
        <div slot="tableDetail">
          <p class="rule-item">
            <el-checkbox v-model="includedInTotalScoreWithType1">
              {{ $t('insSettingView.PSCrule1') }}Tab1
            （{{ $t('insSettingView.sheetpassfail') }}）{{ $t('insSettingView.PSCrule2') }}
            </el-checkbox>
          </p>
          <p class="rule-item">
            <el-checkbox v-model="qualifiedForIgnoredWithType1">
              <span v-if="lang==='en'">
                {{ $t('insSettingView.PSCrule3') }}
              </span> Tab1（{{ $t('insSettingView.sheetpassfail') }}）
              <span v-if="lang!=='en'">{{ $t('insSettingView.PSCrule3') }}</span>
            </el-checkbox>
          </p>
          <p class="rule-item">
            <el-checkbox v-model="qualifiedForIgnoredWithType2">
              <span v-if="lang==='en'">{{ $t('insSettingView.PSCrule3') }}
              </span>
              Tab2（{{ $t('insSettingView.sheetscore') }}）
              <span v-if="lang!=='en'">
                {{ $t('insSettingView.PSCrule3') }}
              </span>
            </el-checkbox>
          </p>
          <p class="rule-score">
            {{ $t('insSettingView.CalculationMethod') }}：
          </p>
          <p class="rule-item">
            <!--<el-radio v-model="hundredMarkType" label="0" class="radio">-->
              <!--{{ $t('insSettingView.Proportional') }}-->
            <!--</el-radio>-->
            <!--<el-tooltip-->
              <!--class="item"-->
              <!--effect="dark"-->
              <!--placement="bottom-end">-->
              <!--<div slot="content">{{ $t('insSettingView.ProportionalDes') }}</div>-->
              <!--<i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>-->
            <!--</el-tooltip>-->
            <el-radio v-model="hundredMarkType" label="-1" class="radio">
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
              <div slot="content">{{ $t('insSettingView.totalScoreDes') }} + {{$t('insSettingView.accumulateTotalScore')}}</div>
              <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>
            </el-tooltip>
          </p>
          <p class="rule-item">
            <span class="rangeScore">
              {{ $t('insSettingView.totalScorRange') }}：
            </span>
            <el-input :placeholder="$t('insSettingView.setMinScore')" v-model="minScore" class="input" @input="inputChangeMin"/>
            <span class="input-text">
              {{ $t('remotePatrol.scorecount') }}~
            </span>
            <el-input :placeholder="$t('insSettingView.setMaxScore')" v-model="maxScore" class="input" @input="inputChangeMax"/>
            <span class="input-text">
              {{ $t('remotePatrol.scorecount') }}
            </span>
            <span v-if="ScoreMsg" class="score_msg">*{{ $t('insSettingView.rangeScoreTips') }}</span>
            <template v-if="hundredMarkType === '1'">
              <span class="rangeScore">
              {{ $t('remotePatrol.totalScoreUnit') }}
            </span>
              <el-input :placeholder="$t('insSettingView.setMinScore')" v-model="baseScore" class="input" @input="inputChangeBaseScore"/>
            </template>
          </p>
        </div>
      </setting-table>
    </el-col>
    <el-col :span="24" class="el-rute-content">
      <setting-table :table-name="$t('insSettingView.isCheckSuggest')">
        <div slot="tableDetail">
          <p class="rule-item">
            <el-checkbox v-model="dangerousOnFailedItem">
              <span v-if="lang!=='en'">
                Tab1（{{ $t('insSettingView.sheetpassfail') }}）{{ $t('insSettingView.patrolSuggest') }}
              </span>
              <span v-else>
                When there are unqualified items in Tab1 ({{ $t('insSettingView.sheetpassfail') }}),
                the inspection result is: Dangerous.
              </span>
            </el-checkbox>
          </p>
        </div>
      </setting-table>
    </el-col>
    <el-col :span="24" class="el-rute-content" v-if="mode === 1">
      <setting-table :table-name="$t('insSettingView.isCheckAnnex')">
        <div slot="tableDetail">
          <p class="rule-item">
            <el-checkbox v-model="onSitePhotoOnly">
              <span>
                {{ $t('insSettingView.AllowPhotos') }}
              </span>
            </el-checkbox>
          </p>
        </div>
      </setting-table>
    </el-col>
    <el-col :span="24" class="el-rute-content" v-if="mode === 1">
      <setting-table :table-name="$t('insSettingView.inspectionSignature')">
        <div class="setting-config rule-item" slot="tableDetail">
          <el-checkbox v-model="onSiteSignature">
            <span>
              {{ $t('insSettingView.needSignatrue') }}
            </span>
          </el-checkbox>
        </div>
      </setting-table>
    </el-col>

    <el-col :span="24" class="el-rute-content" style="margin-bottom:20px;">
      <setting-table :table-name="$t('insSettingView.btnAttributeValues')">
        <div class="setting-config" slot="tableDetail" >
          <div class="radio-setting-content">
            <div class="btn-title rule-score">{{ $t('insSettingView.passFailAttr') }}</div>
            <div class="attribute-group">
              <div v-for="(btnAttrItem, btnAttrIndex) in itemOptionsForType1">
                <el-radio :label="btnAttrItem.key" :key="btnAttrIndex"
                          v-model="passFailBtnAttr" v-if="btnAttrIndex < btnAttrItem.items.length">
                  {{btnAttrItem.items[0].name}} {{slash}} {{btnAttrItem.items[1].name}}
                </el-radio>
                <div class="input-list" v-else>
                  <el-radio :label="btnAttrItem.key" :key="btnAttrIndex" v-model="passFailBtnAttr">
                    {{ $t('insSettingView.userDefined') }}
                  </el-radio>
                  <template>
                    <validate-input ref="validateInput"
                      :input-limit-length="8"
                      :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                      :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                      :input-name="btnAttrItem.items[0].name"
                      @getInputValue="val => getPassFailBtnName(val, 0)"></validate-input>
                    {{ slash }}
                    <validate-input ref="validateInput"
                      :input-limit-length="8"
                      :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                      :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                      :input-name="btnAttrItem.items[1].name"
                      @getInputValue="val => getPassFailBtnName(val, 1)"></validate-input>
                  </template>
                </div>
              </div>
            </div>
            <div class="radio-setting-content">
              <div class="btn-title rule-score">{{ $t('insSettingView.othersAttr') }}</div>
              <div class="attribute-group">
                <div v-for="(btnAttrItem, btnAttrIndex) in itemOptionsForType3">
                  <el-radio :label="btnAttrItem.key" :key="btnAttrIndex"
                            v-model="otherBtnAttr" v-if="btnAttrIndex < btnAttrItem.items.length">
                    {{btnAttrItem.items[0].name}} {{slash}} {{btnAttrItem.items[1].name}}
                  </el-radio>
                  <div class="input-list" v-else>
                    <el-radio :label="btnAttrItem.key" :key="btnAttrIndex" v-model="otherBtnAttr">
                      {{ $t('insSettingView.userDefined') }}
                    </el-radio>
                    <template>
                      <validate-input ref="validateInput"
                                      :input-limit-length="8"
                                      :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                                      :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                                      :input-name="btnAttrItem.items[0].name"
                                      @getInputValue="val => getOtherBtnName(val, 0)"></validate-input>
                      {{ slash }}
                      <validate-input ref="validateInput"
                                      :input-limit-length="8"
                                      :empty-prompt-msg="$t('insSettingView.enterBtnAttr')"
                                      :out-limit-prompt-msg="$t('insSettingView.btnAttrLength')"
                                      :input-name="btnAttrItem.items[1].name"
                                      @getInputValue="val => getOtherBtnName(val, 1)"></validate-input>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </setting-table>
    </el-col>
  </el-row>
</template>

<script>
import { inpectRESTful } from '@/api/index';
import util from '@/common/util';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import ValidateInput from "../../../components/ValidateInput";

export default {
  name: 'SetRuleInspect',
  components: {ValidateInput, SettingTable, DelayButton },
  data() {
    return {
      hundredMarkType: '',
      minScore: 0,
      maxScore: 100,
      includedInTotalScoreWithType1: false,
      qualifiedForIgnoredWithType1: false,
      qualifiedForIgnoredWithType2: false,
      dangerousOnFailedItem: false,
      onSitePhotoOnly: false,
      lang: this.$i18n.locale,
      ScoreMsg: false,
      inspectId: 0,
      routeName: '',
      mode: 0,
      onSiteSignature: true,
      btnAttribute: 0,
      slash: '/',
      baseScore: 100,
      itemOptionsForType1: {},
      passFailBtnAttr: '',
      itemOptionsForType3: {},
      otherBtnAttr: ''
    }
  },
  mounted() {
    const self = this;
    self.getRule();
  },
  methods: {
    async submitRule() {
      const self = this;
      if( (this.passFailBtnAttr === 'userDefined' && !this.validateUserDefinedPassFailBtnValue())
          || (this.otherBtnAttr === 'userDefined' && !this.validateUserDefinedOtherBtnValue()) ){
        util.notify(this.$t('insSettingView.enterBtnAttr'), 'warning', 3000);
        return false;
      }
      if (!self.ScoreMsg) {
        const params = {
          inspectTagId: self.inspectId,
          ruleItems: [
            { name: 'includedInTotalScoreWithType1', value: self.includedInTotalScoreWithType1 },
            { name: 'qualifiedForIgnoredWithType1', value: self.qualifiedForIgnoredWithType1 },
            { name: 'qualifiedForIgnoredWithType2', value: self.qualifiedForIgnoredWithType2 },
            { name: 'hundredMarkType', value: parseInt(self.hundredMarkType) },
            { name: 'minScore', value: parseFloat(self.minScore) },
            { name: 'maxScore', value: parseFloat(self.maxScore) },
            {name: "baseScore", value: parseFloat(self.baseScore)},
            { name: 'dangerousOnFailedItem', value: self.dangerousOnFailedItem },
            { name: 'onSitePhotoOnly', value: self.onSitePhotoOnly },
            { name: 'onSiteSignature', value: self.onSiteSignature },
            {
              "name": "itemOptionsForType1",
              "value": this.passFailBtnAttr,
              "extra": this.itemOptionsForType1
            },
            {
              "name": "itemOptionsForType3",
              "value": this.otherBtnAttr,
              "extra": this.itemOptionsForType3
            },
          ]
        };
        const res = await self.updateInspectRule(params);
        if (res.errCode === 0) {
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
                self.hundredMarkType = item.value.toString();
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
              case 'onSitePhotoOnly':
                self.onSitePhotoOnly = item.value;
                break;
              case 'onSiteSignature':
                self.onSiteSignature = item.value;
                break;
              case 'baseScore':
                self.baseScore = item.value;
                break;
              case 'itemOptionsForType1':{
                this.itemOptionsForType1 = item.extra;
                this.passFailBtnAttr = item.value;
              }
              case 'itemOptionsForType3': {
                this.itemOptionsForType3 = item.extra;
                this.otherBtnAttr = item.value;
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
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectRuleSettings(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    inputChangeMax(val) {
      const self = this;
      self.maxScore = self.getUtilScore(val);
      self.ScoreMsg = parseFloat(self.minScore) > parseFloat(self.maxScore);
    },
    inputChangeMin(val) {
      const self = this;
      self.minScore = self.getUtilScore(val);
      self.ScoreMsg = parseFloat(self.minScore) > parseFloat(self.maxScore);
    },

    getUtilScore(val){
        val = val.replace(/[^-?\d\.]/g,"");
        val = val.replace(/\.{2,}/g,".");
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace("-","$#$").replace(/\-/g,"").replace("$#$","-");
        val = val.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');
        if(val!=="-0" && !isNaN(val) && val.indexOf(".")< 0 && val!=""){
            val= parseFloat(val);
        }
        return val;
    },
    inputChangeBaseScore(val){
      this.baseScore = this.getUtilScore(val);
    },

    getPassFailBtnName(val, index){
      const length = this.itemOptionsForType1.length;
      this.itemOptionsForType1[length -1].items[index].name = val;
    },

    getOtherBtnName(val, index){
      const length = this.itemOptionsForType3.length;
      this.itemOptionsForType3[length -1].items[index].name = val;
    },

    validateUserDefinedPassFailBtnValue(){
      const length = this.itemOptionsForType1.length;
      return this.itemOptionsForType1[length -1].items[0].name && this.itemOptionsForType1[length -1].items[1].name;
    },

    validateUserDefinedOtherBtnValue(){
      const length = this.itemOptionsForType3.length;
      return this.itemOptionsForType3[length -1].items[0].name && this.itemOptionsForType3[length -1].items[1].name;
    },

  },
  destroyed(){
    sessionStorage.removeItem('ruleData');
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
