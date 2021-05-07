const version = 'v1.0';

const _Environments = {
  Debug_XA: {
    CHINA_WEBSITE: 'http://172.21.81.63:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'http://172.21.81.63:8081/storemonitor/api/',
    USHOP_URL: 'http://172.21.73.207/',
    POST_URL: 'http://pos.ushop-plus.com/',
    VERSION: version
  },
  Debug_TW: {
    BASE_URL: 'http://172.21.81.153:18082/storemonitor/api/',
    USHOP_URL: 'https://dev.ushop-plus.com/',
    POST_URL: 'http://dev-pos.ushop-plus.com/',
    VERSION: version
  },
  Preview: {
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://preview-inspect.storevue.com/storemonitor/api/',
    USHOP_URL: 'https://preview.ushop-plus.com/',
    POST_URL: 'http://preview-pos.ushop-plus.com/',
    VERSION: version
  },
  Stable: {
    CHINA_WEBSITE: 'http://mgmt.storevue.com.cn:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://mgmt.storevue.com/storemonitor/api/',
    USHOP_URL: 'https://portals.ushop-plus.com/',
    POST_URL: 'http://pos.ushop-plus.com/',
    VERSION: version
  },
  QA: {
    CHINA_WEBSITE: 'http://222.91.163.149:19085/storemonitor/api/',
    GLOBAL_WEBSITE: 'http://172.21.81.141:8080/storemonitor/api/',
    USHOP_URL: 'http://172.21.73.207/',
    POST_URL: 'http://pos.ushop-plus.com/',
    VERSION: version
  },
  Beta: {
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://rc-inspection.storevue.com/storemonitor/api/',
    VERSION: version
  }
};

const environJSON = _Environments.Beta;
const isGlobalWebsite = false;

let Environment;
export default Environment = {
  USHOP_URL: environJSON.USHOP_URL,
  POST_URL: environJSON.POST_URL,
  VERSION: environJSON.VERSION,
  isGlobalWebsite: isGlobalWebsite,
  BASE_URL: isGlobalWebsite ? environJSON.GLOBAL_WEBSITE : environJSON.CHINA_WEBSITE
};
