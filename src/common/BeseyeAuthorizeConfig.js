import Environment from './environment';
import axios from 'axios';

const BeseyeAuthorizeConfig = {
  baseOAuthUrl: 'https://oregon-p1-stage-api-1.beseye.com/',
  userAuthorizationUri: 'https://oregon-p1-stage-api-1.beseye.com/oauth/oauth/authorize',
  redirect_uri: getRedirectClientUrl(),
  client_id: setClientId(),
  scope: 'storevue',
  state: 'a00caec8dbd08e50',
  response_type: 'code',
  code: '',
  vcamerId: '3ecf3a6ca0884462ac5c090c25c0ee27'
};

function getClientId() {
  return new Promise((resolve, reject) => {
    axios.get('beseyeconfig.json').then(res => {
      const url = res.data.client_id;
      resolve(url);
    }).catch(err => {
      reject(err);
    });
  });
}

async function setClientId() {
  let clientId = await getClientId();
  if (!clientId) {
    clientId = 'c96573eb5b721ebd133963de5007ee5c9c86c733e288710a61db2b574683e94a';
  }
  sessionStorage.setItem('clientId', clientId);
}

function getRedirectClientUrl() {
  const baseUrl = Environment.BASE_URL;
  const storemonitorIndex = baseUrl.indexOf('storemonitor');
  const redirectUrl = `${baseUrl.substr(0, storemonitorIndex)}storemonitor_ui/beseye/authorize`;
  return redirectUrl;
}

export default BeseyeAuthorizeConfig;
