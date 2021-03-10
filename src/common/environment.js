const version = 'v1.0';

const _Environments = {
  Debug_XA: {
    CHINA_WEBSITE: 'http://172.21.81.63:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'http://172.21.81.63:8081/storemonitor/api/',
    VERSION: version
  },
  Preview: {
    CHINA_WEBSITE: 'http://47.103.135.242:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://preview-inspect.storevue.com/storemonitor/api/',
    VERSION: version
  },
  Stable: {
    CHINA_WEBSITE: 'http://mgmt.storevue.com.cn:8081/storemonitor/api/',
    GLOBAL_WEBSITE: 'https://mgmt.storevue.com/storemonitor/api/',
    VERSION: version
  },
  QA: {
    CHINA_WEBSITE: 'http://222.91.163.149:19085/storemonitor/api/',
    GLOBAL_WEBSITE: 'http://172.21.81.141:8080/storemonitor/api/',
    VERSION: version
  }
};

const environJSON = _Environments.Stable;
const isGlobalWebsite = true;

let Environment;
export default Environment = {
  VERSION: environJSON.VERSION,
  isGlobalWebsite: isGlobalWebsite,
  BASE_URL: isGlobalWebsite ? environJSON.GLOBAL_WEBSITE : environJSON.CHINA_WEBSITE
};
