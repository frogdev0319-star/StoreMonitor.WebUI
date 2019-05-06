import axios from 'axios'
import {Message,MessageBox,} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {getToken} from '@/common/auth.js'

//create an axios instance

//let base='http://'+window.location.host;
let base ='http://222.91.163.149:18081'



let itempath='/storemonitor/api/'
//配置
axios.defaults.withCredentials = true;
const service=axios.create({
    baseURL:`${base}${itempath}`,
    timeout:10000,
})
//文件下载axios
const serviceAxios=axios.create({
    baseURL:`${base}${itempath}`,
    timeout:5000
})

const serviceLogout=axios.create({
    baseURL:`${base}${itempath}`,
    timeout:10000,
})

serviceLogout.interceptors.request.use(
    config=>{
        if(store.getters.token){
            config.headers={
                'token':getToken(),
                'Accept':'application/json',
                'Content-Type':'application/json;charset=UTF-8',
            }
        }
        return config;
    },
    error=>{
        console.log(error);
        Promise.reject(error);
    }
)
serviceLogout.interceptors.response.use(
    response=>{
        return response.data;
    },
    err=>{
        return Promise.reject(err);
    }
)


serviceAxios.interceptors.request.use(
    config=>{
        if(store.getters.token){
            config.responseType='blob';
            config.headers={
                'token':getToken()
            }
        }
        return config;
    },
    error=>{
        console.log(error);
        Promise.reject(error);
    }
)
serviceAxios.interceptors.response.use(
    response=>{
        const res=response.data;
        return res;
    },err=>{
        console.log(err);
        let errCode=err.response.data.errCode;
        let errMsg=err.response.data.errMsg;
        if(errCode===500&&errMsg=='Invalid token'){
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录！','确认登出',{
                confirmButtonText:'重新登录',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                store.dispatch('FedLogOut').then(()=>{
                    //router.push('/login');
                    let url=sessionStorage.getItem('LoginURL');
                    window.location.href=url;
                    Message({
                        message:err.response.data.errMsg,
                        type:'error',
                        duration:5*1000
                    })
                })
            })
            
        }
        else if(errCode===500&&errMsg=='No authority'){
            router.push('/home');
            Message({
                message:'无操作权限!',
                type:'error',
                duration:5*1000
            })
        }
    }
)


service.interceptors.request.use(
    config=>{
        if(store.getters.token){
            config.headers={
                'token':getToken(),
                'Accept':'application/json',
                'Content-Type':'application/json;charset=UTF-8',
                
            }
        }
        return config;
    },
    error=>{
        console.log(error);
        Promise.reject(error);
    }
)

service.interceptors.response.use(
    response=>{
        const res=response.data;
        return response.data;
    },err=>{
        console.log(err);
        if(err.response){
            let errCode=err.response.data.errCode;
            let errMsg=err.response.data.errMsg;
            if(errCode===500&&(errMsg=='Invalid token'||
                errMsg=='Failed to verify token'||errMsg=='User does not exist')){
                //router.push('/login');
                let url=sessionStorage.getItem('LoginURL');
                window.location.href=url;
                Message({
                    message:'登录信息异常，请重新登录!',
                    type:'error',
                    duration:5*1000
                })
            }
            else if(errCode===500&&errMsg=='Token does not exist'){
                //router.push('/login');
                let url=sessionStorage.getItem('LoginURL');
                window.location.href=url;
            }
            else if(errCode===500&&errMsg=='No authority'){
                router.push('/home');
                Message({
                    message:'无操作权限!',
                    type:'error',
                    duration:5*1000
                })
            }
            if(err.response.status!=undefined&&err.response.status==404){
                Message({
                    message:'服务器异常，请刷新后重试!',
                    type:'error',
                    duration:5*1000
                })
            }
        }
        else if(err.request){
            if(err.request.readyState==4&&err.request.status==0){
                console.log(err.request);
                Message({
                    message:'网络异常，请检查网络连接状况!',
                    type:'error',
                    duration:5*1000
                })
            }
        }
        
        return Promise.reject(err);
    }
)


service.interceptors.request.use(
    config=>{
        if(store.getters.token){
            config.headers={
                'token':getToken(),
                'Accept':'application/json',
                'Content-Type':'application/json;charset=UTF-8',
                
            }
        }
        return config;
    },
    error=>{
        console.log(error);
        Promise.reject(error);
    }
)

export default service;
export {serviceAxios,serviceLogout};