import axios from 'axios'

function getAuthority(){
    let username='Admin';
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
let REST_BASEURL="http://172.21.84.229";
const advAxios=axios.create({
    baseURL:REST_BASEURL+':8085',
    headers:{
        'Authorization':getAuthority(),
        'Accept':'application/json',
        'Content-Type':'application/json'
    }
});

const userAxios=axios.create({
    baseURL:REST_BASEURL+':8085',
    headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
    }
});

const newAxios=axios.create({
    baseURL:REST_BASEURL+':8050',
});

async function ajax4dash({method,url,data}){
    const ret=await newAxios({
        method,
        url,
        data,
        headers:{
            'Content-Type':'application/json'
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