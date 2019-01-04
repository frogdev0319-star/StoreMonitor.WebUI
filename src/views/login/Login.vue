<template>
    <div class="login-container" :style="{'min-height':varyWindowHeight}">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules"
            class="login-form" auto-complete="on" label-position="left">
            <div class="title-container">
                <h3 class="title">{{login.title}}</h3>
            </div>
            <el-form-item prop="username">
                <span class="svg-container">
                    <i class="iconfont icon-admin icons"></i>
                </span>
                <el-input 
                    class="el-login-input"
                    v-model="loginForm.username"
                    :placeholder="login.username"
                    name="usernmae"
                    type="text"
                    auto-complete="on"/>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <i class="iconfont icon-wodemima icons"></i>
                </span>
                <el-input
                    class="el-login-input"
                    :type="passwordType"
                    v-model="loginForm.password"
                    :placeholder="login.password"
                    name="password"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"/>
                    <span class="show-pwd" @click="showPwd">
                        <i class="iconfont icons" :class="passwordType=='password'?'icon-eye1':'icon-eye'"></i>
                    </span>
            </el-form-item>
            <el-button :loading="loading" type="primary"  class="login-btn" 
             @click.native.prevent="handleLogin">{{login.loginBtnTitle}}</el-button>
        </el-form>
    </div>
</template>
<script>
import { isvalidUsername } from '@/common/validate'
import api from '@/api/index'
export default {
    name:'Login',
    data(){
        const validateUsername=(rule,value,callback)=>{
            if(!isvalidUsername(value)){
                callback(new Error('Please enter the correct user name'));
            }
            else{
                callback();
            }
        }
        const validatePassword=(rule,value,callback)=>{
            if(value.length<6){
                callback(new Error('The password can not be less than 6 digits!'));
            }
            else{
                callback();
            }
        }
        return{
            
            login:{
                title:'Login Form',
                username:'username',
                password:'password',
                loginBtnTitle:'Login',
            },
            loginForm:{
                username:'axazhang.bo@advantech.com.cn',
                password:'abc123'
            },
            loginRules:{
                username:[{required:true,trigger:'blur',validator:validateUsername}],
                password:[{required:true,trigger:'blur',validator:validatePassword}]
            },
            passwordType:'password',
            loading:false,
            redirect:undefined,
            varyWindowHeight:window.innerHeight+'px'
        }
    },
    watch:{
        $route:{
            handler:function(route){
                this.redirect=route.query&&route.query.redirect
            },
            immediate:true
        }
    },
    methods:{
        handleLogin(){
            let self=this;
            this.$refs.loginForm.validate(valid=>{
                if(valid){
                    self.loading=true;
                    self.$store.dispatch('LoginByUser',this.loginForm).then(()=>{
                        self.loading=false;
                        self.$router.push({path:self.redirect||'/'});
                    }).catch(()=>{
                        self.loading=false;
                    })
                }else{
                    console.log('error.submit!!!');
                    return false;
                }
            })
        },
        showPwd(){
            if(this.passwordType=='password'){
                this.passwordType='';
            }
            else{
                this.passwordType='password';
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#eee;
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
        width: 100%;
        height: 100%;
        min-height: 100%;
        background-color: $bg;
        overflow: hidden;
        .login-form{
            position: relative;
            @include point(width,500);
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
            .icons{
                @include point(font-size,22);
            }
            .title-container{
                .title{
                    color: $light_gray;
                }
            }
            .svg-container{
                display:inline-block;
                color: $dark_gray;
                //padding: 6px;
                @include point(padding,6);
            }
            .el-login-input{
                width: 80%;
                @include point( margin-left,15);
            }
            .show-pwd {
                position: absolute;
                right: 35px;
                top: 7px;
                font-size: 16px;
                color: $dark_gray;
                cursor: pointer;
                user-select: none;
            }
            .login-btn{
                width:80%;
                margin-left: 10%;
                margin-top: 15px;
            }
        }
    }
</style>
<style>
.el-form-item__error{
    left: 15% !important;
}
</style>
