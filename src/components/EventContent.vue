<template>
  <div class="event-content">
    <span class="event-title"
      ><span class="is-required">*</span>{{ $t("remotePatrol.name") }}</span
    >
    <el-input
      v-model="eventName"
      size="mini"
      class="name-input"
      @input="$emit('emitEventNameChanged', eventName)"
      @blur="notShowInputRuleTips('eventName')"
    />
    <span v-if="eventNameRuletip" class="rules" style="margin-left: 0">{{
      $t("remotePatrol.eventNameRuletip")
    }}</span>
    <span v-if="showEventNameInfo" class="error-class">{{
      $t("storeMonitor.emptyTitle")
    }}</span>
    <span class="event-title">{{ $t("remotePatrol.description") }}</span>
    <div v-for="(event,index) in eventList" :key="index" class="flex-center">
      <img
        src="../../static/img/cross.png"
        alt="delete"
        @click="() => handleDeleteEvent(index)"
      />
      <div
        class="paper flex-center margin-bottom-sm inspect-text"
      >
        <div style="flex: 1; text-align: left; margin: 5px">
          {{ event.src }}
        </div>
        <hr class="hr-vertical" />
        <img
          src="../../static/img/pen.png"
          alt="edit"
          style="margin: 5px"
          @click="() => handleEditEvent(index)"
        />
      </div>
    </div>
    <el-input
      :autosize="{ minRows: 4, maxRows: 7 }"
      v-model="eventInput"
      :placeholder="$t('remotePatrol.descPlaceholder')"
      size="mini"
      class="des-input"
      type="textarea"
      resize="none"
      @input="$emit('emitEventDesChanged', eventInput)"
      @blur="notShowInputRuleTips('eventInput')"
    />
    <el-button
      @click="handleSubmitEvent"
    >確認</el-button>
    <span v-if="eventDesRuletip" class="rules" style="margin-left: 0">{{
      $t("remotePatrol.comentRuletip")
    }}</span>
  </div>
</template>

<script>
export default {
  name: "EventContent",
  props: {
    showEventNameInfo: {
      type: Boolean,
      default: false
    },
    eventList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      eventName: "",
      eventInput: "",
      eventNameRuletip: false,
      eventDesRuletip: false,
      editInfo: { index: -1, isEditing: false }
    };
  },
  watch: {},
  methods: {
    notShowInputRuleTips({ e }) {
      if (e == "eventName") {
        this.eventNameRuletip = false;
      } else if (e == "eventInput") {
        this.eventDesRuletip = false;
      }
    },
    handleSubmitEvent () {
      let arr = this.eventList;
      const self = this;
      if (this.editInfo.isEditing) {
        arr = arr.map((item, index) => {
          if (index === self.editInfo.index) {
            return { ...item, src: self.eventInput }
          } else return { ...item }
        })
      } else {
        if (arr.length === 5) return
        arr.push({ mediaType: 3, src: this.eventInput })
      }
      this.$emit('emitUpdateEventList', arr)
      this.eventInput = ''
      this.editInfo = { index: -1, isEditing: false }
    },
    handleEditEvent (index) {
      let arr = this.eventList;
      this.editInfo = { index, isEditing: true }
      this.eventInput = arr[index].src || ''
    },
    handleDeleteEvent (index) {
      let arr = this.eventList;
      arr.push({ mediaType: 3, src: this.eventInput })
      this.$emit('emitUpdateEventList', arr)
      this.eventInput = ''
    }
  },
};
</script>

<style scoped>
</style>
