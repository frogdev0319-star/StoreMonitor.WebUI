<template>
  <div>
    <el-button>
      <div class="box">
        <i class="iconfont icon-gengduo " style="cursor: pointer; margin-right: 20px"></i>
        <span class="text">垂直居中</span>
      </div>
    </el-button>
    <button>
      <div class="box">
        <i class="iconfont icon-gengduo " style="cursor: pointer; margin-right: 20px"></i>
        <span class="text">垂直居中2</span>
      </div>
    </button>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        isCollapse: true
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>
  .box{
    font-size: calc(14/1920*100vw);
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    padding: 0 0;
    width: calc(160/1920*100vw);
  }
  .iconfont{ font-size: calc(24/1920*100vw)}
  .text{
    font-size: calc(14/1920*100vw);
  }
</style>
