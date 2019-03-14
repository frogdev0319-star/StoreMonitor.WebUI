<script>
import {isLoginIn} from '@/api/login'
import { mapMutations } from 'vuex'
import {setCookie} from '@/common/auth'
export default{
    name:'AuthRedirect',
    created(){
        this.routerPage();
    },
    methods:{
        isLoginIn(){
            let self=this;
            return new Promise((resolve,reject)=>{
                isLoginIn().then(res=>{
                    console.log(res);
                    resolve(res);
                })
            }).catch(err=>{
                console.log(err);
            })
        },
        async routerPage(){
            let data=await this.isLoginIn();
            const TokenKey='Admin-Token';
            console.log(data);
            if(data!=undefined){
                let itempath='/storemonitor/api/v1.0'
                const hash=window.location.hash.slice(3);
                let paramsArray=hash.slice(3).split('&');
                if(paramsArray.toString().length!=0){
                    let obj={};
                    obj.token=paramsArray[0].substr(paramsArray[0].indexOf('=')+1);
                    obj.userId=paramsArray[1].substr(paramsArray[1].indexOf('=')+1);
                    this.$store.commit('SET_TOKEN',obj.token);
                    setCookie(TokenKey,obj.token);
                    setCookie('UserId',obj.userId);
                }
                window.location.href=window.location.origin+window.location.pathname+'#/home';
            }
        }
    }
}
</script>