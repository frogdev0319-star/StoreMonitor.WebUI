<template>
    <div class="btn-content">
        <canvas id="graph-canvas" :width="btnWidth"></canvas>
    </div>
</template>
<script>
export default {
    name:'GetVideoBtn',
    data(){
        return{
            videoSpeedId:0,
            videoSpeed:0,
        }
    },
    props:{
        btnWidth:String
    },
    methods:{
        drawMain(drawing_elem, percent, forecolor, bgcolor) {
            /*
                @drawing_elem: 绘制对象
                @percent：绘制圆环百分比, 范围[0, 100]
                @forecolor: 绘制圆环的前景色，颜色代码
                @bgcolor: 绘制圆环的背景色，颜色代码
            */
            let self=this;
            var context = drawing_elem.getContext("2d");
            var center_x = drawing_elem.width / 2;
            var center_y = drawing_elem.height / 2;
            var rad = Math.PI*2/100; 
            
            
            // 绘制背景圆圈
            function backgroundCircle(){
                context.beginPath();
                context.lineWidth = 14; //设置线宽
                var radius = center_x - context.lineWidth;
                context.arc(center_x, center_y, radius, 0, Math.PI*2, false);
                context.fillStyle=bgcolor;
                context.globalAlpha = 0.5;
                context.fill();
            }
            //绘制运动圆环
            function foregroundCircle(n){
                context.save();
                context.strokeStyle = forecolor;
                context.globalAlpha = 1;
                context.lineWidth = 6;
                context.lineCap = "round";
                var radius = center_x - context.lineWidth;
                context.beginPath();
                context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
                context.stroke();
                context.closePath();
                context.restore();
            }
 
            //绘制文字
            function text(n){
                context.save();
                context.fillStyle='white';
                context.globalAlpha = 1;
                var font_size=self.btnFontSize;
                context.font='bold '+font_size+'px Helvetica';
                var textStr='';
                if(n==100){
                    textStr='录制成功';
                }
                else{
                    textStr='正在录制';
                }
                var text_width = context.measureText(textStr).width;
                context.fillText(textStr,center_x-text_width/2,center_y+font_size/2);
                context.restore();
            }
            //执行动画
            function drawFrame(speed){
                context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
                backgroundCircle();
                text(speed);
                foregroundCircle(speed);
                if(speed>=percent){
                    clearInterval(self.videoSpeedId);
                }
            }
            self.videoSpeedId=setInterval(() => {
                if(self.videoSpeed >= percent){
                    return;
                }
                else{
                    self.videoSpeed += 2;
                    drawFrame(self.videoSpeed);
                }
            }, 100);
        },
        mounted() {
            let self=this;
            var btn_canvas = document.getElementById("graph-canvas");
            self.drawMain(btn_canvas, 100, "#f31d65", "#f31d65");
        },
    }
}
</script>
<style>
    .btn-content{
        padding: 15px;
        display: flex;
        display:-webkit-flex;
	    justify-content: center;
	    align-items: center;
    }
    #graph-canvas{
        width: 80px;
        height: 80px;
    }
</style>
