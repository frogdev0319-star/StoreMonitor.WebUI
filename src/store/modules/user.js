import {loginByUsername,logout,getUserInfo} from '@/api/login'
import {getToken,setToken,removeToken} from '@/common/auth'
import api from '@/api/index'

const user={
    state:{
        user:'',
        status:'',
        code:'',
        token:getToken(),
        name:'',
        avatar:'',
        introduction:'',
        roles:[],
        setting:{
            articlePlatform:[]
        }
    },
    mutations:{
        SET_CODE: (state, code) => {
            state.code = code
          },
          SET_TOKEN: (state, token) => {
            state.token = token
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
                    commit('SET_TOKEN',data.token);
                    setToken(data.token);
                    resolve();
                }).catch(error=>{
                    reject(error);
                })
            })
        },
        //登出
        LogOut({commit,state}){
            return new Promise((resolve,reject)=>{
                logout(state.token).then(()=>{
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

