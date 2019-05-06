import { format } from "url";
import ConvertPinyin from '@/common/getpinyin'
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
        let msg='';
        switch(errorCode){
            case 1: msg='XML/JSON 参数不正确';break;
            case 2: msg='用户名或密码错误';  break;
            case 3: msg='用户不在线'; break;
            case 4: msg='连接 PV6SvrRemote COM 接口出错'; break;
            case 5: msg='请求的 IVS 数据库中不存在'; break;
            case 7: msg='视频请求 DASH 服务器网络出错'; break;
            case 8: msg='用户下线出错'; break;
            case 9: msg='IVS 不支持的参数'; break;
            case 10: msg='非法的 URL 地址'; break;
            case 11: msg='超过 License 授权最大使用数量'; break;
            case 12: msg='License 不可用'; break;
            case 13: msg='视频停止错误'; break;
            case 15: msg='SDK 打开视频错误'; break;
            case 16: msg='SDK 没有返回数据'; break;
            case 17: msg='视频播放端连接数量超过 DASH 服务的最大连接数'; break;
            case 18: msg='SessionID已过期'; break;
            case 19: msg='内存不足'; break;
            case 20: msg='不支持此功能'; break;
            case 21: msg='内部web服务器不能正常工作'; break;
            case 22: msg='缺少必要参数'; break;
            case 23: msg='视频已经打开'; break;
            case 24: msg='视频未打开'; break;
            case 25: msg='SessionID被占用'; break;
            default: msg='未知的错误'; break;
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
