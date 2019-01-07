import axios from 'axios'
import {Message,MessageBox,} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {getToken} from '@/common/auth.js'

//create an axios instance

//let base='http://'+window.location.host;
let base ="http://172.21.84.62:8085";
let itempath='/storemonitor/api/v1.0'
axios.defaults.withCredentials = true
const service=axios.create({
    baseURL:`${base}${itempath}`,
    timeout:5000
})

service.interceptors.request.use(
    config=>{
        //Do something before request is sent
        if(store.getters.token){
            config.headers={
                'token':getToken(),
                'Accept':'application/json',
                'Content-Type':'application/json;charset=UTF-8'
            }
        }
        return config;
    },
    error=>{
        //Do something with request error
        console.log(error);
        Promise.reject(error);
    }
)
service.interceptors.response.use(
    response=>{
        const res=response.data;
        if(res.errCode!==0){
            Message({
                message:res.message,
                type:'error',
                duration:5*1000
            })
            //50008 :非法token, 50012:其他客户端登陆了, 50014:token过期了
            if(res.errCode===500&&res.errMsg=='Invalid token'){
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录！','确认登出',{
                    confirmButtonText:'重新登录',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    store.dispatch('FedLogOut').then(()=>{
                        router.push('/login');
                    })
                })
            }
            return Promise.reject('error')
        }
        else{
            return response.data;
        }
    },err=>{
        console.log(err);
        let errCode=err.response.data.errCode;
        if(errCode===500){
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录！','确认登出',{
                confirmButtonText:'重新登录',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                store.dispatch('FedLogOut').then(()=>{
                    router.push('/login');
                    Message({
                        message:err.response.data.errMsg,
                        type:'error',
                        duration:5*1000
                    })
                })
            })
        }
    }
)

export default service;