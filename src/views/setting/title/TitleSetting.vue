<template>
  <div class="setting-container">
    <div class="basic-info">
      <div class="title">
        <div class="title-info">
          <span>{{$t('titleView.titleSetting')}}</span>
        </div>

        <div class="title-save">
          <el-button class="save-button" size="mini" type="primary" @click="saveBasicInfo">{{$t('titleView.save')}}</el-button>
        </div>
      </div>
      <div class="basic-information">
        <el-form :model="infoForm" :rules="rules" ref="infoForm" label-position="left" label-width="120px" class="infoForm">
          <el-form-item :label="$t('titleView.titleName')" prop="title">
            <el-input v-model="infoForm.title" style="width: 20%;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('titleView.titleCate')" prop="roleId">
            <el-radio-group v-model="infoForm.roleId" :disabled="isAdd?false : true">
              <el-radio  v-for="(item, index) in roleList" :label="item.value" :key="index">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('titleView.comment')" prop="comment" class="comment-class">
            <label slot="label" class="comment-label">{{$t('titleView.comment')}}</label>
              <el-input v-model="infoForm.comment" style="width: 100%;" type="textarea"  class="role-comment" @input="commentChange" :autosize="{minRows: 2, maxRows: 4}" @blur="notShowInputRuleTips"></el-input>
            <span class="text" style="float: right;color: #909399;">{{curLength}}/200</span>
            <span class="rules" v-if="commentRuletip">{{$t('titleView.commentRuletip')}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="role-setting">
      <div class="setting-title">
        <span>{{$t('titleView.roleSetting')}}</span>
      </div>
      <div class="role-list">
          <el-scrollbar style="height:100%;" id="el-menuscrollbar">
            <div class="role-group" v-for="(item,index) in roleNameList" :key="index" v-show="item.disabled == false">
              <div class="role-all-checkbox">
                <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="(val)=>checkAllChildrenRole(index, val)"></el-checkbox>
                <span class="group-name">{{item.roleName}}</span>
              </div>
              <div class="role-content">
                <div :class="lang=='en'? 'en-role-detail': 'role-detail'" v-for="(_item,_index) in item.children" :key="_index" v-show="_item.disabled == false || (_item.disabled == true && _item.checked == true)">
                  <el-checkbox v-model="_item.checked" :disabled="_item.disabled" @change="(val)=>checkParentRole(index, val)"></el-checkbox>
                  <span class="role-name">{{_item.roleName}}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
  import filterString from '@/common/filterString.js'
  import {titleRESTful} from '@/api/index'
  import PermissionHelper from "../../../api/PermissionHelper";

  export default {
        name: "titleSetting",
      data(){
          const validateTitle=(rule,value,callback)=>{
            let self = this;
            if(value == undefined){
              return callback(new Error(self.$t('titleView.enterTitleName')))
            }
            else{
              const reg = /^[A-Za-z\u4e00-\u9fa5]{1,20}$/
              console.log(reg.test(value))
              let commentLength = filterString.getContentLength(value)
              if (reg.test(value) && commentLength <=20) {
                //let titleList = JSON.parse(sessionStorage.getItem('titleList'));
                if(self.isAdd){
                  // add title
                  if(self.titleList.includes(value)){
                    return callback(new Error(self.$t('titleView.titleExist')))
                  }
                  else{
                    callback()
                  }
                }
                else{
                  //update title
                  let oldTitleName = JSON.parse(sessionStorage.getItem('titleInfo')).title;
                  if(value == oldTitleName){
                    callback()
                  }
                  else{
                    if(self.titleList.includes(value)){
                      return callback(new Error(self.$t('titleView.titleExist')))
                    }
                    else{
                      callback()
                    }
                  }
                }
              } else {
                return callback(new Error(self.$t('titleView.titleValidateInfo')))
              }
            }
          }
          return{
            varyWindowHeight:window.innerHeight,
            commentRuletip:false,
            infoForm:{
              title: '',
              roleId: 1,
              comment: '',
              authorities: []
            },
            rules: {
              title: [
                { required: true, validator:validateTitle, trigger: 'blur' },
              ],
              roleId: [
                { required: true, trigger: 'blur' },
              ]
            },
            roleList:[
              {
                label: this.$t('titleView.roleId1Title'),
                value: 1,
              },
              {
                label: this.$t('titleView.roleId2Title'),
                value: 2,
              },
              {
                label: this.$t('titleView.roleId3Title'),
                value: 3,
              },
              {
                label: this.$t('titleView.roleId4Title'),
                value: 4,
              }
            ],
            curLength: 0,
            roleNameList:[
              {
                roleName: this.$t('route.overview'),
                checked: false,
                disabled: false,
                children:[
                  {
                    roleName: this.$t('route.patrolOverview'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.eventOverview'),
                    checked: false,
                    disabled: false,
                  },
                ]
              },
              {
                roleName: this.$t('route.patrolShop'),
                checked: false,
                disabled: false,
                children:[
                  {
                    roleName: this.$t('route.remotePatrol'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('overview.onsitePatrol'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.reports'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.patrolPlan'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.storeMonitor'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.transactionMonitor'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.storeChecking'),
                    checked: false,
                    disabled: true,
                  },
                  {
                    roleName: this.$t('route.customers'),
                    checked: false,
                    disabled: false,
                  }
                ]
              },
              {
                roleName: this.$t('route.eventManage'),
                checked: false,
                disabled: false,
                children:[
                  {
                    roleName: this.$t('eventView.handling'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('eventView.closing'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('eventView.adding'),
                    checked: false,
                    disabled: false,
                  }
                ]
              },
              {
                roleName: this.$t('route.statisticalAna'),
                checked: false,
                disabled: false,
                children:[
                  {
                    roleName: this.$t('route.patrolAppraisalStat'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.patrolItemsStat'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.eventStat'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.supervisorStat'),
                    checked: false,
                    disabled: false,
                  }
                ]
              },
              {
                roleName: this.$t('route.systemSetting'),
                checked: false,
                disabled: false,
                children:[
                  {
                    roleName: this.$t('route.inspectSetting'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.deviceManage'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.storeManage'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.scheduleManage'),
                    checked: false,
                    disabled: false,
                  },
                  {
                    roleName: this.$t('route.titleManage'),
                    checked: false,
                    disabled: false,
                  }
                ]
              }
            ],
            tempRoleNameList: [],
            authorityInfoLists:[],
            isAdd: this.$route.params.isAdd,
            lang: this.$i18n.locale,
            titleList: JSON.parse(sessionStorage.getItem('titleList'))
          }

      },
      watch:{
        'infoForm.roleId'(newValue, old){
          let self = this;
          console.log(newValue);
          console.log(self.tempRoleNameList);
          if(self.isAdd){
            self.roleNameList = self.tempRoleNameList;
            console.log(self.roleNameList)
            self.roleNameList.forEach(item=>{
              item.checked = false;
              item.children.forEach(_item=>{
                _item.checked = false;
                _item.disabled = false;
              })
            })
            self.getAvailableAuthority();
          }
        }
      },
      methods:{
        commentChange(val){
          let self = this;
          let comment = filterString.all(val,200);
          let commentLength = filterString.getContentLength(comment)
          self.curLength = commentLength;
          self.infoForm.comment = comment;
          let length = filterString.getContentLength(val);
          console.log(comment,length);
          if(length>200){
                this.commentRuletip=true
            }else{
                this.commentRuletip=false
            }
        },
        notShowInputRuleTips(){
          this.commentRuletip=false
        },
        saveBasicInfo(){
          let self = this;
          self.$refs['infoForm'].validate(async (valid) => {
            if (valid) {
              self.getSelectedAuthorities();
              if(self.isAdd){
                self.addBasicInformation().then(res=>{
                  console.log(res);
                  if(res.errCode == 0){
                    self.notify(self.$t('titleView.saveSuss'),'success',3000);
                    self.titleList.push(self.infoForm.title);
                  }
                  else{
                    self.notify(self.$t('titleView.saveFail'),'warning',3000);
                  }
                }).catch(error=>{
                });
              }
              else{
                self.updateBasicInformation().then(res=>{
                  console.log(res);
                  if(res.errCode == 0){
                    self.notify(self.$t('titleView.saveSuss'),'success',3000);
                  }
                  else{
                    self.notify(self.$t('titleView.saveFail'),'warning',3000);
                  }
                }).catch(error=>{
                });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        getSelectedAuthorities(){
          let self = this;
          self.infoForm.authorities = [];
          let decAuthorityNum = Math.pow(2, 32);
          self.roleNameList.forEach((item, index)=>{
            let tempAuthorityNum = Math.pow(2, index) * decAuthorityNum;
            item.children.forEach((_item, _index)=>{
              if(_item.checked){
                tempAuthorityNum += Math.pow(2, _index);
              }
            })
            console.log(tempAuthorityNum);
            self.infoForm.authorities.push(tempAuthorityNum);
          })
        },
        addBasicInformation(){
          let self = this;
          let params = self.infoForm;
          console.log(params);
          return new Promise((resolve,reject)=>{
            titleRESTful.addUserTitle(params).then(result=>{
              resolve(result);
            })
          })
        },
        updateBasicInformation(){
          let self = this;
          let params = self.infoForm;
          console.log(params);
          return new Promise((resolve,reject)=>{
            titleRESTful.updateUserTitle(params).then(result=>{
              resolve(result);
            })
          })
        },
        getAuthorityInfoList(){
          let self = this;
          new Promise((resolve,reject)=>{
            titleRESTful.getRoleInfo().then(result=>{
              resolve(result);
            })
          }).then(res=>{
            console.log(res)
            self.authorityInfoLists = res.data;
            self.getAvailableAuthority();
          })
        },
        getAvailableAuthority(){
          let self = this;
          if(!self.isAdd){
            let data = sessionStorage.getItem('titleInfo');
            console.log(JSON.parse(data));
            self.infoForm = JSON.parse(data);
            console.log(self.infoForm);
            let comment = filterString.all(self.infoForm.comment,200);
            console.log(comment);
            let commentLength = filterString.getContentLength(comment)
            self.curLength = commentLength;
          }
          let roleId = self.infoForm.roleId;
          console.log(roleId)
          PermissionHelper.setData(self.authorityInfoLists[roleId-1].availableAuth)

          self.roleNameList[0].children[0].disabled = PermissionHelper.enableRemoteOverview() ? false : true;
          self.roleNameList[0].children[1].disabled = PermissionHelper.enableEventOverview() ? false : true;

          self.roleNameList[1].children[0].disabled = PermissionHelper.enableRemoteInspect() ? false :  true;
          self.roleNameList[1].children[1].disabled = PermissionHelper.enableLocalInspect() ? false :  true;
          self.roleNameList[1].children[2].disabled = PermissionHelper.enableInspectReport() ? false :  true;
          self.roleNameList[1].children[3].disabled = PermissionHelper.enablePatrolTask() ? false :  true;
          self.roleNameList[1].children[4].disabled = PermissionHelper.enableStoreMonitor() ? false :  true;
          self.roleNameList[1].children[5].disabled = PermissionHelper.enableTransactionPatrol() ? false :  true;
          self.roleNameList[1].children[6].disabled = PermissionHelper.enableStorePointCheck() ? false :  true;
          self.roleNameList[1].children[7].disabled = PermissionHelper.enableCustomers() ? false : true;

          self.roleNameList[2].children[0].disabled = PermissionHelper.enableEventHandle() ? false : true;
          self.roleNameList[2].children[1].disabled = PermissionHelper.enableEventClose() ? false : true;
          self.roleNameList[2].children[2].disabled = PermissionHelper.enableEventAdd() ? false : true;

          self.roleNameList[3].children[0].disabled = PermissionHelper.enablePatrolEvaStatistics() ? false: true;
          self.roleNameList[3].children[1].disabled = PermissionHelper.enableInspectStatistics() ? false: true;
          self.roleNameList[3].children[2].disabled = PermissionHelper.enableEventStatistics() ? false: true;
          self.roleNameList[3].children[3].disabled = PermissionHelper.enableSupervisionEffStatistics() ? false: true;

          self.roleNameList[4].children[0].disabled = PermissionHelper.enablePatrolSetting() ? false: true;
          self.roleNameList[4].children[1].disabled = PermissionHelper.enableDeviceSetting() ? false: true;
          self.roleNameList[4].children[2].disabled = PermissionHelper.enableStoreSetting() ? false: true;
          self.roleNameList[4].children[3].disabled = PermissionHelper.enableScheduleSetting() ? false: true;
          self.roleNameList[4].children[4].disabled = PermissionHelper.enableTitleSetting() ? false: true;

          self.getRequiredAuthority();
        },

        getRequiredAuthority(){
          //get required Authority of every title
          let self = this;
          let roleId = self.infoForm.roleId;
          if(roleId < 4){
            // inspect report
            self.roleNameList[1].children[2].checked = true;
            self.roleNameList[1].children[2].disabled = true;
            // store monitor
            self.roleNameList[1].children[4].checked = true;
            self.roleNameList[1].children[4].disabled = true;
            //close event
            self.roleNameList[2].children[1].checked = true;
            self.roleNameList[2].children[1].disabled = true;
            //
            self.roleNameList[4].children[3].checked = true;
            self.roleNameList[4].children[3].disabled = false;
          }
          else if(roleId == 4){
            self.roleNameList[1].children[0].disabled = false;
            self.roleNameList[1].children[1].disabled = false;
            // inspect report
            self.roleNameList[1].children[2].checked = true;
            self.roleNameList[1].children[2].disabled = true;
            // 
            self.roleNameList[1].children[3].checked = true;
            self.roleNameList[1].children[3].disabled = false;
            // store monitor
            self.roleNameList[1].children[4].checked = true;
            self.roleNameList[1].children[4].disabled = true;

            //handle event
            self.roleNameList[2].children[0].checked = true;
            self.roleNameList[2].children[0].disabled = true;
          }
          console.log(self.roleNameList)
          self.roleNameList.forEach(item=>{
            let disabledNum = 0;
            item.children.forEach(_item=>{
              if(_item.disabled && !_item.checked){
                disabledNum++
              }
            })
            if(disabledNum == item.children.length){
              item.disabled = true;
            }
            else{
              item.disabled = false;
            }
          })
          //show the maxmium roleList
          if(self.isAdd){
            self.roleNameList.forEach(item=>{
              item.checked = item.disabled ? false : true;
              item.children.forEach(_item=>{
                if(!_item.checked){
                  _item.checked = _item.disabled ? false : true;
                }
              })
            })
            if(roleId == 4){// 门店运营时，远程巡检和现场巡检取消默认选中
              self.roleNameList[1].children[0].checked = false;
              self.roleNameList[1].children[0].disabled = false;
              self.roleNameList[1].children[1].checked = false;
              self.roleNameList[1].children[1].disabled = false;
              self.roleNameList[1].children[7].checked = false;
              self.roleNameList[1].children[7].disabled = false;
            }else{
              //这里添加退回权限
            }
          }
          else{
            // check has selected roles
            PermissionHelper.setData(self.infoForm.authorities)
            console.log(self.infoForm.authorities)
            self.roleNameList[0].children[0].checked = PermissionHelper.enableRemoteOverview() ? true : false;
            self.roleNameList[0].children[1].checked = PermissionHelper.enableEventOverview() ? true : false;

            self.roleNameList[1].children[0].checked = PermissionHelper.enableRemoteInspect() ? true : false;
            self.roleNameList[1].children[1].checked = PermissionHelper.enableLocalInspect() ? true : false;
            self.roleNameList[1].children[2].checked = PermissionHelper.enableInspectReport() ? true : false;
            self.roleNameList[1].children[3].checked = PermissionHelper.enablePatrolTask() ? true : false;
            self.roleNameList[1].children[4].checked = PermissionHelper.enableStoreMonitor() ? true : false;
            self.roleNameList[1].children[5].checked = PermissionHelper.enableTransactionPatrol() ? true : false;
            self.roleNameList[1].children[6].checked = PermissionHelper.enableStorePointCheck() ? true : false;
            self.roleNameList[1].children[7].checked = PermissionHelper.enableCustomers() ? true : false;

            self.roleNameList[2].children[0].checked = PermissionHelper.enableEventHandle() ? true : false;
            self.roleNameList[2].children[1].checked = PermissionHelper.enableEventClose() ? true : false;
            self.roleNameList[2].children[2].checked = PermissionHelper.enableEventAdd() ? true : false;

            self.roleNameList[3].children[0].checked = PermissionHelper.enablePatrolEvaStatistics() ? true : false;
            self.roleNameList[3].children[1].checked = PermissionHelper.enableInspectStatistics() ? true : false;
            self.roleNameList[3].children[2].checked = PermissionHelper.enableEventStatistics() ? true : false;
            self.roleNameList[3].children[3].checked = PermissionHelper.enableSupervisionEffStatistics() ? true : false;

            self.roleNameList[4].children[0].checked = PermissionHelper.enablePatrolSetting() ? true : false;
            self.roleNameList[4].children[1].checked = PermissionHelper.enableDeviceSetting() ? true : false;
            self.roleNameList[4].children[2].checked = PermissionHelper.enableStoreSetting() ? true : false;
            self.roleNameList[4].children[3].checked = PermissionHelper.enableScheduleSetting() ? true : false;
            self.roleNameList[4].children[4].checked = PermissionHelper.enableTitleSetting() ? true : false;
          }
          self.roleNameList.forEach(item=>{
            let childrenMustNum = 0;
            let childrenCheckedNum = 0;
            let childrenUncheckedNum = 0;
            let childrenNoAuthorityNum = 0;
            item.children.forEach(_item=> {
              if(_item.disabled){
                _item.checked ? childrenMustNum++ : childrenNoAuthorityNum ++;
              }
              else{
                _item.checked ? childrenCheckedNum++ : childrenUncheckedNum ++;
              }
            })
            if( childrenMustNum + childrenNoAuthorityNum + childrenCheckedNum == item.children.length )  {
              item.checked = true;
            }
            else{
              item.checked = false;
            }
          })
          // self.roleNameList.forEach((item,index)=>{
          //   let parentDisable = self.roleNameList[index].disabled;
          //   let childrenCheckedNum = 0;
          //   let childrenDisableNum = 0;
          //   item.children.forEach(_item=>{
          //     if(_item.checked){
          //       childrenCheckedNum++;
          //     }
          //     else if(_item.disabled){
          //       childrenDisableNum++;
          //     }
          //   })
          //   let sumCheckAndDis = childrenCheckedNum + childrenDisableNum;
          //   if(childrenDisableNum== item.children.length){
          //     item.disabled = true;
          //   }
          //   if(sumCheckAndDis == item.children.length){
          //     item.checked = true;
          //   }
          //   // if(sumCheckAndDis == item.children.length && !parentDisable){
          //   //   if(childrenDisableNum > 0){
          //   //     item.disabled = true;
          //   //     item.checked = false;
          //   //   }
          //   //   else{
          //   //     item.disabled = false;
          //   //     item.checked = true;
          //   //   }
          //   // }
          // })
        },
        checkAllChildrenRole(index, val){
          let self=this;
          console.log(index)
          console.log(val)
          self.roleNameList[index].children.forEach(item=>{
            if(!item.disabled){
              item.checked=val;
            }
          })
        },
        checkParentRole(index, val){
          console.log(index)
          console.log(val)
          let self = this;
          let parentDisable = self.roleNameList[index].disabled;
          let childrenCheckedNum = 0;
          let childrenDisableNum = 0;
          self.roleNameList[index].children.forEach(item=>{
            if(item.checked){
              childrenCheckedNum++;
            }
            else if(item.disabled){
              childrenDisableNum++;
            }
          })
          let sumCheckAndDis = childrenCheckedNum + childrenDisableNum;
          if(sumCheckAndDis == self.roleNameList[index].children.length && !parentDisable){
            if(childrenDisableNum > 0){
              self.roleNameList[index].disabled = false;
              self.roleNameList[index].checked = true;
            }
            else{
              self.roleNameList[index].disabled = false;
              self.roleNameList[index].checked = true;
            }
          }
          else{
            self.roleNameList[index].disabled = false;
            self.roleNameList[index].checked = false;
          }
          if(self.infoForm.roleId == 3 && index == 1){
            // 远程巡检/现场巡检选中，巡检计划默认选中，不允许取消
            let ifChecked = self.roleNameList[index].children[0].checked || self.roleNameList[index].children[1].checked;
            if(ifChecked){
              self.roleNameList[index].children[3].checked = true;
              self.roleNameList[index].children[3].disabled = true;
            }
            else{
              self.roleNameList[index].children[3].disabled = false;
            }
          }
        },
        notify(msg,type,time) {
          this.$message({
            message: msg,
            type: type,
            duration:time
          });
        },
      },
      mounted(){
          let self = this;
          self.tempRoleNameList = JSON.parse(JSON.stringify(self.roleNameList));
          self.getAuthorityInfoList();
      }
    }
</script>

<style scoped lang="scss">
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $color: #606266;
  $black:#182752;

  .setting-container{
    height: calc(100vh - 80px - 45px - calc(60/1920*100vw));
    display: flex;
    flex-direction: column;
    border: 1px solid $border;
    background-color: #fff;
    .basic-info{
      .title{
        height: 70px;
        line-height: 70px;
        padding-left: calc(40/1920*100vw);
        padding-right: calc(25/1920*100vw);
        margin-bottom: 25px;
        font-size: calc(20/1920*100vw);
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $border;
        .title-info{
          color: $color;
        }
        .title-save{
          .save-button{
            width: calc(130/1920*100vw);
            vertical-align: middle;
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            padding: 0 0;
          }
        }
      }
      .basic-information{
        text-align: left;
        margin-left: calc(25/1920*100vw);
        margin-right: calc(25/1920*100vw);
        padding-left: calc(15/1920*100vw);
        border-bottom: 1px solid $border;
        .rules{
            font-size: 10px;
            line-height: 20px;
            color: #ff2400;
            display: block;
        }
        .comment-class .el-form-item__label:before{
            content: ' ';
            margin-right: 4px;
        }
        /deep/ .el-form-item__label{
          font-size: calc(14/1920*100vw);
        }
        /deep/ .el-radio__label{
          font-size: calc(14/1920*100vw);
        }
      }
    }
    .role-setting{
      flex-grow: 1;
      margin-left: calc(25/1920*100vw);
      margin-right: calc(25/1920*100vw);
      margin-bottom: 25px;
      text-align: left;
      height: calc(100% - 303px);
      .setting-title{
        padding-left: calc(15/1920*100vw);
        font-size: calc(16/1920*100vw);
        height: 70px;
        line-height: 70px;
      }
      .role-list{
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        color: $black;
        height: calc(100% - 70px);
        .role-group{
          width: 60%;
          margin-top: 25px;
          margin-bottom: 25px;
          .role-all-checkbox{
            margin-left: calc(20/1920*100vw);
            .group-name{
              margin-left: calc(15/1920*100vw);
              font-size: calc(14/1920*100vw);
              font-weight: bold;
            }
          }
          .role-content{
            margin-left: calc(50/1920*100vw);
            overflow: hidden;
            .role-detail{
              width: auto;
              margin-left:calc(15/1920*100vw);
              margin-top: 15px;
              width: calc(180/1920*100vw);
              min-width: 140px;
              float: left;
              .role-name{
                margin-left:calc(15/1920*100vw);
                font-size: calc(14/1920*100vw);
              }
            }
            .en-role-detail{
              width: auto;
              min-width:calc(320/1920*100vw);
              margin-left:calc(15/1920*100vw);
              margin-top: 15px;
              float: left;
              .role-name{
                margin-left:calc(15/1920*100vw);
                font-size: calc(14/1920*100vw);
              }
            }
          }
        }
      }
    }

  }
</style>
<style>
  .infoForm .el-radio__input.is-checked + .el-radio__label{
    color: #606266;
  }
  .infoForm .el-form-item:nth-last-child(1){
    margin-bottom: 0;
  }
  .role-group .el-checkbox{
    margin-right: 0;
  }
  .role-group /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color:#f31d65 ;
    border-color: #f31d65;
  }
  .comment-label::before{
    content: '*';
    margin-right: 4px;
    visibility: hidden;
  }
  .role-list #el-menuscrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .role-comment .el-textarea__inner{
    font-family: Roboto, Arial, 'Microsoft YaHei','Microsoft JhengHei',SimHei
  }
</style>
