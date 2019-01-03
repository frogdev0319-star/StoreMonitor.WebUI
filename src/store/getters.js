const getters={
    token:state=>state.user.token,
    name:state=>state.user.name,
    avatar:state=>state.user.avatar,
    introduction:state=>state.user.introduction,
    status:state=>state.user.status,
    roles:state=>state.user.roles,
    setting:state=>state.user.setting
}

export default getters