import Environment from './environment.js';


const SkywatchAuthorizeConfig = {
  userAuthorizationUri: 'https://service.skywatch24.com/oauth2',
  redirect_server_uri: getRedirectUrl(),
};

function getRedirectUrl() {
  const baseUrl = Environment.BASE_URL;
  const storemonitorIndex = baseUrl.indexOf('storemonitor');
  const redirectUrl = `${baseUrl.substr(0, storemonitorIndex)}storemonitor_ui/skywatch`;
  return redirectUrl;
}

export default SkywatchAuthorizeConfig;
