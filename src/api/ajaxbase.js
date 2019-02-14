import axiosA from 'axios'
import {getDashServerInfo} from './device.js'
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
            resolve(data);
        })
    })
    
}
async function getDash(){
    let dash=await getDashInfo();
    return dash;
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
function getBaseURL(){
    let baseUrl='http://'+window.location.hostname;
    return baseUrl;
}

//let REST_BASEURL=getBaseURL()+':8085';
//"http://222.91.163.149";
let dash=getDash();
let REST_BASEURL=dash.url+':'+dash.dataPort;
const advAxios=axiosA.create({
    baseURL:REST_BASEURL+':8085',
    headers:{
        'Authorization':getAuthority(),
        'Accept':'application/json',
        'Content-Type':'application/json'
    }
});

const userAxios=axiosA.create({
    baseURL:REST_BASEURL+':8085',
    headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
    }
});

const newAxios=axiosA.create({
    baseURL:REST_BASEURL+':18050',
});

async function ajax4dash({method,url,data}){
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
    getAuthority
}
export default advAxios