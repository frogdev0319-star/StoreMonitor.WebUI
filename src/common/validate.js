let valid_map=['admin','jingbin','changzhu.wu@advantech.com.cn','axazhang.bo@advantech.com.cn'];
export function isvalidUsername(str){
    return valid_map.indexOf(str.trim())>=0;
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
  }

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

/**
 * validate input
 */
export function validateInput(str){
    var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
    //var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥\\\\……&*（）——|{}【】‘；：”“'。，、？]") 
    //var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥\\\\……&*（）——|{}【】‘；：”“']") 
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~@#￥\\\\&*——|{}【】‘”“']") 
    var pattern=/[@#\$%\^&\*]+/g;
    return pattern.test(str);
}

export function validateIp(ip){
    var pat=/^((25[0-5]|2[0-4]\\d|[1]{1}\\d{1}\\d{1}|[1-9]{1}\\d{1}|\\d{1})($|(?!\\.$)\\.)){4}$/;
    return pat.test(ip);
}

export function validateInspectGroup(str){
    let retMsg='';
    if(validateInput(str)){
        retMsg='当前导入模板中巡检项类别名称中含有非法字符！';
    }
    if(str.trim().length==0){
        retMsg='检查分类列至少含有一项';
    }
    return retMsg;
}
export function validateInspectItem(str){
    let retMsg='';
    if(validateInput(str)){
        retMsg='当前导入模板中巡检项名称中含有非法字符';
    }
    if(str.trim().length>25){
        retMsg='当前导入模板中巡检项名称不能超过25个字';
    }
    return retMsg;
}