import Cookies from 'js-cookie'

const TokenKey='Admin-Token';

export function getToken(){
    return Cookies.get(TokenKey);
}

export function setToken(token){
    return Cookies.set(TokenKey,token);
}

export function removeToken(){
    return Cookies.remove(TokenKey);
}


export function getCookie(name){
    return Cookies.get(name);
}
export function setCookie(name,value){
    return Cookies.set(name,value,{expires:7});  //设置有效期为7天
}
export function removeCookie(name){
    return Cookies.remove(name);
}
