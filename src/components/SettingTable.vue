<template>
    <div class="setting-table-container">
      <div class="setting-header">
        {{tableName}}
      </div>
      <div class="setting-content">
        <slot name="tableDetail"></slot>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'SettingTable',
    props: {
      tableName: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped>
  .setting-table-container{
    border: 1px solid #e3e9f4;
    border-radius: 3px;
    /* padding-bottom: 20px; */
  }
  .setting-header{
    font-size: calc(15/1920*100vw);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    color: #2C3E50;
    font-weight: bolder;
    background-color: #eef0f4;
    padding-left: calc(20/1920*100vw);
  }
  .setting-content{
    background-color: #fff;
  }
</style>
