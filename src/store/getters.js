import {getCookie} from '@/common/auth'

const getters= {
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  accountChanged: state => state.user.accountChanged,
  isEzviz:state=> state.user.isEzviz,
  authorities:state=>state.user.authorities,
  permission_routes: state => state.user.routes,
}
export default getters
