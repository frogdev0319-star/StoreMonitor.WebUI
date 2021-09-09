<template>
  <div class="stores-container">
    <span class="choice-store">
      <i
        class="iconfont icon-tishi1"
        @mouseover="showStoreInfo = !showStoreInfo"/>
      {{ $t('remotePatrol.selected') }}
      <span class="storename-str">{{ storeStr }}</span>
    </span>
    <div v-if="showStoreInfo" class="store-selected">
      <h1>{{ $t('remotePatrol.selected') }}</h1>
      <ul v-show="storeStr.length > 0" class="store-list">
        <li
          v-for="(item,index) in storeStr.split('，')"
          :key="index"
          class="store-item">
          - {{ item }}
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
export default {
  name: 'SelectedStores',
  props: {
    storeStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showStoreInfo: false
    }
  }
};
</script>

<style lang="scss" scoped>
  .stores-container {
    text-align: left;
    padding-left: calc(30 / 1920 * 100vw);
    padding-right: calc(30 / 1920 * 100vw);
    height: 20px;
    line-height: 20px;
    margin-bottom: 15px;
    span {
      font-size: calc(14 / 1920 * 100vw);
      margin-right: calc(20 / 1920 * 100vw);
      margin-left: calc(20 / 1920 * 100vw);
    }
    .choice-store {
      color: #7d8cad;
      white-space: nowrap;
      overflow: hidden;
      width: 90%;
      display: inline-block;
      i {
        margin-right: calc(15 / 1920 * 100vw);
        font-size: calc(16 / 1920 * 100vw);
      }
      .storename-str{
        margin-left: calc(20 / 1920 * 100vw);
      }
    }
    .store-selected {
      top: unset;
      background-color: rgba(30, 34, 52, 0.75);
      position: absolute;
      max-height: 400px;
      overflow-y: scroll;
      z-index: 1;
      padding: 20px;
      min-width: 200px;
      border-radius: 10px;
      left: calc(80 / 1920 * 100vw);
      h1 {
        white-space: nowrap;
        font-size: 18px;
        margin: 0;
        font-family: Roboto, "Microsoft YaHei", "Microsoft JhengHei", SimHei, Arial;
        color: #fff;
        font-weight: 500;
        line-height: 1.1;
      }
      .store-list {
        margin-top: 10px;
        margin-left: 10px;
        padding: 0;
        .store-item {
          white-space: nowrap;
          font-size: 14px;
          margin: 0;
          list-style-type: none;
          color: #fff;
        }
      }
    }
  }
</style>
