import { format } from "url";
import ConvertPinyin from '@/common/getpinyin'
export default {

//显示器请求返回信息处理
    handleScreenData(screenList){
        let total=screenList.length;
        let abnomal=0,nomal=0;
        var result=[];
        for(let i=0;i<screenList.length;i++){
            if(screenList[i].mode=='0'){
                abnomal++;
            }else if(screenList[i].mode=='1'){
                nomal++;
            }


        }
        result[0]=total;
        result[1]=abnomal;
        result[2]=nomal;
        return result;


    },
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
    //时间转换为入参
    getParmDate(date){
        var result='';
        let years=date.getFullYear();
        let month=date.getMonth()+1;
        let day=date.getDate();
        let hour=date.getHours();
        let min=date.getMinutes();
        result=years+'-'+month+'-'+day+' '+hour+':'+min+':'+'00';
        return result;
    },
    //数组中时间处理
    timestampToTime(list){
        for (let i=0;i<list.length;i++) {
            list[i].ts=this.getdate(list[i].ts);
            if(list[i].status=='1'){
                list[i].status='插入';
            }
            if(list[i].status=='2'){
                list[i].status='拔出';

            }
        };
        list=Array.reverse(list);
        return list;
    },
    //提取进程数量信息
    getProcessInfo(list){
        var results=[];
        var result=[],result2=[];
          if(list.every(item=>{
            item.IsActive==true;
        }))
        {
            result.forEach(item=>{
            item.showBtn=false;
        })
            results[0]=result;
            results[1]=result2;
            return results;
        }
        else{
            result=list.filter((item)=>{
            return item.IsActive==false;
            })
            result2=list.filter((item)=>{
                return item.IsActive!==false;
            });
            result.forEach(item=>{
                item.showBtn=false;
            })
            result2.forEach(item=>{
                item.showBtn=false;
            })
            results[0]=result;
            results[1]=result2;
            return results;
        }
    },


    //提取异常等级分布
    getExceptRank(ranklist,rankvalue,rankmock){
        rankmock.forEach((item)=>{
            if(item.agentType=='')
                item.agentType='unknown';
        })

        for(let i=0;i<3;i++){
            rankvalue[i].value=0;
        }
        var ranklistcopy=[];

        var obj={rank:0,agentCount:0};
        rankmock.forEach((item,index)=>{
        if(item.rank==2){
            rankvalue[0].value+=item.agentCount;

        }
        else if(item.rank==1){
            rankvalue[1].value+=item.agentCount;
        }
        else if(item.rank==0){
            rankvalue[2].value+=item.agentCount;
        }
        });

        console.log(rankvalue);
        var rank2=rankmock.filter((item)=>{
            return item.rank==2;
        })
        rank2.sort((a,b)=>{
            return b.agentCount-a.agentCount;
        })

        rank2=rank2.slice(0,6);

        for(let i=0;i<rank2.length;i++){
            var obj={};
            obj.agentType=rank2[i].agentType;
            
            obj.data=rankmock.filter((item)=>{
                return item.agentType==rank2[i].agentType;
            });
            ranklistcopy.push(obj);
        }
        var agentTypearr=[];
        var rank2=[],rank1=[],rank0=[];
        for(let i=0;i<ranklistcopy.length;i++){
            for(let j=0;j<ranklistcopy[i].data.length;j++){
                switch (ranklistcopy[i].data[j].rank){
                    case 2: {
                        if(ranklistcopy[i].data[j].rank!=null&&ranklistcopy[i].data[j].rank==2){
                            rank2[i]=ranklistcopy[i].data[j].agentCount;
                        
                        }
                        else rank2[i]=0;
                        break;
                    }
                    case 1: {
                        if(ranklistcopy[i].data[j].rank!=null&&ranklistcopy[i].data[j].rank==1){
                            rank1[i]=ranklistcopy[i].data[j].agentCount;
                        
                        }
                        else rank1[i]=0;
                        break;
                    }
                    case 0: {
                        if(ranklistcopy[i].data[j].rank!=null&&ranklistcopy[i].data[j].rank==0){
                            rank0[i]=ranklistcopy[i].data[j].agentCount;
                        
                        }
                        else rank0[i]=0;
                        break;
                    }
                    default:break;
                }
            }
            agentTypearr.push(ranklistcopy[i].agentType);
        }

        for(let i=0;i<6;i++){
            if(rank0[i]==null){
                rank0[i]=0;
            }
            if(rank1[i]==null){
                rank1[i]=0;
            }
            if(rank0[i]==null){
                rank1[i]=0;
            }
        }

        ranklist[0].data=rank2;
        ranklist[1].data=rank1;
        ranklist[2].data=rank0;
        var result=[];
        result.push(rankvalue);
        result.push(ranklist);
        result.push(agentTypearr);
        console.log();
        return result;
},
//提取类型分布
    getExceptType(typelist,typemock){
        typemock.forEach((item,index)=>{
            switch(item.eventTypeId.substring(0,1)){
                case '2':typelist[2].data[0].value=item.AgentCount;break;
                case '3':typelist[1].data[0].value=item.AgentCount;break;
                case '4':typelist[1].data[1].value=item.AgentCount;break;
                case '5':typelist[2].data[2].value=item.AgentCount;break;
                case '6':typelist[0].data[0].value=item.AgentCount;break;
                case '7':typelist[0].data[1].value=item.AgentCount;break;
                case '8':typelist[0].data[2].value=item.AgentCount;break;
            }

        });
        typelist.forEach((item,index)=>{
            item.titlevalue=0;
            for(let i=0;i<item.data.length;i++){
                item.titlevalue+=item.data[i].value;
            }
        })
        return typelist;
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
    }
}