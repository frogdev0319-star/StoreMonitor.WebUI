import request from '@/common/request';
import Environment from '@/common/environment';
import { getToken } from '@/common/auth.js';
import axios from 'axios';

const version = Environment.VERSION;

export const getSkywatchAccountList = params => {
  return request({
    url: `${version}/skywatch/account/list`,
    method: 'post',
    params
  })
};

export const deleteSkywatchAccount = data => {
  return request({
    url: `${version}/skywatch/account/delete`,
    method: 'post',
    data
  });
};

export const skywatchAccountAuthorize = params => {
  return request({
    url: `${version}/skywatch`,
    method: 'get',
    params
  })
};

export const getSkywatchDeviceList = data => {
  return request({
    url: `${version}/skywatch/device/list`,
    method: 'post',
    data
  });
};

export const getAvailableSkywatchDevice = params => {
  return request({
    url: `${version}/skywatch/device/unused/list`,
    method: 'get',
    params
  })
};

export const deleteSkywatchDevice = data => {
  return request({
    url: `${version}/skywatch/device/delete`,
    method: 'post',
    data
  });
};

export const deleteSkywatchChannel = data => {
  return request({
    url: `${version}/skywatch/device/channel/delete`,
    method: 'post',
    data
  });
};


export const addSkywatchDevice = data => {
  return request({
    url: `${version}/skywatch/device/add`,
    method: 'post',
    data
  });
};

export const addSkywatchChannel = data => {
  return request({
    url: `${version}/skywatch/device/channel/add`,
    method: 'post',
    data
  });
};

export const updateSkywatchDevice = data => {
  return request({
    url: `${version}/skywatch/device/update`,
    method: 'post',
    data
  });
};

export const updateSkywatchChannel = data => {
  return request({
    url: `${version}/skywatch/device/channel/update`,
    method: 'post',
    data
  });
};

export const getPlaylistInfo = params => {
  return request({
    url: `${version}/beseye/playlist`,
    method: 'get',
    params
  });
};

export const getSkywatchApiKey = params => {
  return request({
    url: `${version}/skywatch/token`,
    method: 'get',
    params
  });
};

const instance = axios.create({
  timeout: 30 * 1000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});


export const getLiveStream = (data, url) => {
  return instance({
    method: 'get',
    url: url,
    params: data
  }).then(res => {
    if (res.status === 200) {
      return res.data;
    } else {
      return Promise.reject(err);
    }
  })
    .catch(err => {
      return Promise.reject(err);
    });
}


export const getRecordList = (data, url) => {
  return instance({
    method: 'get',
    url: url,
    params: data
  }).then(res => {
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(res);
    }
  })
    .catch(err => {
      throw new Error(err);
    });
}


export const getRecordUrl = (data, url) => {
  return instance({
    method: 'get',
    url: url,
    params: data
  }).then(res => {
    if (res.status === 200) {
      return res.data;
    } else {
      return Promise.reject(err);
    }
  })
    .catch(err => {
      return Promise.reject(err);
    });
}
