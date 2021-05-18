import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export default class ReportSetting{
  static getInspectReportTemplateList(params){
    return request({
      url: `${version}/inspect/report/template/list`,
      method: 'get',
      params
    });
  }

  static addInspectReportTeplate(data){
    return request({
      url: `${version}/inspect/report/template/add`,
      method: 'post',
      data
    });
  }


  static deleteInspectReportTeplate(data){
    return request({
      url: `${version}/inspect/report/template/delete`,
      method: 'post',
      data
    });
  }


  static updateInspectReportTeplate(data){
    return request({
      url: `${version}/inspect/report/template/update`,
      method: 'post',
      data
    });
  }
}
