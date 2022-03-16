import Vue from 'vue';
import VueI18n from 'vue-i18n';
import elementEnLocale from 'element-ui/lib/locale/lang/en';
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';
import elementZhTWLocale from 'element-ui/lib/locale/lang/zh-TW';
import elementJaLocale from 'element-ui/lib/locale/lang/ja';
import elementKoLocale from 'element-ui/lib/locale/lang/ko';
import elementIdLocale from 'element-ui/lib/locale/lang/id';
import elementThLocale from 'element-ui/lib/locale/lang/th';
import elementVnLocale from 'element-ui/lib/locale/lang/vi';

import enLocale from './en';
import zhcnLocale from './zhcn';
import zhtwLocale from './zhtw';
import jaLocale from './ja';
import koLocale from './ko';
import idLocale from './id';
import thLocale from './th';
import vnLocale from './vn';

import { getCookie } from '../common/auth';

Vue.use(VueI18n);

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
    ...elementZhTWLocale
  },
  'ja-JP': {
    ...jaLocale,
    ...elementJaLocale
  },
  'ko-KR': {
    ...koLocale,
    ...elementKoLocale
  },
  'vi-VN':{
    ...vnLocale,
    ...elementVnLocale
  },
  'id-ID':{
    ...idLocale,
    ...elementIdLocale
  },
  'th-TH':{
    ...thLocale,
    ...elementThLocale
  }
};

const i18n = new VueI18n({
  locale: getCookie('lang') || 'en', // set locale
  messages // set locale messages
});

export default i18n;
