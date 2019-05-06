import {loginByUsername,logout,getUserInfo,changeAccount} from '@/api/login'
import {getDashServerInfo} from '@/api/device'
import {getToken,setToken,removeToken,getCookie,setCookie} from '@/common/auth'
import api from '@/api/index'

const user={
    state:{
        user:'',
        status:'',
        code:'',
        token:getToken(),
        dashurl:sessionStorage.getItem('DASH_URL'),
        cancel:null,
        name:'',
        avatar:'',
        introduction:'',
        roles:[],
        setting:{
            articlePlatform:[]
        },
        accountChanged:0,
        accountId:'',
        cachePath:[""]
    },
    mutations:{
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_DASHURL:(state,dashurl)=>{
            state.dashurl=dashurl
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
        },
        Account_Changed:(state,accountChanged)=>{
            state.accountChanged=accountChanged
        },
        SET_ACCOUNTID:(state,accountId) => {
            state.accountId=accountId
        },
        newCachePath(state,msg){
            state.cachePath=msg
        }
    },
    actions:{
        GetDash({commit}){
            return new Promise((resolve,reject)=>{
                getDashServerInfo().then(res=>{
                    console.log(res);
                    if(res.data){
                        let dash=res.data;
                        let dataPort='';
                        let url='';
                        if(dash.url.indexOf('https')!=-1){
                            dataPort=dash.httpsCmdPort;
                        }
                        else{
                            dataPort=dash.httpCmdPort;
                        }
                        url=dash.url+':'+dataPort;
                        commit('SET_DASHURL',url);
                        sessionStorage.setItem('DASH_URL',url);
                    }
                    resolve(res);
                })
            })
        },
        changeAccount({commit},params){
            return new Promise((resolve,reject)=>{
                changeAccount(params).then(res=>{
                    if(res.errCode==0){
                        commit('Account_Changed',++user.state.accountChanged);
                    }
                    else{
                        commit('Account_Changed',0);
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

