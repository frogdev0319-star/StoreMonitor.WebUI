import {ajax4dash} from './ajaxbase'

async function Online(){
    console.log('Dash.js OnLine Enter!');
    const url='/AdvStreamingService/Authority/Online',
    method='PUT',
    data={
        request:{
            username:'admin',
            password:'1234'
        }
    };
    const ret=await ajax4dash({
        url,
        method,
        data
    })
    console.log(ret.data.result.SessionID);
    return ret.data.result.SessionID;
}

async function Offline(sessionID) {
    console.log('Dash.js Offline Enter!');
  
    const url = '/AdvStreamingService/Authority/Offline';
    const method = 'PUT';
    const data = {
       request: { 
        sessionID:sessionID
       }
    };
    const ret = await ajax4dash({
      url,
      method,
      data
    });
  
    return ret.result;
}

  async function Enum(sessionID) {
    console.log('Dash.js Enum Enter!');
  
    const url = '/AdvStreamingService/PlatformInfo/Enumeration?sessionID='+sessionID;
    const method = 'GET';
    const data = '';
    const ret = await ajax4dash({
      url,
      method,
      data
    });
  
    console.log(ret.data.result);
  
    return ret.data.result;
  }


async function  RealTime(isStart,data) {
    console.log('Dash.js RealTime Enter!');
    const url = '/AdvStreamingService/LiveStream';
    const method = 'PUT';
    const ret = await ajax4dash({
      url,
      method,
      data
    });
  
    if ( isStart == 1 ){
       if ( ret.data.result.state == 'OK' ) {
        console.log(ret.data.result.mpd);  
        return ret.data.result.mpd;
    }
       else {
            console.log('preview failed!');  
            return '';
        }
    } 
    if ( isStart == 0 ) {
        console.log(ret.data.result);
    }
}

async function  Playback(isStart,data) {
    console.log('Dash.js Playback Enter!');
    const url = '/AdvStreamingService/PlaybackStream';
    const method = 'PUT';
  
    const ret = await ajax4dash({
      url,
      method,
      data
    });
  
    if ( isStart == 1 ){
      if ( ret.data.result.state == 'OK' ) {
        console.log(ret.data.result.mpd);  
        return ret.data.result.mpd;
      }
      else {
        console.log('playback failed!');  
        return '';
      }
    } 
    if ( isStart == 0 ) {
      console.log(ret.data.result);
      return '';  
    }
}
export default {Online,Offline,Enum,RealTime,Playback}