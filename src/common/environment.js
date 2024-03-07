const version = 'v1.0';
import data from "./customdata.json"
const _Environments = {
  Debug_XA: {
    CHINA_WEBSITE: 'http://172.22.24.90:8082/storemonitor/api/',//http://172.21.81.63:8080/storemonitor/api/',
    GLOBAL_WEBSITE: 'http://172.22.24.90:8082/storemonitor/api/',//http://172.21.81.63:8081/storemonitor/api/',
    VERSION: version
  },
  Preview: {
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://preview-inspect.storevue.com/storemonitor/api/',
    
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },
  Stable: {
    CHINA_WEBSITE: 'http://mgmt.storevue.com.cn:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://mgmt.storevue.com/storemonitor/api/',
    VERSION: version,
    clientId: 'abf2c7e17648cc11f1562e2ea26e2d61743cae99c3df395ba68b817f37c99a03'
  },
  QA: {
    // CHINA_WEBSITE: 'http://axa.wise-insightapm.com:19085/storemonitor/api/',
    CHINA_WEBSITE: 'http://172.21.81.176:9050/storemonitor/api/',
    GLOBAL_WEBSITE: 'http://172.21.81.176:9050/storemonitor/api/',
    VERSION: version
  },
  Beta: {
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://rc-inspection.storevue.com/storemonitor/api/',
    VERSION: version
  },
  RC: {
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://rc-inspect.wise-apps.com/storemonitor/api',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },
  NewPortals:{
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://inspection.storevue.com/storemonitor/api',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },
  Dev:{
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://dev-inspection.wise-apps.com/storemonitor/api',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },
  iservice:{
    CHINA_WEBSITE: 'https://inspection.wise-iservice.com/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://inspection.wise-iservice.com/storemonitor/api/',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },
  iservicePreview:{
    CHINA_WEBSITE: 'https://preview-inspection.wise-iservice.com/storemonitor/api',
    GLOBAL_WEBSITE: 'https://preview-inspection.wise-iservice.com/storemonitor/api/',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },

  // new RC vm
  RC_StoreVue:{
    CHINA_WEBSITE: 'https://rc-inspect.wise-apps.com/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://rc-inspect.wise-apps.com/storemonitor/api/',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },
  RC_iService:{
    CHINA_WEBSITE: 'https://rc-inspection.wise-iservice.com/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://rc-inspection.wise-iservice.com/storemonitor/api/',
    VERSION: version,
    clientId: 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a'
  },


};

let environJSON
let isGlobalWebsite
console.log("Enrionment")
console.log(data)
if(data.SITE == 'RC'){
  environJSON = _Environments.RC;
  isGlobalWebsite = true;
}
else if(data.SITE == 'Preview'){
  environJSON = _Environments.Preview;
  isGlobalWebsite = true;
}
else if(data.SITE == 'Portals'){
  environJSON = _Environments.Stable;
  isGlobalWebsite = true;
}
else if(data.SITE == 'NewPortals'){
  environJSON = _Environments.NewPortals;
  isGlobalWebsite = true;
}
else if(data.SITE == 'Dev'){
  environJSON = _Environments.Dev;
  isGlobalWebsite = true;
}
else if(data.SITE == 'iservice'){
  environJSON = _Environments.iservice;
  isGlobalWebsite = true;
}
else if(data.SITE == 'iservice-preview'){
  environJSON = _Environments.iservicePreview;
  isGlobalWebsite = true;
}
else{
  environJSON = _Environments.iservicePreview;
  isGlobalWebsite = true;
}

let Environment;
export default Environment = {
  VERSION: environJSON.VERSION,
  isGlobalWebsite: isGlobalWebsite,
  BASE_URL: isGlobalWebsite ? environJSON.GLOBAL_WEBSITE : environJSON.CHINA_WEBSITE
};
