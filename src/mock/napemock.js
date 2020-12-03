import Nape from '@/api/ApiPath';
const Mock = require('mockjs');
var Random = Mock.Random;
const produceData = function() {
  const articles = [];
  for (let i = 0; i < 4; i++) {
    const obj = {
      id: i,
      itemName: '门店形象' + (i + 1),
      itemNum: 2,
      itemData: [
        {
          id: 0,
          name: '店外整洁，无乱堆乱放现象',
          score: '10分',
          description: '店外不得摆放杂物'
        },
        {
          id: 1,
          name: '宣传广告按要求张贴',
          score: '10分',
          description: '需要粘贴在大门口左边的展架上'
        }
      ]
    };
    articles.push(obj);
  }
  const groupName = {
    id: 0,
    name: '现场巡检'
  };
  return {
    articles: articles,
    group: groupName
  };
};

const groupName = function() {
  const articles = [];
  for (let i = 0; i < 3; i++) {
    const obj = {
      id: i,
      name: '巡检类别' + (i + 1)
    };
  }
  return {
    articles: articles
  };
};

const storeList = function() {
  const articles = [];
  for (let i = 0; i < 3; i++) {
    const obj = {};
    obj.id = i;
    switch (i) {
      case 0: obj.name = '西安';
        obj.count = 9;
        break;
      case 1: obj.name = '咸阳';
        obj.count = 1; break;
      case 2: obj.name = '上海';
        obj.count = 3; break;
      default:console.log('error flag!'); break;
    }
    const temp = [];
    for (let j = 0; j < obj.count; j++) {
      const _obj = {};
      _obj.id = j;
      _obj.name = `${obj.name}${j + 1}店`;
      temp.push(_obj);
    }
    obj.store = temp;
    articles.push(obj);
  }
  return {
    articles: articles
  };
};
Mock.mock(Nape.getNapeList, 'get', produceData);
Mock.mock(Nape.getGroupList, 'get', groupName);
Mock.mock(Nape.getStoreList, 'get', storeList);
