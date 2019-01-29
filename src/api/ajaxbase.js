import axiosA from 'axios'
axiosA.defaults.withCredentials = false
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
let REST_BASEURL="http://222.91.163.149";
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