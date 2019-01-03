<template>
    <div id="sample">
        <span>总览</span>
        <button @click="dialogFormVisible=true" class="btn">播放</button>
            <el-dialog :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width=550px height=380px top=15%>
                <div class="dialog-content" style="overflow:hidden;">
                    <video  height=83% width=90% id="previewVideo" prload autoplay controls
                        class="video-js vjs-fill" style="postion:absoulte;top:10px;">
                    </video>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button class="file-cancel-btn" @click="dialogFormVisible = false" size="mini" style="">暂 停</el-button>
                    <el-button class="file-confirm-btn" type="primary" @click="realTime" size="mini">播 放</el-button>
                </div>
            </el-dialog>
     </div>

</template>
<style scoped>
    .dialog-content{
        width:98%;
        height:98%;
        margin: auto;
    }
    #previewVideo{
        min-width: 500px;
        min-height: 320px;
    }
</style>

<script>
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
import 'videojs-contrib-hls';
  export default {
    data() {
      return {
          dialogFormVisible:false,
         file:'',
         src:'',
        //  downLoadSrc:'http://172.21.81.160:8085/storemonitor/api/v1.0/inspect/template',
         protocal:'DASH',
          selGID:0,
          mpdurl:'',
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
       },
       async playVideo(url) {
            console.log('playvideo enter!');
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },
        async realTime(){
            let self=this;
            console.log('实时播放');
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            let result=await dashAPI.Enum(sessionId);
            let ivsID=result.IVSPlatform[0].ID;
            const data = {
                request: { 
                  method: 'connection',
                  sessionID: sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:ivsID,
                  channel:JSON.stringify(this.selGID+1)
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if (self.mpdurl != "" ) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }
        },
    }
  }
</script>
<style scoped>
</style>
