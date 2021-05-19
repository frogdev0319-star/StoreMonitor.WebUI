<template>
  <div class="names">
    <div v-for="(item,index) in nameList"
         class="template-name"
         :class="{'active-name-btn' : curTemplateIndex === index}"
         :key="index"
         @click="onClickBtn(index)">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ButtonList',
    props:{
      nameList: {
        type: Array,
        default: []
      },
      curTemplateIndex: {
        type: Number,
        default: 0
      }
    },
    methods:{
      onClickBtn(index){
        this.$emit('click', index)
      }
    }
  };


</script>

<style scoped>
  .names{
    display: flex;
  }
  .template-name{
    cursor: pointer;
    width: 90px;
    height: 30px;
    line-height: 30px;
    color: #7d8cad;
    padding: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 3px;
    margin-right: calc(30/1920*100vw);
  }
  .active-name-btn{
    color: #fff;
    background-color: #f31d65;
  }
</style>
