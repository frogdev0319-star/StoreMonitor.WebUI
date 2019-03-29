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
            const TokenKey='Admin-Token';
            let itempath='/storemonitor/api/v1.0'
            let hash=window.location.search.substr(1)||window.location.hash.split('?')[1];
            if(hash!=undefined&&hash.length!=0){
                let paramsArray=hash.split('&');
                if(paramsArray.toString().length!=0){
                    let obj={};
                    obj.token=paramsArray[0].substr(paramsArray[0].indexOf('=')+1);
                    obj.userId=paramsArray[1].substr(paramsArray[1].indexOf('=')+1);
                    this.$store.commit('SET_TOKEN',obj.token);
                    setCookie(TokenKey,obj.token);
                    setCookie('UserId',obj.userId);
                }
            }
            window.location.href=window.location.origin+window.location.pathname+'#/home';
            //}
            // else{
            //     this.$router.push('/login');
            // }
        }
    }
}
</script>