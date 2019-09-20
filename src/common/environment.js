
let version = 'v1.0';

//let base = 'http://172.21.81.117:8081' //本地
// let base='http://172.21.81.176:19085' //测试
// let base='http://13.76.227.211:8081' //新加坡preview
// let base='http://47.103.135.242:8081' //阿里preview

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
    BASE_URL: 'http://portals.storeviu.com.cn:8081/storemonitor/api/',
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
  return _Environments.Debug_XA;
}

var Environment = getEnvironment()
module.exports = Environment
