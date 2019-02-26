import axiosA from 'axios'
import {getDashServerInfo} from './device.js'
import {getCookie} from '@/common/auth.js'
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
async function getBaseURLByDash(){
    let dash=await getDashInfo();
    let url='';
    let dataPort='';
    if(dash.url.indexOf('https')!=-1){
        dataPort=dash.httpsCmdPort;
    }
    else{
        dataPort=dash.httpCmdPort;
    }
    url=dash.url+':'+dataPort;
    return url;
}
function getBaseURL(){
    let dash;
    let url='';
    if(getCookie('DASH')!=undefined){
        dash=JSON.parse(getCookie('DASH'));
        let dataPort='';
        if(dash.url.indexOf('https')!=-1){
            dataPort=dash.httpsCmdPort;
        }
        else{
            dataPort=dash.httpCmdPort;
        }
        url=dash.url+':'+dataPort;
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

let REST_BASEURL= getBaseURL();
//let REST_BASEURL='http://172.21.84.229:8050';
//"http://222.91.163.149";

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
    //let REST_BASEURL=await getBaseURL();
    if(REST_BASEURL==undefined||REST_BASEURL.length==0){
        REST_BASEURL=await getBaseURLByDash();
    }
    const newAxios=axiosA.create({
        baseURL:REST_BASEURL,
    });
    const ret=await newAxios({
        method,
        url,
        data,
        headers:{
            'Content-Type':'application/json',
            "Accept":"application/json"
        }
    });
    return ret;
}

export{
    advAxios,
    userAxios,
    ajax4dash,
    getAuthority,
}
export default advAxios