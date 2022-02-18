const version = 'v1.0';

const _Environments = require("@/common/environment.json");

const runtimeEnvironment = process.env.Runtime_Environment === "undefined" ? Object.keys(_Environments)[0] : process.env.Runtime_Environment;

const environJSON = _Environments[runtimeEnvironment];
const isGlobalWebsite = process.env.NODE_ENV === "production";

let Environment;
export default Environment = {
  VERSION: environJSON.VERSION || version,
  isGlobalWebsite: isGlobalWebsite,
  BASE_URL: isGlobalWebsite ? environJSON.GLOBAL_WEBSITE : environJSON.CHINA_WEBSITE,
  Web_Version: process.env.Web_Version
};
