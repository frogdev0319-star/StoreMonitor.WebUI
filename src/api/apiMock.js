import axios from 'axios';
import Nape from '@/api/ApiPath';

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

export const getNapeList = () => {
  return axios.get(Nape.getNapeList, {}, (res) => {
    console.log(res);
  });
};
