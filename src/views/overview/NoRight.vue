<template>
  <div class="page-container">
    <img :src="errorImgSource" class="error-img">
    <div class="error-text">
      {{ $t('route.noInspectionAccessRights') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  data() {
    return {
      errorImgSource: require('../../../static/img/icon_error.png')
    }
  }
};
</script>

<style scoped>
  .page-container{
    height: calc(100vh - 80px - 105px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .error-img{
    height: 36px;
    width: 36px;
  }
  .error-text{
    padding-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #424151;
  }
</style>
