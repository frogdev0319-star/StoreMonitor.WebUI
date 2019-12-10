
let version = 'v1.0';

let _Environments = {
  Debug_XA: {
    BASE_URL: 'http://172.21.81.117:8081/storemonitor/api/',
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
    //BASE_URL: 'http://13.76.227.211:8081/storemonitor/api/',
    BASE_URL: 'http://47.103.135.242:8081/storemonitor/api/',
    USHOP_URL: 'https://preview.ushop-plus.com/',
    POST_URL: 'http://preview-pos.ushop-plus.com/',
    VERSION: version,
  },
  Stable: {
    BASE_URL: 'http://47.103.41.236:8081/storemonitor/api/',
    USHOP_URL: 'https://portals.ushop-plus.com/',
    POST_URL: 'http://pos.ushop-plus.com/',
    VERSION: version,
  },
  QA: {
    BASE_URL: 'http://172.21.81.176:19085/storemonitor/api/',
    USHOP_URL: 'http://172.21.73.207/',
    POST_URL: 'http://pos.ushop-plus.com/',
    VERSION: version
  }
}

function getEnvironment() {
  return _Environments.Stable;
}

var Environment = getEnvironment()
module.exports = Environment
