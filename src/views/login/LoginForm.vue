<template>
  <el-row :style="{'min-height':varyWindowHeight}" class="login-container">
    <el-col
      :span="16"
      :style="{'min-height':varyWindowHeight}"
      class="lside">
      <div class="model">
        <img :src="logoSrc" alt="logo" class="logo">
        <div class="title-content">
          <img id="img1" :src="picSrc1" alt="pic1">
          <span class="pic-info">{{ picInfox }}</span>
          <span class="pic-info">{{ picInfoy }}</span>
          <img id="img2" :src="picSrc2" alt="pic2">
        </div>
      </div>
      <div id="list" :style="{'width':divWidth,'left':divLeft,'height':varyWindowHeight}">
        <img
          v-for="(item,index) in imgList"
          :key="index"
          :style="{'width':varyWindowWidth,'height':varyWindowHeight}"
          :src="item.src"
          :alt="item.alt">
      </div>
      <div id="buttons">
        <span index="1" class="on"/>
        <span index="2"/>
        <span index="3"/>
        <span index="4"/>
      </div>
      <div id="footer">
        <span class="a-href" @click="hrefToWebiste">{{ jumpTitle }}</span>
        <span class="copyright">{{ copyright }}</span>
      </div>
    </el-col>
    <el-col :span="8" :style="{'min-height':varyWindowHeight}" class="rside">
      <div class="login-title-content">
        <span class="login-title">登录</span>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left">
        <el-form-item prop="username">
          <span class="svg-container">
            <i class="iconfont icon-yonghu icons"/>
          </span>
          <el-input
            v-model="loginForm.username"
            :placeholder="login.username"
            class="el-login-input"
            name="usernmae"
            size="small"
            type="text"
            auto-complete="on"/>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="iconfont icon-suo icons"/>
          </span>
          <el-input
            :type="passwordType"
            v-model="loginForm.password"
            :placeholder="login.password"
            class="el-login-input"
            name="password"
            size="small"
            auto-complete="on"
            @keyup.enter.native="handleLogin"/>
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType=='password'?'icon-xianshi':'icon-yincangcopy'" class="iconfont icons"/>
          </span>
        </el-form-item>
        <div class="rem-content">
          <el-checkbox v-model="rememberUserName" class="elCheckBox"/>
          <span>记住账号</span>
          <span class="forget-pass" @click="forgetPass">忘记密码？</span>
        </div>
        <div class="el-il8">
          <el-select v-model="curIl8" size="small" class="el-il8List">
            <el-option
              v-for="item in il8List"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          class="login-btn"
          size="small"
          @click.native.prevent="handleLogin">{{ login.loginBtnTitle }}</el-button>
      </el-form>
      <div class="icon-app">
        <img :src="imgSrc.androidSrc">
        <img :src="imgSrc.iosSrc">
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { Message } from 'element-ui';
import { getCookie, setCookie, removeCookie } from '@/common/auth';
import PermissionHelper from '../../api/PermissionHelper';
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('Please enter the correct user name'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits!'));
      } else {
        callback();
      }
    };
    return {

      login: {
        username: 'username',
        password: 'password',
        loginBtnTitle: '登录'
      },
      logoSrc: './static/img/imgLogin/storevue_logo.png',
      imgList: [
        {
          name: '04pic',
          src: './static/img/imgLogin/carousel.jpg',
          alt: '背景图片04'
        },
        {
          name: '01pic',
          src: './static/img/imgLogin/carousel.jpg',
          alt: '背景图片01'
        },
        {
          name: '02pic',
          src: './static/img/imgLogin/carousel.jpg',
          alt: '背景图片02'
        },
        {
          name: '03pic',
          src: './static/img/imgLogin/carousel.jpg',
          alt: '背景图片03'
        },
        {
          name: '04pic',
          src: './static/img/imgLogin/carousel.jpg',
          alt: '背景图片04'
        },
        {
          name: '01pic',
          src: './static/img/imgLogin/carousel.jpg',
          alt: '背景图片01'
        }
      ],
      picSrc1: './static/img/imgLogin/Pic1.png',
      picSrc2: './static/img/imgLogin/Pic2.png',
      picInfox: '随时随地',
      picInfoy: '实时掌握门店动态',
      imgSrc: {
        androidSrc: './static/img/imgLogin/android.png',
        iosSrc: './static/img/imgLogin/ios.png'
      },
      curIl8: 'zh-ch',
      il8List: [
        {
          value: 'zh-ch',
          label: '简体中文'
        },
        {
          value: 'zh-tw',
          label: '繁體中文'
        },
        {
          value: 'en',
          label: 'English'
        }
      ],

      rememberUserName: false,
      loginForm: {
        // username:'axazhang.bo@advantech.com.cn',
        // password:'abc123'
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      varyWindowHeight: window.innerHeight + 'px',
      varyWindowWidth: (window.innerWidth * 2) / 3 + 'px',
      divWidth: window.innerWidth * 4 + 'px',
      divLeft: -(window.innerWidth * 2 / 3) + 'px',
      divLeftCount: -(window.innerWidth * 2 / 3),
      jumpTitle: 'Advanshop',
      copyright: '| 技术支持邮箱：service@dkk.com | Version 1.0.1 © 2016~2018 Advantech Corp. All rights reserved.',

      // animate
      btnList: [],
      list: '',
      btnIndex: 1,
      btnLen: 4,
      animated: false,
      interval: 3000,
      timer: 0
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // this.getWindowSize();
  },
  mounted() {
    const self = this;
    // self.getWindowSize();
    self.initDom();
    self.play();
    self.getUserInfo();
  },
  destroyed() {
    this.stop();
  },
  methods: {
    handleLogin() {
      const self = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          self.loading = true;
          self.$store.dispatch('LoginByUser', this.loginForm).then((res) => {
            self.loading = false;
            const resData = res.data;
            if (resData) {
              console.log(resData);
              self.$store.dispatch('GetUserAuthorities').then((result) => {
                const resultData = result.data;
                console.log(resultData);
                if (resultData) {
                  console.log(resultData.authorities);
                  PermissionHelper.setData(resultData.authorities);
                }
              });
              self.$router.push({
                path: '/',
                query: {
                  token: resData.token,
                  userId: resData.userId,
                  ezvizProtrol: resData.ezvizProtrol,
                  lang: resData.lang,
                  deviceAuth: resData.deviceAuth
                }
              });

            } else {
              console.log(res);
              const code = res.errCode;
              const msg = res.errMsg;
              let msgShow = '';
              if (code == 500 && msg == '405-login fail. Please check ID and password.') {
                msgShow = '用户名或者密码错误！';
              } else {
                msgShow = msg;
              }
              Message({
                message: msgShow,
                type: 'error',
                duration: 3 * 1000
              });
            }
          }).catch((err) => {
            console.log(err);
          });
          self.loading = false;
        } else {
          console.log('error.submit!!!');
          return false;
        }
      });
    },
    showPwd() {
      if (this.passwordType == 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    forgetPass() {

    },
    getWindowSize() {
      let docEl = document.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
          // 设置根字体大小
          docEl.style.fontSize = (docEl.clientWidth / 90) + 'px';
        };
      // 绑定浏览器缩放与加载时间
      // window.addEventListener(resizeEvt, recalc, false);
      // document.addEventListener('DOMContentLoaded', recalc, false);
    },
    hrefToWebiste() {

    },
    animate(offset) {
      const self = this;
      if (offset == 0) {
        return;
      }
      self.animated = true;
      var time = 300;
      var interval = 10;
      var speed = offset / (time / interval);
      var left = parseInt(self.list.style.left) + offset;
      var go = function() {
        if (speed > 0 && parseInt(self.list.style.left) < left || (speed < 0 && parseInt(self.list.style.left) > left)) {
          self.list.style.left = parseInt(self.list.style.left) + speed + 'px';
          setTimeout(go, interval);
        } else {
          self.list.style.left = left + 'px';
          if (left > -200) {
            self.list.style.left = self.divLeftCount * self.btnLen;
          }
          if (left < (self.divLeftCount * self.btnLen)) {
            self.list.style.left = self.divLeft;
          }
          self.animated = false;
        }
      };
      go();
    },
    showButton() {
      const self = this;
      for (var i = 0; i < self.btnList.length; i++) {
        if (self.btnList[i].className == 'on') {
          self.btnList[i].className = '';
          break;
        }
      }
      self.btnList[self.btnIndex - 1].className = 'on';
    },
    initDom() {
      const self = this;
      self.list = document.getElementById('list');
      self.btnList = document.getElementById('buttons').getElementsByTagName('span');
      for (var i = 0; i < self.btnList.length; i++) {
        self.btnList[i].onclick = function() {
          if (self.animated) {
            return;
          }
          if (this.className == 'on') {
            return;
          }
          var myIndex = parseInt(this.getAttribute('index'));
          var offset = self.divLeftCount * (myIndex - self.btnIndex); // 计算偏移值
          self.animate(offset);
          self.btnIndex = myIndex;
          self.showButton();
        };
      }
    },
    nextAnimate() {
      const self = this;
      if (self.animated) {
        return;
      }
      if (self.btnIndex == 4) {
        self.btnIndex = 1;
      } else {
        self.btnIndex += 1;
      }
      self.animate(self.divLeftCount);
      self.showButton();
    },
    play() {
      const self = this;
      self.timer = setTimeout(function() {
        if (self && self.timer) {
          self.nextAnimate();
          self.play();
        }
      }, self.interval);
    },
    stop() {
      clearTimeout(this.timer);
    },
    getUserInfo() {
      const self = this;
      console.log(getCookie('user'));
      const data = getCookie('user');
      if (data != undefined || data != null) {
        self.rememberUserName = true;
        self.loginForm = JSON.parse(data);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
*{
    font-family: Roboto,Arial, 'Microsoft YaHei';
}
$dark_gray:#889aa4;
$light_gray:#eee;
$fff:#fff;
$red:#fb4c5d;
@function rem($val){
    @return $val/16+rem;
}
@function checkRem($val){
    @if($val==auto){@return auto;}
    @else if($val==0){@return 0;}
    @else{@return rem($val);}
}
@mixin point($poi,$val){
    #{$poi}:checkRem($val);
}
.login-container{
    overflow: hidden;
    margin:0;
    height: 100%;
    .lside{
        float: left;
        height: 100%;
        overflow: hidden;
        position: relative;
        .model{
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 2;
            .logo{
                position: absolute;
                @include point(left,20);
                @include point(top,40);
                @include point(width,180);
            }
            .title-content{
                @include point(max-width,300);
                position: absolute;
                @include point(right,200);
                @include point(bottom,260);
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                text-align: left;
                span{
                    display:block;
                    @include point(font-size,36);
                    color: #fff;
                }
                #img1{
                    position: absolute;
                    @include point(left,-80);
                    @include point(width,40);
                }
                #img2{
                    position: absolute;
                    @include point(right,-80);
                    @include point(bottom,-5);
                    @include point(width,40);
                }
            }

        }
        #list{
            position: absolute;
            z-index: 1;
            img{
                float: left;
            }
        }
        #buttons {
            position: absolute;
            height: 10px;
            width: 120px;
            z-index: 3;
            @include point(bottom,100);
            left: 50%;
        }
        #buttons span {
            cursor: pointer;
            float: left;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #4E5262;
            margin-right: 15px;
            display: block;
        }
        #buttons .on {
            background: $red;
            width: 26px;
            border-radius: 10px;
        }
        #footer{
            position: absolute;
            @include point(bottom,30);
            @include point(left,60);
            z-index: 4;
            font-size: 12px;
            .a-href{
                color: #eb4a5b;
                text-decoration: underline;
                cursor: pointer;
                margin-right: 2px;
            }
            .copyright{
                color: #fff;
                opacity: .4;
            }
        }
    }
    .rside{
        float: right;
        height: 100%;
        margin:0;
        background-color:$red;
        position: relative;
        .login-title-content{
            width: 28%;
            height: 28%;
            @include point(min-height,180);
            @include point(margin-top,20);
           // background-color: #EE626E;
            position: relative;
            color: $fff;
            @include point(font-size,44);
            span{
                position: absolute;
                @include point(bottom,15);
                @include point(left,35);
            }
        }
        .login-form{
            @include point(margin-top,20);
            width: 90%;
            .icons{
                @include point(font-size,22);
                color: $fff;
            }
            .svg-container{
                display:inline-block;
                @include point(padding,6);
            }
            .el-login-input{
                width: 80%;
                @include point( margin-left,15);
            }
            .show-pwd {
                position: absolute;
                @include point(right,30);
                @include point(top,10);
                cursor: pointer;
                user-select: none;
                .icons{
                    color: $light_gray;
                    @include point(font-size,26);
                }
            }
            .rem-content{
                text-align: left;
                @include point(padding-left,25);
                position: relative;
                .elCheckBox{
                    margin-right: 10px;
                }
                span{
                    @include point(margin-left,15);
                    color: $fff;
                    font-size:14px
                }
                .forget-pass{
                    position: absolute;
                    @include point(right,10);
                    cursor: pointer;
                    &:hover{
                        color: lightblue;
                    }
                }
            }
            .el-il8{
                @include point(margin-top,30);
                .el-il8List{
                    width: 80%;
                    margin-left: 12%;
                }
            }
            .login-btn{
                width:80%;
                margin-left: 12%;
                @include point(margin-top,30);
                background-color: $fff;
                color: $red;
                border: 1px solid $red;
                @include point(font-size,16);
            }

        }
        .icon-app{
            position: absolute;
            bottom: 60px;
            @include point(bottom,40);
            left: 30%;
            img{
                @include point(margin-right,40);
                cursor: pointer;
                @include point(width,65);
            }
        }

    }
}
</style>
<style>
.el-login-input .el-input__inner{
    border-style: none !important;
    border-bottom: 1px solid #cbcbcb !important;
    background-color: #FB4C5D !important;
    color: #fff !important;
    font-size: 14px !important;
    border-radius: 0px !important;
    border-color: #cbcbcb !important;
}
.el-il8List .el-input__inner{
    border-style: none !important;
    border-bottom: 1px solid #cbcbcb !important;
    background-color: #FB4C5D !important;
    color: #fff !important;
    font-size: 14px !important;
    border-radius: 0px !important;
    border-color: #cbcbcb !important;
}
 .el-select-dropdown__item.selected{
    color: #FB4C5D !important;
}
.login-form /deep/ .el-form-item__error{
    color: #fff !important;
    font-size: 12px !important;
    line-height: 1 !important;
    padding-top: 4px !important;
    position: absolute !important;
    top: 100% !important;
    left: 15% !important;
}
</style>
