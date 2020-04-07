import axiosA from 'axios'
import {getDashServerInfo} from './device.js'
import {Message} from 'element-ui'
import store from '../store/index.js';
import i18n from '@/lang'
import {message} from '@/common/singleton-message'

axiosA.defaults.withCredentials = false

function getDashInfo(){
    return new Promise((resolve,reject)=>{
        getDashServerInfo().then(res=>{
            console.log(res);
            let dash;
            let errCode=res.errCode;
            if(errCode==0){
                dash=res.data;
            }
            resolve(dash);
        })
    })

}
async function getBaseURL(){
    let dash;
    let url='';
    if(sessionStorage.getItem('DASH_URL')!=undefined){
        url=sessionStorage.getItem('DASH_URL'); //将dash存储在loaclStorage 中
    }
    else{
        dash=await getDashInfo();
        let dataPort='';
        if(dash.url.indexOf('https')!=-1){
            dataPort=dash.httpsCmdPort;
        }
        else{
            dataPort=dash.httpCmdPort;
        }
        url=dash.url+':'+dataPort;
        sessionStorage.setItem('DASH_URL',url);
    }
    return url;
}
function getAuthority(){
    let username='admin';
    let password='1234';
    try{
        let uname=sessionStorage.getItem('UserName');
        if(uname!=null){
            uname=username;
        }
        let upass=sessionStorage.getItem('PassWord');
        if(upass!=null){
            upass=password;
        }
    }
    catch(error){
        console.error(error);
    }
    let auth64='Basic'+btoa(username+':'+password);
    return auth64;
}

//let REST_BASEURL= getBaseURL();
let REST_BASEURL=store.state.user.dashurl;
const advAxios=axiosA.create({
    baseURL:REST_BASEURL,
    headers:{
        'Authorization':getAuthority(),
        'Accept':'application/json',
        'Content-Type':'application/json'
    }
});

const userAxios=axiosA.create({
    baseURL:REST_BASEURL,
    headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
    }
});


async function ajax4dash({method,url,data}){
    let REST_BASEURL=store.state.user.dashurl;
    console.log(REST_BASEURL);
    if(REST_BASEURL==undefined||REST_BASEURL.length==0){
        REST_BASEURL=await getBaseURL();
    }
    const newAxios=axiosA.create({
        baseURL:REST_BASEURL,
        timeout:30000,
    });
    let ret = null;
    await newAxios({
        method,
        url,
        data,
        headers:{
            'Content-Type':'application/json',
            "Accept":"application/json"
        }
    }).then(res=>{
        ret = res;
    }).catch((err) => {
        console.log(err);
        message({
            message: i18n.t('remotePatrol.dashServerError'),
            type:'error',
            duration:5*1000
        })
    })
    return ret;
}

export{
    advAxios,
    userAxios,
    ajax4dash,
    getAuthority,
}
export default advAxios
