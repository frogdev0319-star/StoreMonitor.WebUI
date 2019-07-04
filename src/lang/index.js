import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhcnLocale from './zhcn'
import zhtwLocale from './zhtw'
import {getCookie} from "../common/auth";

Vue.use(VueI18n)

function getQueryString() {
  let searchStr =window.location.search;
  let lang = 'zh';
  if(searchStr == ""){
    searchStr = window.location.hash;
  }
  if(searchStr.indexOf('?') === -1){
    console.log("No parameters")
    return lang;
  }
  else if(searchStr.indexOf('&') === -1){
    console.log("Lack of parameters")
    return lang;
  }
  else{
    let langUrl = searchStr.split('&')[1].split('=')[1];
    console.log(langUrl)
    if(langUrl === 'zh-CN'){
      lang = 'zh'
    }
    else if(langUrl ==='en-US'){
      lang = 'en'
    }
    else if(langUrl === 'zh-TW'){
      lang = 'zhtw'
    }
    else{
      lang = 'zh'
    }
    console.log(lang)
    return lang;
  }

  console.log("@@@@@@@@@@@")
  console.log(searchStr);
  console.log("!!!!!!!!!!!!!")
}

const lang = getQueryString()

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhcnLocale,
    ...elementZhLocale
  },
  zhtw: {
    ...zhtwLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: getCookie('lang') || 'zh', // set locale
  messages // set locale messages
})

export default i18n
