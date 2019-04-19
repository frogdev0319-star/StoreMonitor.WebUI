/**
 * mock.js 文件，模拟api的数据返回
 * 可以使用node.js 在前台写api.
 */
import axios from 'axios'
import Nape from '@/api/ApiPath'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

export const getNapeList=()=>{
    return axios.get(Nape.getNapeList,{},(res)=>{
        console.log('接收到数据了吗?');
        console.log(res);
    })
}