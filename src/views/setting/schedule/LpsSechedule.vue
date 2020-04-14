<template>
  <div>
    <el-button>
      <div class="box">
        <i class="iconfont icon-gengduo " style="cursor: pointer; margin-right: 20px"></i>
        <div class="text">垂直居中</div>
      </div>
    </el-button>
<!--    <button>
      <div class="box">
        <i class="iconfont icon-gengduo " style="cursor: pointer; margin-right: 20px"></i>
        <span class="text">垂直居中2</span>
      </div>
    </button>-->
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
    padding: 0 0;
    position: relative;
    padding: 0 calc(6 / 1920 * 100vw);
    height: calc(40 / 1920 * 100vw);
    width: calc(130 / 1920 * 100vw);
  }
  .iconfont{
    position: absolute;
    top: 0;
    margin: calc(8 / 1920 * 100vw);
    height: calc(24 / 1920 * 100vw);
    width: calc(24 / 1920 * 100vw);
  }
  .text{
    position: absolute;
    top: 0;
    left: calc(52 / 1920 * 100vw);
    display: inline-block;
  }
</style>
