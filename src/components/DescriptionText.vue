<template>
  <div class="description-container">
    <div v-for="(text, index) in discriptionList" :key="`${text}-${index}`" class="description-content">
      <span class="item-circle"></span>
      <span class="pdf_font_24">{{ text.description }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DescriptionText',
  props: {
    discriptionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  .description-container{
    margin-top: 10px;
  }
  .description-content{
    font-weight: bold;
    color: #7d8cad;
    font-size: calc(14 / 1920 * 100vw);
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .item-circle{
    height: 6px;
    width: 6px;
    border-radius: 6px;
    background-color: #7d8cad;
    margin: 0 calc(5/1920*100vw) 0 0;
    display: inline-block;
  }
  .content-detail-main {
    padding-top: 10px;
    padding-left: calc(20 / 1920 * 100vw);
    padding-right: calc(20 / 1920 * 100vw);

    .cdm-title {
      font-size: calc(12 / 1920 * 100vw);
      color: #7d8cad;
      font-weight: bold;
      margin: 0;
    }

    .cdm-word{
      margin-top: 10px;
      font-size: calc(14 / 1920 * 100vw);
      color:#4b5262;
    }
  }
</style>
