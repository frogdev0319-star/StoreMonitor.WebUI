<template>
    <el-row class="el-storeEdit-content">
        <el-col :span="24" class="storeEdit-header">
            <div class="store-title ">
                <span>{{storeTitle}}</span>
                <el-button @click="submitData"  class="sub-btn" :size="varyWindowWidth>1680?'small':'mini'" type='primary' :disabled="scheduleData.length == 0? true : false">{{generateStoreLang('mySubmit')}}</el-button>
            </div>
            <div class="store-info">
              <strong style="margin-right:20px;">{{generateStoreLang('solver')}}</strong><span style="min-width:100px;display:inline-block;"><el-input v-model="userName" disabled size="mini" class='input'></el-input></span>
                <strong style="margin-right:20px;">{{generateStoreLang('contact')}}</strong>
              <span style="min-width:100px;display:inline-block;"><el-input v-model="phone" disabled size="mini" style="" class='input'></el-input></span>
                <span style="font-size:14px;font-weight:bold;">{{generateStoreLang('bindInspectList')}}</span>
                <span style="font-size:14px; display:inline-block;"><el-input v-model="curTag" disabled size="mini" style="" class='input'></el-input></span>
              <span style="margin-right:20px;"><strong>{{generateStoreLang('supervisor')}}</strong></span>
              <span style="min-width:100px;display:inline-block;">
                <el-input v-model="supervisorName" disabled size="mini" class='input'></el-input></span>
            </div>
            <!-- <div class="store-handle">
              <el-col :span="24" class="header-details1">
                <span class="choice-store"><i class="iconfont icon-tishi1"></i>{{generateStoreLang('bindSchedule')}}<span class="storename-str" style="margin-left:20px;">{{schedule}}</span></span>
              </el-col>
            </div> -->
        </el-col>
        <el-col :span="24" class="storeEdit-content" :style="{'min-height':emptyContentHeight+'px'}">
            <el-tabs v-model="activeName" @tab-click="handleClick" id="patrltabs-content">
                <el-tab-pane v-for="(item,index) in elTableData" :key="index" :label="item.label" ></el-tab-pane>
            </el-tabs>
            <div class="el-table-title tabTitle">
                <span class="name-title">{{generateStoreLang('patrolName')}}</span>
                <span class="schedule-title">{{generateStoreLang('bindChanel')}}</span>
            </div>
            <!-- <div v-if="scheduleData.length!=0"> -->
                <div class="el-table-data" v-for="(item,index) in scheduleData" :key="index" >
                    <span class="grouptitle">
                        {{item.napeName}}（{{item.napeNum}}）
                    </span>
                    <div class="schedule-data">
                        <div v-for="(_item,_index) in item.itemData" :key="_index" :class="!_item.isClick?'noraml-color':'active-color'"
                        class="schedule-detials" style="overflow:hidden;" @click="clickItem(_item,_index)">
                            <span class="nape-title">
                                {{`${_index+1}. ${_item.subject}`}}
                            </span>
<!--                            <el-select v-model="_item.channelvalue" size="mini"  @focus="clickItem(_item,_index)" multiple  collapse-tags>-->
<!--                                <el-option-->
<!--                                v-for="item in alleList"-->
<!--                                :key="item.name"-->
<!--                                :label="item.name"-->
<!--                                :value="item.name">-->
<!--                                </el-option>-->
<!--                            </el-select>-->
                          <limit-select :selected="_item.channelvalue" :options="alleList" :inputSize="`mini`"
                                        @changeInput="changeDeviceId($event, _item)"  @changeIfSelect="changeSelect($event, _item,_index)" class="nape-value"></limit-select>
                        </div>
                    </div>
                </div>
            <!-- </div> -->
            <!-- <div class="empty-text" v-else>
            </div> -->
        </el-col>
    </el-row>
</template>

<script>
import api from '@/api/index'
import {getUserInfo} from '@/api/login'
import {getDeviceList} from '@/api/device'
import {checkOutInspectItem,bindInspectItem, checkOutInspectItemV3, bindInspectItemV2, unbindInspectItemV2} from '@/api/inspect'
import {updateStoreInfo} from '@/api/store'
import {generateStoreLang} from '@/api/i18n'
import LimitSelect from "../../../components/LimitSelect";
export default {
    name:'EditStoreVue',
    components:{
      LimitSelect
    },
    data(){
        return{
            elTableData:[{label:'远程巡检一'},{label:'远程巡检二'},{label:'远程巡检三'},{label:'远程巡检四'},{label:'远程巡检五'}],
            activeName:'',
            curTag:'远程巡检',
            storeTitle:'',
            store:{},
            storeLinder:'王三洋',
            phone:' ',
            schedule:'',
            scheduleList:[
                {
                    id:0,
                    label:'排程一',
                    value:'排程一'
                },
                {
                    id:1,
                    label:'排程二',
                    value:'排程二'
                },
            ],
            personList:[],
            curPerson:'',
            scheduleData:[],
            alleList:[],
            userId:'',
            supervisorId: '',
            supervisorName: '',
            varyWindowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth,
            userName: ''
        }
    },
    computed:{
        emptyContentHeight(){
            if(this.varyWindowHeight>800){
                return this.varyWindowHeight*0.7;
            }
            else if(this.varyWindowHeight>700){
                return this.varyWindowHeight*0.6;
            }
            else{
                return this.varyWindowHeight*0.5;
            }
        }
    },
    async mounted(){
        let self=this;
        self.store=JSON.parse(sessionStorage.getItem('STORE_ROW'));
        let storeId=self.store.storeId;
        self.storeTitle=self.store.name;
        self.userId=self.store.userId;
        self.userName = self.store.userName;
        self.supervisorId = self.store.supervisorId;
        console.log(self.supervisorId)
        self.supervisorName = self.store.supervisorName;
        console.log(self.store.napeTable)
        self.curTag=self.store.napeTable;
        self.phone=self.store.phone;
        await self.getChannelByStore(storeId);
        await self.getNapeByStore(storeId);
       //self.getUserList();
    },
    methods:{
        generateStoreLang,
        handleClick(e){
            console.log(e)
        },
        getChannelByStore(storeId){
            let self=this;
            let params={storeId:storeId};
            getDeviceList(params).then(res=>{
                console.log(res);
                let data=res.data;
                let temp=[];
                if(data.length!=0){
                    data.forEach(item=>{
                        let obj={};
                        obj.id=item.id;
                        obj.name=item.name;
                        obj.ivsId=item.ivsId;
                        obj.value = item.id;
                        obj.label = item.name;
                        obj.disabled = false;
                        temp.push(obj);
                    })
                    self.alleList=temp;
                    //self.getNapeByStore(storeId)
                }
            })
        },
        clickItem(item,index){
            let self=this;
            item.isClick=true;
            self.scheduleData.forEach((_item,index)=>{
                _item.itemData.forEach((itemS,indexS)=>{
                    if(item.id!=itemS.id){
                        itemS.isClick=false;
                    }
                })
            })
        },
      changeDeviceId(val, item){
        item.channelvalue = val;
      },
      changeSelect(val, item, index){
          this.clickItem(item, index)
      },
        getNapeByStore(storeId){
            let self=this;
            let params={
                storeId:storeId,
                mode:0
            }
          checkOutInspectItemV3(params).then(res=>{
                console.log(res);
                let data=res.data.groups;
                let temp=[];
                if(data.length!=0){
                    data.forEach(item=>{
                        let obj={};
                        obj.id=item.groupId;
                        obj.napeName=item.groupName;
                        obj.napeNum=item.items.length;
                        let _temp=[];
                        for(const _item of item.items){
                            let _obj={};
                            _obj.id=_item.id;
                            _obj.subject=_item.subject;
                            // _obj.channelvalue=_item.deviceId==-1?'': _item.deviceId;
                            // self.alleList[self.alleList.map(x=>x.id).indexOf(_item.deviceId)].name;
                            _obj.channelvalue = []
                            _obj.oldChannelvalue = []
                            _item.deviceIds.forEach(id=>{
                              if(id != -1){
                                _obj.channelvalue.push(id)
                              }
                              _obj.oldChannelvalue.push(id)
                            })
                            _obj.isClick=false,
                            _temp.push(_obj);
                        }
                        obj.itemData=_temp;
                        temp.push(obj);
                    })

                }
                self.scheduleData=temp;
            })
        },
        changePerson(val){
            console.log(val);
            let self=this;
            self.personList.forEach(item=>{
                if(item.userId==val){
                    self.phone=item.phoneNumber;
                }
            })
        },
        getUserList(){
            let self=this;
            let params={
                storeId:self.store.storeId
            }
            getUserInfo(params).then(res=>{
                console.log(res);
                let temp=res.data;
                if(self.supervisorId!=null&&self.supervisorId.length!=0){
                    if(temp.map(x=>x.userId).indexOf(self.supervisorId)==-1){
                        let obj={
                            userId:self.store.supervisorId,
                            userName:self.store.supervisorId,
                            phoneNumber:self.store.phone
                        }
                        temp.push(obj);
                    }
                }
                self.personList=temp;
              console.log(self.personList);
              //self.curPerson=self.userId;
                self.curPerson = self.supervisorId;
            })
        },
        async submitData(){
            let self=this;
            console.log(self.scheduleData);
            let count=0;
            let countChannel=0;
            let temp=[];
            let unbindTemp = [];
            self.scheduleData.forEach(item=>{
                count+=item.itemData.length;
                item.itemData.forEach(_item=>{
                    let obj={};
                    let unbindObj = {};
                    if(_item.channelvalue.length!=0){
                        countChannel++;
                        obj.inspectItemId=_item.id;
                        obj.storeId=self.store.storeId;
                        obj.deviceIds = _item.channelvalue;
                        if(_item.oldChannelvalue.length > 0 && JSON.stringify(_item.oldChannelvalue.sort()) !== JSON.stringify(_item.channelvalue.sort())){
                          unbindObj.inspectItemId=_item.id;
                          unbindObj.storeId=self.store.storeId;
                          unbindObj.deviceIds = _item.oldChannelvalue;
                          unbindTemp.push(unbindObj)
                        }
                        // _item.channelvalue.forEach(channelName=>{
                        //   obj.deviceIds.push(self.alleList[self.alleList.map(x=>x.name).indexOf(channelName)].id)
                        // })
                        //obj.deviceId=self.alleList[self.alleList.map(x=>x.name).indexOf(_item.channelvalue)].id;
                        temp.push(obj);
                    }
                })
            })
            let paramsUpdateStore={
                "store": [
                    {
                        "storeId": self.store.storeId,
                        //"userId": self.curPerson
                        "supervisorId": self.supervisorId
                    }
                ]
            };
            if(self.scheduleData.length==0){
                // let resUpdateStore=null;
                // if(self.curPerson==null||self.curPerson.length==0){
                //     self.notify(this.$t('storeView.selectStoreOwner'),'warning',3000);
                //     return false;
                // }
                // if(self.curPerson.length!=0&&(self.supervisorId!=self.curPerson)){  //如果没有修改负责人不执行
                //     resUpdateStore=await self.updateStoreInfo(paramsUpdateStore);
                // }
                // if(resUpdateStore!=null&&resUpdateStore.errMsg=='Success'||resUpdateStore==null){
                //      self.notify(this.$t('storeView.successSubmit'),'success',3000);
                //      self.supervisorId = self.curPerson;
                // }
            }
            else{
                if((count!=0&&(count!=countChannel))||countChannel==0){
                    self.notify(this.$t('storeView.selectAllChanels'),'warning',3000);
                    return false;
                }
                let paramsInspec={
                    items:temp
                };

                let resUpdateStore=null,resBindInspect=null,resUnbindInspect=null;
                // if(self.curPerson ==null ||self.curPerson.length==0 ){
                //   self.notify(this.$t('storeView.selectStoreOwner'),'warning',3000);
                //   return false;
                // }
                // else if(self.curPerson!=null&&(self.curPerson.length!=0&&(self.supervisorId!=self.curPerson))){  //如果没有修改负责人不执行
                //     resUpdateStore=await self.updateStoreInfo(paramsUpdateStore);
                // }
                //else{
                    // self.notify(this.$t('storeView.selectStoreOwner'),'warning',3000);
                    // return false;
               // }

                if(unbindTemp.length > 0){
                  let unbindParams = {
                    items: unbindTemp
                  }
                  resUnbindInspect = await self.unbindInspectItem(unbindParams);
                }
                if(resUnbindInspect == null || resUnbindInspect.errMsg=='Success'){
                  resBindInspect=await self.bindInspectItem(paramsInspec);
                }
              //((resUpdateStore!=null&&resUpdateStore.errMsg=='Success')&&(resBindInspect!=null&&resBindInspect.errMsg=='Success')) ||
              if((resUpdateStore==null&&(resBindInspect!=null&&resBindInspect.errMsg=='Success'))){
                    self.notify(this.$t('storeView.successSubmit'),'success',3000);
                }
                else{
                    self.notify(this.$t('storeView.failSubmit'),'warning',3000);
                    return false;
                }
            }
        },
        bindInspectItem(params){
            return new Promise((resolve,reject)=>{
                bindInspectItemV2(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        unbindInspectItem(params){
          return new Promise((resolve,reject)=>{
            unbindInspectItemV2(params).then(res=>{
              console.log(res);
              resolve(res);
            })
          })
        },
        updateStoreInfo(params){
            return new Promise((resolve,reject)=>{
                updateStoreInfo(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/textstyle.css';
    $red:#FB4C5D;
    $fff:#fff;
    $tab:#7d8cad;
  $border:#e3e9f4;
    @function rem($val){
        @return $val/16+rem;
    }
    @function checkRem($val){
        @if($val==auto){@return auto;}
        @else if($val==0){@return 0;}
        @else{@return rem($val);}
    }
    @mixin point($poi,$val){
        #{$poi}:checkRem($val);
    }
    .noraml-color{
        background-color: #F6F7FB;
        cursor: pointer;
    }
    .active-color{
        background-color: #FEE4E7;
        cursor: pointer;
    }
    .el-storeEdit-content{
      border: 1px solid $border;
      background-color: #fff;
        padding-left: calc(40/1920*100vw);
        padding-top: 25px;
        padding-right: calc(15/1920*100vw);
        .storeEdit-header{
            .store-title{
                overflow: hidden;
                text-align: left;
                font-size: calc(18/1920*100vw);
                font-weight: bold;
                color: #424151;
                .sub-btn{
                    float: right;
                    margin-right: calc(25/1920*100vw);
                    font-size: calc(14/1920*100vw);
                    height: calc(36/1920*100vw);
                    padding: 0 0;
                    width: calc(130/1920*100vw);
                }
            }
            .store-info{
                text-align: left;
                margin-top: 20px;
                font-size: calc(14/1920*100vw);
                span{
                    width:auto;
                    margin-right:20px;
                }
              @media screen and (max-width: 1680px){
                span{
                  width:auto;
                  margin-right:10px;
                }
              }
                .el-schedule{
                    @include point(width,140);
                    @include point(margin-right,25);
                }
                .input{
                  @include point(width,140);
                 // @include point(margin-right,25);
                  border: none;
                  /deep/ .el-input.is-disabled .el-input__inner{
                    border: none;
                    background-color: #f0f5f8 !important;
                  }
                }
            }
            .store-handle{
              .header-details1{
                text-align: left;
                padding-right: calc(30/1920*100vw);
                height: auto;
                line-height: calc(40/1920*100vw);
                span{
                  //font-size: calc(14/1920*100vw);
                  font-size: 14px;
                  margin-right: calc(20/1920*100vw);
                }
                .choice-store{
                  color: $tab;
                  i{
                    margin-right: calc(15/1920*100vw);
                  }
                  .icon-tishi1{
                    font-size: calc(16/1920*100vw);
                  }
                }
              }
            }
        }
        .storeEdit-content{
            margin-top: 25px;
            margin-bottom: 25px;
            background-color: #F6F7FB;
            #patrltabs-content{
                line-height: 60px;
                height: 60px;
            }
            #patrltabs-content /deep/ .el-tabs__nav-wrap{
                padding-left: 35px;
            }
            #patrltabs-content /deep/ .el-tabs__active-bar{
                height: 4px;
            }
            #patrltabs-content /deep/ .el-tabs__item {
                font-family: Roboto,"Microsoft YaHei";
                font-weight: bold;
                color: #94A4B4;
                font-size: 14px;
                // width: 100px;
                // overflow: hidden;
                // text-overflow: ellipsis;
            }
            #patrltabs-content /deep/ .el-tabs__item.is-active{
                color: #f31d65;
                font-weight: bold;
            }
            .el-table-title{
                line-height: 40px;
                height: 40px;
                text-align: left;
                border-bottom: 1px solid #ddd;
                margin:auto 10px;
                color: #94A4B4;
                font-size: 14px;
                font-weight: bold;
                .name-title{
                    width: 40%;
                    display: inline-block;
                    margin-right: 2%;
                    margin-left: 2%;
                }
            }
            .el-table-data{
                padding-left: calc(15/1920*100vw);
                padding-right: calc(15/1920*100vw);
                text-align: left;
                .grouptitle{
                    margin-left: 2%;
                    display: inline-block;
                    margin-top: 15px;
                    font-size: 15px;
                    font-weight: bold;
                    color: #424151;
                }
                .schedule-data{
                    margin-top: 5px;
                    .schedule-detials{
                        text-align: left;
                        line-height: 70px;
                        height: 70px;
                        border-bottom: 1px solid #ddd;
                        font-size: 14px;
                    }
                    .nape-title{
                        margin-left: 2%;
                        float: left;
                        width: 40%;
                    }
                    .nape-value{
                        margin-left: 2%;
                        width: calc(400/1920*100vw);
                        /deep/  .el-province{
                          width: calc(400/1920*100vw);
                        }
                      /deep/ .input-class{
                        width: calc(370/1920*100vw);
                      }
                    }
                  .nape-value.content{
                    top: 0;
                  }
                }
            }
        }
    }
</style>
<style>
.el-schedule .el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 0px !important;
    border: 0px !important;
}

</style>
