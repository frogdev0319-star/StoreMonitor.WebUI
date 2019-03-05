<template>
    <div id="sample">
        <div style="width:530px;height:380px;margin:0 auto;">
            <div class="dialog-content" style="overflow:hidden;">
                <video  height=83% width=90% id="previewVideo" prload autoplay controls
                    class="video-js vjs-fill" style="postion:absoulte;top:10px;">
                </video>
            </div>
            <div  class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showCutContent" size="mini" style="">截 图</el-button>
                <el-button class="file-confirm-btn" type="primary" @click="realTime" size="mini">播 放</el-button>
            </div>
        </div>
        <el-dialog title='编辑截图'
        :visible.sync="dialogFormVisible" :close-on-click-modal="false" v-if="dialogFormVisible" width=550px height=300px top=15%>
            <div class="canvas-content">
                <div class='model'>
                    <div class='icon-right'>
                        <div class="content" v-for="(item,index) in penList" :key="index">
                            <div :class="{colorActive:item.showContent}"></div>
                            <div class="color" :id="item.id" @click="checkPen(item,index)"></div>
                        </div>
                    </div>
                </div>
                <canvas id="icanvas"  width="480" height="270" @mousedown="mouseDownAction($event)" @mousemove="mouseMoveAction($event)"></canvas>
            </div>
            <div slot="footer">
                <el-button class="file-cancel-btn" @click="confrimEdit" size="mini" style="">确 认</el-button>
                <el-button class="file-cancel-btn" @click="dialogFormVisible = false" size="mini" style="">取 消</el-button>
            </div>
        </el-dialog>

        <input type="file" accept="image/*" name="file_head" class="uploadLogoImg" @change="uploadImgLogo($event)"/>
        <el-button class="file-cancel-btn" @click="confirmUpLoad" size="mini" style="">上传至阿里云</el-button>
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
    .dialog-footer{
        margin-top: 30px;
        
    }
    .canvas-content{
        position: relative;
    }
    .model{
        width: 100%;
        height: 100%;
        background-color: transparent;
        position: absolute;
        z-index: 2;
        pointer-events: none;
    }
    .icon-right{
        width: 100px;
        height: 30%;
        position: absolute;
        right: 30px;
        top: 15%;
    }
    .content{
        width: 100%;
        height: 30%;
        position: relative;
    }
    .color{
        width: 16px;
        height: 16px;
        border-radius: 8px;
        position: absolute;
        margin: auto 0;
        top: 4px;
        left: 20%;
        margin-left: 4px;
        z-index: 3;
        cursor: pointer;
    }
    .colorActive{
        background-color: #ddd;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        position: absolute;
        margin: auto 0;
        left: 20%;
        z-index: 3;
    }
    #white{
        background-color: white;
    }   
    #yellow{
        background-color: yellow;
    }
    #red{
        background-color: red;
    }
    
</style>
<style>
/* .el-dialog__body{
    padding: 0px;
}
.el-dialog__title{
    font-size: 16px !important;
    float: left;
    margin-bottom: 15px;
    margin-left: 15px;
} */
</style>

<script>
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
import 'videojs-contrib-hls';
import util from '@/common/util'
import $ from 'jquery';
import {addEvent,getStorageInfo,getEventList} from '@/api/event'
import OSS from 'ali-oss'
  export default {
    data() {
      return {
        file:'',
        src:'',
        protocal:'DASH',
        selGID:0,
        mpdurl:'',
        videoEl:'',
        canvasEl:'',
        dialogFormVisible:false,
        penList:[
            {
                id:'white',
                showContent:true
            },
            {
                id:'yellow',
                showContent:false
            },
            {
                id:'red',
                showContent:false
            }
        ],
        penChecked:'',
        showModel:true,
        X:0,Y:0,X1:0,Y1:0,
        isMouseDown:false,
        flag:0,
        imgDataUrl:'',
        oss:null,
        percentage:0,
        accountId:'aaoompqqpjy4',
        bucketImage:'',
        fileImg:'',
      };
    },
    methods: {
       //当选择完成图片之后调用
        uploadImgLogo(event){
            let _this = this;
        
            //1. 拿到fileinput里面的文件, 这个file是一个file对象， file对象不能直接展示的
            var file = event.target.files[0];
            this.fileImg = file;
            // console.log(file);
        
            //2. 读取文件，成功img标签可以直接使用的格式
            //FileReader类就是专门用来读文件的
            var reader = new FileReader();
        
            //3. 开始读文件
            //readAsDataURL: dataurl它的本质就是图片的二进制数据， 进行base64加密后形成的一个字符串， 这个字符串可以直接作用img标签的图片资源使用
            reader.readAsDataURL(file);
        
            //4. 因为文件读取是一个耗时操作， 所以它在回调函数中，才能够拿到读取的结果
            reader.onload = function() {
                // console.log(reader.result);
                //直接使用读取的结果
                _this.imgDataUrl = reader.result;
                _this.isUpImg = "1";
            }
            // this.imgDataUrl = file;
        },
        getUpLoadBucketInfo(){
            let self=this;
            self.bucketVideo='video'+'/'+util.getCurDate2Str();
            self.bucketImage='image'+'/'+util.getCurDate2Str();
        },
        getOssInfo(){
            let self=this;
            getStorageInfo().then(res=>{
                console.log(res);
                if(res.errCode==0){
                    self.oss=res.data;
                }
            })
        },
        getFileUrl(fileName){
            let self=this;
            let bucketName=self.accountId;
            let endpoint=self.oss.ossEndPoint;
            let key=fileName;
            let url=`http://${bucketName}.${endpoint}/${fileName}`;
            return url;
        },
        confirmUpLoad(){
            let self=this;
            let file=util.base64ToBlob(self.imgDataUrl);
            //let file=self.fileImg;
            let fileName='image'+'/'+util.getCurDate2Str()+'/'+'event'+'_'+util.getCurTimeStr()+'_'+'0038932'+'_'+'27'+'.jpg';
            var OSS = require('ali-oss');
            // const client =new OSS({
            //     region:'oss-cn-beijing',
            //     accessKeyId: 'LTAIV0ioFb79T9p4',//填入自己的id
            //     accessKeySecret: '0K7AXad9Z0vzNoQJL1kWiC04dLcejR',//填入自己的id
            //     bucket: self.accountId
            // })
            const client = new OSS({
                region: self.oss.ossEndPoint.slice(0,self.oss.ossEndPoint.indexOf('.')),
                accessKeyId: self.oss.ossAccessKeyId,//填入自己的id
                accessKeySecret: self.oss.ossAccessKeySecret,//填入自己的id
                bucket: self.accountId
            })
            client.put(fileName,file,{
            progress: function* (percentage, cpt) {
                self.percentage = percentage
                }
            })
            .then((results) => {
                // 上传完成
                const url = self.getFileUrl(results.name);
                console.log(url);
                resolve(url); 
            })
            .catch((err) => {
                console.log(err)
            }) 
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
        showCutContent(){
            let self=this;
            self.dialogFormVisible=true;
            this.$nextTick(()=>{
                self.canvasEl=document.getElementById('icanvas');
                var ctx = self.canvasEl.getContext('2d');
                var width=self.videoEl.videoWidth;
                var height=self.videoEl.videoHeight;
                self.canvasEl.width=width/4;
                self.canvasEl.height=height/4;
                ctx.drawImage(self.videoEl,0,0,width/4,height/4);
                var oGrayImg=icanvas.toDataURL('image/png');
            })
            
        },
        checkPen(item,index){
            let self=this;
            item.showContent=true;
            self.penList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.showContent=false;
                }
            })
            self.penChecked=item.id;
        },
        confrimEdit(){
            let self=this;
            
        },
        mouseDownAction(e){
           let self=this;
           self.isMouseDown=true;
           self.X=e.offsetX;
           self.Y=e.offsetY;
        },
        mouseMoveAction(e){
            let self=this;
            if(self.isMouseDown){
                self.X1=e.offsetX;
                self.Y1=e.offsetY;
                self.drawLine(self.X,self.Y,self.X1,self.Y1);
                self.flag++;
            }
        },
        mouseUpAction(e){
            let self=this;
            self.isMouseDown=false;
            self.flag=0;
        },
        drawLine(x,y,x1,y1){
            let self=this;
            var ctx=self.canvasEl.getContext('2d');
            if(self.flag){
                ctx.beginPath();
            }
            ctx.moveTo(x,y);
            ctx.lineWidth=4;
            ctx.strokeStyle=self.penChecked;
            ctx.lineTo(x1,y1);
            ctx.stroke();
            if(self.flag!=0){
                self.X=self.X1;
                self.Y=self.Y1;
            }
        }
    },
    mounted(){
        let self=this;
        self.getOssInfo();
        self.getUpLoadBucketInfo();
        self.videoEl=document.getElementById('previewVideo');
        document.onmouseup=self.mouseUpAction;
    }
  }
</script>
<style scoped>
</style>
