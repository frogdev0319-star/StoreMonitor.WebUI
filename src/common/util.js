import { format } from "url";
import ConvertPinyin from '@/common/getpinyin'
import i18n from '@/lang/index'
export default {
    //获取一小时前数据的日期格式化
    getOneHourTime(para){
        let bt=new Date(new Date().getTime()-1*60*60*1000);
        let et=new Date();
        para.beginTs= new Date(+new Date(bt)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,''),
        para.endTs=new Date(+new Date(et)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
       return para;
    },

    //获取一天前数据的日期格式化
    getOneDayTime(para){
        let bt=new Date(new Date().getTime()-24*60*60*1000);
        let et=new Date();
        para.beginTs= new Date(+new Date(bt)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,''),
        para.endTs=new Date(+new Date(et)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
       return para;
    },
    //获取一个月前的日期格式
    getOneMonthTime(para){
        let bt=new Date(new Date().getTime()-24*60*60*1000*30);
        let et=new Date();
        para.beginTs= new Date(+new Date(bt)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,''),
        para.endTs=new Date(+new Date(et)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
        return para;
    },

    //时间格式化为两位数
    formatterTime(src){
    return src.toString().length==1?0+src.toString():src.toString();

    },

    //时间戳格式化为时间字符
     getdate(ts){
        var result='';
        let t=new Date(ts);
        let hour=this.formatterTime((t.getHours()-8>=0?t.getHours()-8:0));
        let min=this.formatterTime(t.getMinutes());
        let sec=this.formatterTime(t.getSeconds());
        result=hour+':'+min+':'+sec;
        return result;
    },
    //时间戳转换为年月日
    getDateTime(ts){
        var result='';
        let t=new Date(ts);
        let years=t.getFullYear();
        let month=t.getMonth()+1;
        let day=t.getDate();
        let hour=t.getHours()<10?'0'+t.getHours():t.getHours();
        let min=t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes();
        result=years+'/'+month+'/'+day+' '+hour+':'+min;
        return result;
    },
    getDaysCount(){   
        var date=new Date();
        var month=date.getMonth();
        date.setMonth(month+1);
        date.setDate(0);
        return date.getDate();

    },
    getDaysArry(){
        var day=this.getDaysCount();
        var arr=[];
        for(var i=1;i<=day;i++){
            arr.push(i);
        }
        return arr;
    },
    getInitDay(){
        var day=this.getDaysCount();
        var arr=[];
        for(var i=1;i<=day;i++){
            arr.push(0);
        }
        return arr;
    },
    getDaysRandom(){
        var day=this.getDaysCount();
        var arr=[];
        for(var i=1;i<=day;i++){
            arr.push(Math.round(Math.random()*100));
        }
        return arr;
    },
    getTheStartDate(num){
        let date=new Date();
        let StartDate=new Date(date);
        StartDate.setDate(date.getDate()-30*num);
        let dateStr=StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate();
        return dateStr;
    },
    getRandom1(start, end) {
        var length = end - start;
        var num = (Math.random() * (length) + start);
        return num;
    },

    getRouteByTag(curTag,data){
        console.log(data);
        let temp=[];
        if(data.length!=0){
            data.forEach(item=>{
                if(item.tag==curTag){
                    temp.push(item);
                }
            })
        }
        return temp;
    },
    getCityList(storeList){
        let cityList=[];
        storeList.forEach(item=>{
            let province=item.province;
            if(cityList.indexOf(province)==-1){
                cityList.push(province);
            }
        })
    },
    getDateCurMonth(year,month){
        let nowdate=new Date(''+year+','+month+',01');
        let weekday=nowdate.getDay();
        return weekday;
    },
    getDayNum(year,month){
        let nowdate=new Date(''+year+','+month+',01');
        month=nowdate.getMonth()+1;
        nowdate.setMonth(month);
        nowdate.setDate(0);
        let dayNum=nowdate.getDate();
        return dayNum;
    },
    getCurDateStr(){
        let date=new Date();
        let formatDate=function(datetype){
            return datetype<10?('0'+datetype):datetype;
        }
        let year=date.getFullYear();
        let month=formatDate(date.getMonth()+1);
        let day=formatDate(date.getDate());
        let hours=formatDate(date.getHours());
        let minutes=formatDate(date.getMinutes());
        let second=formatDate(date.getSeconds());
        return `${year}${month}${day}-${hours}${minutes}${second}`;
    },
    /**
     * 将当前数组中的汉字转换为其对应的拼音
     * @param {需要转换的数组} temp 
     */
    getPinyinList(str){
        let temp=[];
        temp.push(ConvertPinyin(str));
        temp.push(str);
       return temp;
    },
      // 随机生成文件名
    random_string(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    getYearStr(ts){
        let dateStr='';
        let t=new Date(ts);
        let years=t.getFullYear();
        let month=t.getMonth()+1;
        let day=t.getDate();
        dateStr=years+'-'+month+'-'+day;
        return dateStr;
    },
    getDayStr(ts){
        let dateStr='';
        let t=new Date(ts);
        let hour=t.getHours()<10?'0'+t.getHours():t.getHours();
        let min=t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes();
        let second=t.getSeconds()<10?'0'+t.getSeconds():t.getSeconds();
        dateStr=hour+':'+min+':'+second;
        return dateStr;
    },
    getDateStr(ts){
        let dateStr='';
        let t=new Date(ts);
        let years=t.getFullYear();
        let month=t.getMonth()+1;
        let day=t.getDate();
        let hour=t.getHours()<10?'0'+t.getHours():t.getHours();
        let min=t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes();
        let second=t.getSeconds()<10?'0'+t.getSeconds():t.getSeconds();
        dateStr=years+'-'+month+'-'+day+' '+hour+':'+min+':'+second;
        return dateStr;
    },
    getDateStr1(ts){
        let dateStr='';
        let t=new Date(ts);
        let years=t.getFullYear();
        let month=(t.getMonth()+1)<10?'0'+(t.getMonth()+1):(t.getMonth()+1);
        let day=t.getDate()<10?'0'+t.getDate():t.getDate();
        let hour=t.getHours()<10?'0'+t.getHours():t.getHours();
        let min=t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes();
        let second=t.getSeconds()<10?'0'+t.getSeconds():t.getSeconds();
        dateStr=years+'-'+month+'-'+day+' '+hour+':'+min+':'+second;
        return dateStr;
    },
    getErrorText(errorCode){
        let lang = i18n.locale;
        let msg='';
        switch(errorCode){
            case 1: {
              if(lang == 'zh'){
                msg='XML/JSON 参数不正确';
              }
              else if(lang == 'en'){
                msg='Incorrect parameters of XML/JSON';
              }
              else if(lang == 'zhtw'){
                msg='XML/JSON 參數不正確';
              }
              else{
                msg='XML/JSON 参数不正确';
              }
              break;
            }
            case 2: {
              if(lang == 'zh'){
                msg='用户名或密码错误';
              }
              else if(lang == 'en'){
                msg='Wrong user name or password';
              }
              else if(lang == 'zhtw'){
                msg='用戶名或密碼錯誤';
              }
              else{
                msg='用户名或密码错误';
              }
              break;
            }
            case 3: {
              if(lang == 'zh'){
                msg='用户不在线';
              }
              else if(lang == 'en'){
                msg='Wrong user name or password';
              }
              else if(lang == 'zhtw'){
                msg='用戶不在線';
              }
              else{
                msg='用户不在线';
              }
              break;
            }
            case 4: {
              if(lang == 'zh'){
                msg='连接 PV6SvrRemote COM 接口出错';
              }
              else if(lang == 'en'){
                msg='Connection to PV6SvrRemote COM interface error';
              }
              else if(lang == 'zhtw'){
                msg='連接 PV6SvrRemote COM 接口出錯';
              }
              else{
                msg='连接 PV6SvrRemote COM 接口出错';
              }
              break;
            }
            case 5: {
              if(lang == 'zh'){
                msg='请求的 IVS 数据库中不存在';
              }
              else if(lang == 'en'){
                msg='The requested IVS does not exist in  database'
              }
              else if(lang == 'zhtw'){
                msg='請求的 IVS 數據庫中不存在';
              }
              else{
                msg='请求的 IVS 数据库中不存在';
              }
              break;
            }
            case 7: {
              if(lang == 'zh'){
                msg='视频请求 DASH 服务器网络出错';
              }
              else if(lang == 'en'){
                msg='Video request DASH server network error'
              }
              else if(lang == 'zhtw'){
                msg='視頻請求 DASH 服務器網絡出錯';
              }
              else{
                msg='视频请求 DASH 服务器网络出错';
              }
              break;
            }
            case 8: {
              if(lang == 'zh'){
                msg='用户下线出错';
              }
              else if(lang == 'en'){
                msg='Error appears in user go offline'
              }
              else if(lang == 'zhtw'){
                msg='用戶下線出錯';
              }
              else{
                msg='用户下线出错';
              }
              break;
            }
            case 9: {
              if(lang == 'zh'){
                msg='IVS 不支持的参数';
              }
              else if(lang == 'en'){
                msg='Parameters not supported by IVS'
              }
              else if(lang == 'zhtw'){
                msg='IVS 不支持的參數';
              }
              else{
                msg='IVS 不支持的参数';
              }
              break;
            }
            case 10: {
              if(lang == 'zh'){
                msg='非法的 URL 地址';
              }
              else if(lang == 'en'){
                msg='Illegal URL address'
              }
              else if(lang == 'zhtw'){
                msg='非法的 URL 地址';
              }
              else{
                msg='非法的 URL 地址';
              }
              break;
            }
            case 11: {
              if(lang == 'zh'){
                msg='超过 License 授权最大使用数量';
              }
              else if(lang == 'en'){
                msg='Exceeding the maximum user number of licenses'
              }
              else if(lang == 'zhtw'){
                msg='超過 License 授權最大使用數量';
              }
              else{
                msg='超过 License 授权最大使用数量';
              }
              break;
            }
            case 12: {
              if(lang == 'zh'){
                msg='License 不可用';
              }
              else if(lang == 'en'){
                msg='License is not available'
              }
              else if(lang == 'zhtw'){
                msg='License 不可用';
              }
              else{
                msg='License 不可用';
              }
              break;
            }
            case 13: {
              if(lang == 'zh'){
                msg='视频停止错误';
              }
              else if(lang == 'en'){
                msg='Video stop error'
              }
              else if(lang == 'zhtw'){
                msg='視頻停止錯誤';
              }
              else{
                msg='视频停止错误';
              }
              break;
            }
            case 15: {
              if(lang == 'zh'){
                msg='SDK 打开视频错误';
              }
              else if(lang == 'en'){
                msg='SDK open video error'
              }
              else if(lang == 'zhtw'){
                msg='SDK 打開視頻錯誤';
              }
              else{
                msg='SDK 打开视频错误';
              }
              break;
            }
            case 16: {
              if(lang == 'zh'){
                msg='SDK 没有返回数据';
              }
              else if(lang == 'en'){
                msg='SDK does not have return data'
              }
              else if(lang == 'zhtw'){
                msg='SDK 沒有返回數據';
              }
              else{
                msg='SDK 没有返回数据';
              }
              break;
            }
            case 17: {
              if(lang == 'zh'){
                msg='视频播放端连接数量超过 DASH 服务的最大连接数';
              }
              else if(lang == 'en'){
                msg='The number of video player connections exceeds the maximum number of connections for the DASH service'
              }
              else if(lang == 'zhtw'){
                msg='視頻播放端連接數量超過 DASH 服務的最大連接數';
              }
              else{
                msg='视频播放端连接数量超过 DASH 服务的最大连接数';
              }
              break;
            }
            case 18: {
              if(lang == 'zh'){
                msg='SessionID 已过期';
              }
              else if(lang == 'en'){
                msg='SessionID has expired'
              }
              else if(lang == 'zhtw'){
                msg='SessionID 已過期';
              }
              else{
                msg='SessionID 已过期';
              }
              break;
            }
            case 19: {
              if(lang == 'zh'){
                msg='内存不足';
              }
              else if(lang == 'en'){
                msg='Not enough storage'
              }
              else if(lang == 'zhtw'){
                msg='內存不足';
              }
              else{
                msg='内存不足';
              }
              break;
            }
            case 20: {
              if(lang == 'zh'){
                msg='不支持此功能';
              }
              else if(lang == 'en'){
                msg='The feature is not supported'
              }
              else if(lang == 'zhtw'){
                msg='不支持此功能';
              }
              else{
                msg='不支持此功能';
              }
              break;
            }
            case 21: {
              if(lang == 'zh'){
                msg='内部web服务器不能正常工作';
              }
              else if(lang == 'en'){
                msg='Internal web server is not working properly'
              }
              else if(lang == 'zhtw'){
                msg='內部web服務器不能正常工作';
              }
              else{
                msg='内部web服务器不能正常工作';
              }
              break;
            }
            case 22: {
              if(lang == 'zh'){
                msg='缺少必要参数';
              }
              else if(lang == 'en'){
                msg='Lack of necessary parameters'
              }
              else if(lang == 'zhtw'){
                msg='缺少必要參數';
              }
              else{
                msg='缺少必要参数';
              }
              break;
            }
            case 23: {
              if(lang == 'zh'){
                msg='视频已经打开';
              }
              else if(lang == 'en'){
                msg='The video is already open'
              }
              else if(lang == 'zhtw'){
                msg='視頻已經打開';
              }
              else{
                msg='视频已经打开';
              }
              break;
            }
            case 24: {
              if(lang == 'zh'){
                msg='视频未打开';
              }
              else if(lang == 'en'){
                msg='Video not open'
              }
              else if(lang == 'zhtw'){
                msg='視頻未打開';
              }
              else{
                msg='视频未打开';
              }
              break;
            }
            case 25: {
              if(lang == 'zh'){
                msg='SessionID被占用';
              }
              else if(lang == 'en'){
                msg='SessionID is occupied'
              }
              else if(lang == 'zhtw'){
                msg='SessionID被占用';
              }
              else{
                msg='SessionID被占用';
              }
              break;
            }
            default: {
              if(lang == 'zh'){
                msg='未知的错误';
              }
              else if(lang == 'en'){
                msg='Unknown error'
              }
              else if(lang == 'zhtw'){
                msg='未知的錯誤';
              }
              else{
                msg='未知的错误';
              }
              break;
            }
        }
        return msg;
    },
    /**
     * 获取当天日期
     */
    getCurDate2Str(){
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let day=date.getDate();
        month=month<10?'0'+month:month;
        day=day<10?'0'+day:day;
        let str=`${year}${month}${day}`;
        return str;
    },
    getCurDate2StrBySign(sign){
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let day=date.getDate();
        month=month<10?'0'+month:month;
        day=day<10?'0'+day:day;

        let str='';
        str=`${year}${sign}${month}${sign}${day}`;
        return str;
    },
    getCurTimeStr(){
        let date=new Date();
        let hour=date.getHours();
        let minute=date.getMinutes();
        let second=date.getSeconds();
        hour=hour<10?'0'+hour:hour;
        minute=minute<10?'0'+minute:minute;
        second=second<10?'0'+second:second;
        let str=`${hour}${minute}${second}`;
        return str;
    },
    base64ToBlob(urlData) {
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1] || 'image/jpeg';
        // 去掉url的头，并转化为byte
        var bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);
        
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], {
            type: mime
        });
    },
    piPx() {  
        return new Promise(function (resolve, reject) {  
          window.onload = function () {  
            resolve(BMap)  
          }  
          let script = document.createElement('script');  
          script.type = 'text/javascript';  
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js';  
          script.onerror = reject;  
          document.head.appendChild(script);  
        })  
    },
    init(){
        let self=this;
        let req=window.indexedDB.open('store_db');
        req.onupgradeneeded=e=>{
            let db=req.result;
            /*
            createObjectStore 相当于创建一个表
            "geo" 相当于表名
            keyPath 索引 primary key 
            */
            let obStore=db.createObjectStore('recentstore',{keyPath:'id'});
            obStore.createIndex("storeId","storeId",{unique:false});
            req.result.close();
        }
    },
    add(payload){
        return new Promise((resolve,reject)=>{
            let db=window.indexedDB.open('store_db');
            db.onsuccess=()=>{
                db.result.transaction('recentstore','readwrite')
                .objectStore('recentstore')
                .add(payload);
            };
            db=e=>{
                reject(e);
            };
        });
    },
    get(key){
        return new Promise((resolve,reject)=>{
            let db=window.indexedDB.open('store_db');
            db.onsuccess=()=>{
                let req=db.result.transaction('recentstore','readonly')
                        .objectStore('recentstore').get(key);
                db.result.close();
                req.onsuccess=e=>{
                    resolve(e.target.result);
                };
                req=err=>{
                    reject(err);
                };
            }
            db=e=>{
                reject(e);
            }
        })
    }
}
class indexedDB{
    init(){
        let self=this;
        let req=window.indexedDB.open('store_db');
        req.onupgradeneeded=e=>{
            let db=req.result;
            /*
            createObjectStore 相当于创建一个表
            "geo" 相当于表名
            keyPath 索引 primary key 
            */
            let obStore=db.createObjectStore('recentstore',{keyPath:'id'});
            obStore.createIndex("storeId","storeId",{unique:false});
            req.result.close();
        }
    }
    add(payload){
        return new Promise((resolve,reject)=>{
            let db=window.indexedDB.open('store_db');
            db.onsuccess=()=>{
                db.result.transaction('recentstore','readwrite')
                .objectStore('recentstore')
                .add(payload);
            };
            db=e=>{
                reject(e);
            };
        });
    }
    get(key){
        return new Promise((resolve,reject)=>{
            let db=window.indexedDB.open('store_db');
            db.onsuccess=()=>{
                let req=db.result.transaction('recentstore','readonly')
                        .objectStore('recentstore').get(key);
                db.result.close();
                req.onsuccess=e=>{
                    resolve(e.target.result);
                };
                req=err=>{
                    reject(err);
                };
            }
            db=e=>{
                reject(e);
            }
        })
    }
}
export {indexedDB}
