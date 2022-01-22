<template>
  <div>
    <div class="fullWidth flex-center margin-bottom-mini">
      <span
        :class="!item.manualIgnore ? 'noraml-title' : 'ignore-title'"
        :style="item.checked ? { 'font-weight': 'bold' } : {}"
        :title="`${index + 1}. ${item.subject}`"
        class="spacer"
        @click="$emit('emitClickItem', { item, index })"
      >
        {{ `${index + 1}. ${item.subject}` }}
      </span>
      <div v-if="item.itemType === 0">
        <div
          v-if="item.groupType !== 1"
          :class="!item.manualIgnore ? 'noraml-title' : 'ignore-title'"
          class="scores flex-center"
        >
          <div
            v-for="(itemDS, indexDs) in item.scoreList"
            :key="indexDs"
            :style="{'cursor':item.disabled?'not-allowed':'pointer'}"
            class="score"
            :class="{ 'score-active': itemDS.isClick }"
            @click="item.disabled?() => false:$emit('emitCheckScore', { item, itemDS, e: 0 })"
          >
            {{ itemDS.scoreTitle }}
          </div>
        </div>
        <el-select
          v-else
          :value="item.itemScoreTitle"
          class="inspection-select"
          size="mini"
          :disabled="item.disabled"
        >
          <el-option
            v-for="itemDS in item.itemScoreLength"
            :key="itemDS"
            :label="itemDS"
            :value="itemDS"
            @click.native="$emit('emitCheckScore', { item, itemDS, e: 1 })"
          />
        </el-select>
        <span
          class="font-size-sm"
          v-if="!item.manualIgnore"
          @click="$emit('emitIgnoreItem', { item, index, e: 0 })"
          >{{$t('remotePatrol.ignore')}}</span
        >
        <span
          class="font-size-sm"
          v-if="item.manualIgnore"
          @click="$emit('emitCancleIgnoreItem', { item, index })"
          >{{$t('titleView.cancel')}}</span
        >
      </div>
      <div v-if="item.checked" class="icon-clicked" />
    </div>
    <div
      :class="!item.manualIgnore ? 'noraml-title' : 'ignore-title'"
      class="description margin-bottom-mini"
    >
      {{ item.description }}
    </div>
    <div
      class="font-size-sm flex-center margin-bottom-top-sm"
      style="color: #006ab7"
    >
      {{ $t("remotePatrol.failedRecord") + item.lastUnqualifiedNumber }}
    </div>
    <div
      v-if="item.sourceList.length != 0"
      :class="!item.manualIgnore ? 'noraml-title' : 'ignore-title'"
      class="source-content"
    >
      <div
        v-for="(_item, _index) in item.sourceList"
        :key="_index"
        class="source-details"
      >
        <div v-if="_item.mediaType == 2" class="img-content">
          <i
            class="el-icon-close icondelete"
            @click="$emit('emitDeleteImg', { item, index: _index })"
          />
          <el-image
            :src="_item.src"
            :style="{ width: _item.width, height: _item.height }"
            :preview-src-list="
              $emit('emitGetImgList', {
                index: _index,
                sourceList: item.sourceList,
              })
            "
          />
        </div>
        <div v-if="_item.mediaType == 1" class="img-content">
          <i
            class="el-icon-close icondelete"
            @click="$emit('emitDeleteImg', { item, index: _index })"
          />
          <img
            :src="startIcon"
            :height="36"
            class="start-icon"
            @click="playCutVideo(_item, _index)"
          />
          <img :src="videoImgSrc" :height="_item.height" class="imgLittle" />
        </div>
        <div v-if="_item.mediaType == 3" class="flex-center">
          <img
            src="../../static/img/cross.png"
            alt="delete"
            @click="$emit('emitDeleteItemResource', { item, index: _index })"
          />
          <div
            class="paper flex-center margin-bottom-sm"
            style="padding: 5px; flex: 1; margin-left: 20px"
          >
            <div style="flex: 1; text-align: left; margin: 5px">
              {{ _item.src }}
            </div>
            <hr class="hr-vertical" />
            <img
              src="../../static/img/pen.png"
              alt="edit"
              style="margin: 5px"
              @click="$emit('emitEditItemResource', { item, index: _index })"
            />
          </div>
        </div>
      </div>
    </div>
    <div style="position: relative">
      <el-input
        :autosize="{ minRows: 2, maxRows: 7 }"
        v-model="item.inspectInput"
        :placeholder="$t('remotePatrol.coment')"
        :disabled="item.disabled"
        size="mini"
        class="storevue-textarea"
        type="textarea"
        resize="none"
        @input="(val) => $emit('emitItemDescriptionChanged', { val, item })"
        @blur="$emit('emitNotShowInputRuleTips', { e: 'item', item })"
      />
      <button
        class="button"
        :disabled="item.disabled"
        @click="$emit('emitSubmitItemComment', { item })"
      >
        確認
      </button>
    </div>
    <span v-if="item.Ruletip" class="rules">{{
      $t("remotePatrol.comentRuletip")
    }}</span>
  </div>
</template>

<script>
export default {
  name: "InspectionItem",
  props: {
    item: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
};
</script>

<style scoped>
.description {
  font-size: 12px;
  color: #85898e;
}
.button {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 8px;
  background-color: #fff;
  border: solid 1px #e6e6e6;
  color: #556679;
  border-radius: 3px;
}
.scores {
  display: inline-flex;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
}
.score {
  font-size: 12px;
  padding: 2px 5px;
  border: 1px solid #fff;
}
.score-active {
  color: #006ab7;
  background-color: #f7f9fa;
  border: 1px solid #f7f9fa;
}
.item-score {
  box-sizing: border-box;
  font-size: 12px;  
  width: 89px;
  height: 26px;
  line-height: 26px;
  background-color: #edf8f9;
  cursor: pointer;
  padding: 0 5px;
  border-radius: 3px;
}
</style>
