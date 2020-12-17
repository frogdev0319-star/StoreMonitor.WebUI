<template>
  <el-row class="el-setRule">
    <el-col :span="24" class="el-rute-title">
      <span class="tab-name">【{{ $route.params.routeName }}】{{ $t('insSettingView.ruleInspect') }}</span>
      <div style="float:right;">
        <el-button size="mini" type="primary" class="btn-class" @click="submitRule">
          {{ $t('titleView.save') }}
        </el-button>
      </div>
    </el-col>
    <el-col :span="24" class="el-rute-content">
      <p class="rule-title">{{ $t('insSettingView.PatrolScoreCalculation') }}</p>
      <p class="rule-item"><el-checkbox v-model="checkItem1">{{ $t('insSettingView.PSCrule1') }}Tab1
        （{{ $t('insSettingView.sheetpassfail') }}）{{ $t('insSettingView.PSCrule2') }}</el-checkbox></p>
      <p class="rule-item"><el-checkbox v-model="checkItem2"><span v-if="lang==='en'">{{ $t('insSettingView.PSCrule3') }}</span> Tab1（{{ $t('insSettingView.sheetpassfail') }}）<span v-if="lang!=='en'">{{ $t('insSettingView.PSCrule3') }}</span></el-checkbox></p>
      <p class="rule-item"><el-checkbox v-model="checkItem3"><span v-if="lang==='en'">{{ $t('insSettingView.PSCrule3') }}</span> Tab2（{{ $t('insSettingView.sheetscore') }}）<span v-if="lang!=='en'">{{ $t('insSettingView.PSCrule3') }}</span> </el-checkbox></p>
      <p class="rule-score">{{ $t('insSettingView.CalculationMethod') }}：</p>
      <p class="rule-item">
        <el-radio v-model="radio" label="0" class="radio">{{ $t('insSettingView.Proportional') }}</el-radio>
        <el-tooltip
          class="item"
          effect="dark"
          placement="bottom-end">
          <div slot="content">{{ $t('insSettingView.ProportionalDes') }}</div>
          <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>
        </el-tooltip>
        <el-radio v-model="radio" label="-1" class="radio" style="margin-left: calc(40/1920*100vw);">{{ $t('insSettingView.totalScore') }}</el-radio>
        <el-tooltip
          class="item"
          effect="dark"
          placement="bottom-end">
          <div slot="content">{{ $t('insSettingView.totalScoreDes') }}</div>
          <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;"/>
        </el-tooltip>
      </p>
      <p class="rule-item">
        <span class="rangeScore">{{ $t('insSettingView.totalScorRange') }}：</span>
        <el-input :placeholder="$t('insSettingView.setMinScore')" v-model="minScore" class="input" @input="inputChangeMin"/>
        <span class="input-text">{{ $t('remotePatrol.scorecount') }}~</span>
        <el-input :placeholder="$t('insSettingView.setMaxScore')" v-model="maxScore" class="input" @input="inputChangeMax"/>
        <span class="input-text">{{ $t('remotePatrol.scorecount') }}</span>
        <span v-if="ScoreMsg" class="score_msg">*{{$t('insSettingView.rangeScoreTips')}}</span>
      </p>
    </el-col>
    <el-col :span="24" class="el-rute-content">
      <p class="rule-title">{{ $t('insSettingView.isCheckSuggest') }}</p>
      <p class="rule-item">
        <el-checkbox v-model="checkItem4">
          <span v-if="lang!=='en'">Tab1（{{ $t('insSettingView.sheetpassfail') }}）{{ $t('insSettingView.patrolSuggest') }}</span>
          <span v-else>When there are unqualified items in Tab1 ({{ $t('insSettingView.sheetpassfail') }}), the inspection result is: Dangerous.</span>
        </el-checkbox>
      </p>
    </el-col>
  </el-row>
</template>

<script>
import { inpectRESTful } from '@/api/index';

export default {
  name: 'SetRuleInspect',
  data() {
    return {
      radio: '',
      minScore: 0,
      maxScore: 100,
      checkItem1: false,
      checkItem2: false,
      checkItem3: false,
      checkItem4: false,
      routeData: this.$route.params.routeData,
      lang: this.$i18n.locale,
      ScoreMsg: false
    };
  },
  mounted() {
    const self = this;
    self.getRule();
  },
  methods: {
    async submitRule() {
      const self = this;
      if(!self.ScoreMsg){
        const params = {
          inspectTagId: self.routeData[0].inspectId,
          ruleItems: [
            { name: 'includedInTotalScoreWithType1', value: self.checkItem1 },
            { name: 'qualifiedForIgnoredWithType1', value: self.checkItem2 },
            { name: 'qualifiedForIgnoredWithType2', value: self.checkItem3 },
            { name: 'hundredMarkType', value: parseInt(self.radio) },
            { name: 'minScore', value: parseInt(self.minScore) },
            { name: 'maxScore', value: parseInt(self.maxScore) },
            { name: 'dangerousOnFailedItem', value: self.checkItem4 }
          ]
        };
        const res = await self.updateInspectRule(params);
        if (res.errCode === 0) {
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          return false;
        } else {
          self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          return false;
        }
      }
    },
    async getRule() {
      const self = this;
      const params = { inspectId: self.routeData[0].inspectId };
      try {
        const res = await self.getInspectRule(params);
        if (res.errCode === 0) {
          res.data.forEach(item => {
            switch (item.name) {
              case 'includedInTotalScoreWithType1':
                self.checkItem1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType1':
                self.checkItem2 = item.value;
                break;
              case 'qualifiedForIgnoredWithType2':
                self.checkItem3 = item.value;
                break;
              case 'hundredMarkType':
                self.radio = item.value.toString();
                break;
              case 'minScore':
                self.minScore = item.value;
                break;
              case 'maxScore':
                self.maxScore = item.value;
                break;
              case 'dangerousOnFailedItem':
                self.checkItem4 = item.value;
                break;
              default:
                break;
            }
          });
        }
      }
      catch (err) {
        console.log("SetInspectRule-getRule: " + err);
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
      if (val.indexOf('-') !== -1) {
        self.maxScore = '-' + val.replace(/[^\d]/g, '');
      } else {
        self.maxScore = val.replace(/[^\d]/g, '');
      }
      self.ScoreMsg = parseInt(self.minScore)>parseInt(self.maxScore);
    },
    inputChangeMin(val) {
      const self = this;
      if (val.indexOf('-') !== -1) {
        self.minScore = '-' + val.replace(/[^\d]/g, '');
      } else {
        self.minScore = val.replace(/[^\d]/g, '');
      }
      self.ScoreMsg = parseInt(self.minScore)>parseInt(self.maxScore);
    },
    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }
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
        .btn-class{
            border-color: $red;
            height: calc(36/1920*100vw);
            padding: 0;
            font-size: calc(14/1920*100vw);
            width: calc(130/1920*100vw);
            @media screen and (max-width: 1440px) {
                width: 100px;
            }
            .btn-area{
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .el-rute-content{
        margin-top: 20px;
        padding-bottom: 20px;
        border: 1px solid #e3e9f4;
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
                /deep/ .el-radio__label{
                    margin-left: calc(30/1920*100vw);
                    padding:0;
                    color:#424151;
                }
            }
            /deep/ .el-checkbox__label{
                padding-left: calc(30/1920*100vw);
            }
            /deep/ .el-checkbox__label{
                color:#424151;
            }
        }
    }
}
</style>
