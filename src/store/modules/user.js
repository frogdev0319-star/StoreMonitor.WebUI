import {loginByUsername,logout,getUserInfo} from '@/api/login'
import {getDashServerInfo} from '@/api/device'
import {getToken,setToken,removeToken,getCookie,setCookie} from '@/common/auth'
import api from '@/api/index'

const user={
    state:{
        user:'',
        status:'',
        code:'',
        token:getToken(),
        dash:getCookie('DASH'),
        cancel:null,
        name:'',
        avatar:'',
        introduction:'',
        roles:[],
        setting:{
            articlePlatform:[]
        },
        changeColor:false
    },
    mutations:{
        SET_CODE: (state, code) => {
            state.code = code
          },
          SET_TOKEN: (state, token) => {
            state.token = token
          },
          SET_DASH:(state,dash)=>{
            state.dash=dash
          },
          SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
          },
          SET_SETTING: (state, setting) => {
            state.setting = setting
          },
          SET_STATUS: (state, status) => {
            state.status = status
          },
          SET_NAME: (state, name) => {
            state.name = name
          },
          SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
          },
          SET_ROLES: (state, roles) => {
            state.roles = roles
          }
    },
    actions:{
        SetDash({commit}){
            return new Promise((resolve,reject)=>{
                getDashServerInfo().then(res=>{
                    console.log(res);
                    const data=res.data;
                    if(res.data){
                        commit('SET_DASH',data);
                        setCookie('DASH',JSON.stringify(data));
                    }
                    resolve(res);
                })
            })
        },
        LoginByUser({commit},userInfo){
            const username=userInfo.username.trim();
            let params={
                "email":username,
                "password":userInfo.password
            }
            return new Promise((resolve,reject)=>{
                loginByUsername(params).then(res=>{
                    console.log(res);
                    const data=res.data;
                    if(res.data){
                        commit('SET_TOKEN',data.token);
                        setToken(data.token);
                    }
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                })
            })
        },
        //登出
        LogOut({commit,state}){
            return new Promise((resolve,reject)=>{
                logout().then(()=>{
                    commit('SET_TOKEN','');
                    removeToken();
                    resolve();
                }).catch(error=>{
                    reject(error);
                })
            })
        },
        //前端登出
        FedLogOut({commit}){
            return new Promise(resolve=>{
                commit('SET_TOKEN','');
                removeToken();
                resolve();
            })
        }
    }
}

export default user;

