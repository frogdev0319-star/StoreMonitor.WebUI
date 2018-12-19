<template>
    <div id="sample">
        <!--accept定义接收的文件类型,这里只接受图片-->
        <!-- <input id="fileinput" @change="uploading($event)" type="file" accept="image/*">
        <button  @click="submit($event)">点击上传</button> -->
        <span>总览</span>
     </div>

</template>
<script>
  export default {
    data() {
      return {
         file:'',
         src:''
      };
    },
    methods: {
       uploading(event){
            this.file=event.target.files[0]; //获取文件
            var windowURL=window.URL||window.webkitURL;
            this.file = event.target.files[0];
            //创建图片文件的url
            this.src = windowURL.createObjectURL(event.target.files[0]);
       },
       submit(){
           event.preventDefault(); //取消默认行为
           let formdata=new FormData();
           formdata.append('file',this.file);
           formdata.append('filename','001.png');
           console.log(formdata);
       }
    }
  }
</script>