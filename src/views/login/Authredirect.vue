<script>
import { mapMutations } from 'vuex'
import {setCookie} from '@/common/auth'
export default{
    name:'AuthRedirect',
    created(){
        this.routerPage();
    },
    methods:{
        async routerPage(){
          let self = this;
            const TokenKey='Admin-Token';
            let itempath='/storemonitor/api/v1.0'
            let hash=window.location.search.substr(1)||window.location.hash.split('?')[1];
            if(hash!=undefined&&hash.length!=0){
                let paramsArray=hash.split('&');
                if(paramsArray.toString().length!=0){
                  let obj = self.queryURL(hash);
                  console.log(obj);
                    // obj.token=paramsArray[0].substr(paramsArray[0].indexOf('=')+1);
                    // obj.userId=paramsArray[1].substr(paramsArray[1].indexOf('=')+1);
                    // obj.appKey =paramsArray[2].substr(paramsArray[2].indexOf('=')+1);
                    // //obj.lang=paramsArray[3].substr(paramsArray[3].indexOf('=')+1);
                    this.$store.commit('SET_TOKEN',obj.token);
                    if(obj.ezvizProtocol){
                      this.$store.commit('SET_ISEZVIZ',true);
                      setCookie('isEzviz',true);
                    }
                    else{
                      this.$store.commit('SET_ISEZVIZ',false);
                      setCookie('isEzviz',false);
                    }
                    setCookie(TokenKey,obj.token);
                    setCookie('UserId',obj.userId);
                    let lang = 'en'
                    if(obj.lang === 'zh-CN'){
                      lang = 'zh'
                    }
                    else if(obj.lang ==='en-US'){
                      lang = 'en'
                    }
                    else if(obj.lang === 'zh-TW'){
                      lang = 'zhtw'
                    }
                    else{
                      lang = 'en'
                    }
                    setCookie('lang', lang)
                }
            }
            window.location.href=window.location.origin+window.location.pathname+'#/home';
            //}
            // else{
            //     this.$router.push('/login');
            // }
        },
        queryURL(hashValue){
          let params = hashValue.split("&");
          let obj = {};//声明对象
          for(var i=0;i<params.length;i++){
            var param = params[i].split("=");
            obj[param[0]] = param[1];//为对象赋值
          }
          return obj;
      }
    }
}
</script>
