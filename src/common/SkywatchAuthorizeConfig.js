import Environment from './environment.js';


const SkywatchAuthorizeConfig = {
  userAuthorizationUri: 'https://service.skywatch24.com/oauth2',
  redirect_server_uri: getRedirectServerUrl(),
  redirect_client_uri: getRedirectClientUrl()
};

function getRedirectServerUrl() {
  const baseUrl = Environment.BASE_URL;
  // const storemonitorIndex = baseUrl.indexOf('api');
  const redirectUrl = `${baseUrl}v1.0/skywatch`;
  return redirectUrl;
}

function getRedirectClientUrl(){
  const baseUrl = Environment.BASE_URL;
  const storemonitorIndex = baseUrl.indexOf('storemonitor');
  const redirectUrl = `${baseUrl.substr(0, storemonitorIndex)}storemonitor_ui/skywatchAccount`;
  return redirectUrl;
}

export default SkywatchAuthorizeConfig;
