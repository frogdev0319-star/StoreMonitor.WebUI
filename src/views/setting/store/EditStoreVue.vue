<template>
    <el-row class="el-storeEdit-content">
        <el-col :span="24" class="storeEdit-header">
            <div class="store-title level1">
                <span>{{storeTitle}}</span>
                <el-button @click="submitData" class="sub-btn" size="mini">提交</el-button>
            </div>
            <div class="store-info">
                <span style="margin-right:20px;"><strong>负责人</strong></span>
                <el-select v-model="curPerson" placeholder="请选择" size="mini" class="el-schedule" @change="changePerson">
                    <el-option
                    v-for="item in personList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
                    </el-option>
                </el-select>
                <strong style="margin-right:20px;">联系方式</strong><span style="min-width:120px;">{{phone}}</span>
                <span style="margin-right:20px;"><strong>巡检排程</strong></span>
                <el-select v-model="schedule" placeholder="请选择" size="mini" class="el-schedule">
                    <el-option
                    v-for="item in scheduleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="store-handle">
                <span style="font-size:14px;font-weight:bold;">关联巡检表</span>
                <span style="font-size:14px;">{{curTag}}</span>
            </div>
        </el-col>
        <el-col :span="24" class="storeEdit-content">
            <div class="el-table-title tabTitle">
                <span class="name-title">巡检名称</span>
                <span class="schedule-title">关联通道</span>
            </div>
            <div class="el-table-data" v-for="(item,index) in scheduleData" :key="index">
                <span class="grouptitle level3">
                    {{item.napeName}}（{{item.napeNum}}）
                </span>
                <div class="schedule-data">
                    <div v-for="(_item,_index) in item.itemData" :key="_index" :class="!_item.isClick?'noraml-color':'active-color'"
                    class="schedule-detials" style="overflow:hidden;" @click="clickItem(_item,_index)">
                        <span class="nape-title">
                            {{`${_index+1}. ${_item.subject}`}}
                        </span>
                        <el-select v-model="_item.channelvalue" class="nape-value" size="mini"  @focus="clickItem(_item,_index)">
                            <el-option
                            v-for="item in alleList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import api from '@/api/index'
import {getUserInfo} from '@/api/login'
import {getDeviceList} from '@/api/device'
import {checkOutInspectItem,bindInspectItem} from '@/api/inspect'
import {updateStoreInfo} from '@/api/store'
export default {
    name:'EditStoreVue',
    data(){
        return{
            curTag:'远程巡检',
            storeTitle:'',
            store:{},
            storeLinder:'王三洋',
            phone:'',
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
            userId:''
        }
    },
    mounted(){
        let self=this;
        
        self.store=JSON.parse(sessionStorage.getItem('STORE_ROW'));
        let storeId=self.store.storeId;
        self.storeTitle=self.store.storename;
        self.userId=self.store.userId;
        self.getNapeByStore(storeId);
        self.getChannelByStore(storeId);
        self.getUserList();
    },
    methods:{
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
                        temp.push(obj);
                    })
                    self.alleList=temp;
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
        getNapeByStore(storeId){
            let self=this;
            let params={
                storeId:storeId,
                mode:0
            }
            checkOutInspectItem(params).then(res=>{
                console.log(res);
                let data=res.data;
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
                            _obj.channelvalue=_item.deviceId==-1?'':
                                    self.alleList[self.alleList.map(x=>x.id).indexOf(_item.deviceId)].name;
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
            getUserInfo().then(res=>{
                console.log(res);
                self.personList=res.data;
                self.curPerson=self.userId;
                res.data.forEach(item=>{
                    if(item.userId==self.userId){
                        self.phone=item.phoneNumber;
                    }
                })
            })
        },
        async submitData(){
            let self=this;
            console.log(self.scheduleData);
            let count=0;
            let countChannel=0;
            let temp=[];
            self.scheduleData.forEach(item=>{
                count+=item.itemData.length;
                item.itemData.forEach(_item=>{
                    let obj={};
                    if(_item.channelvalue.length!=0){
                        countChannel++;
                        obj.inspectItemId=_item.id;
                        obj.storeId=self.store.storeId;
                        obj.deviceId=self.alleList[self.alleList.map(x=>x.name).indexOf(_item.channelvalue)].id;
                        temp.push(obj);
                    }
                })
            })
            if((count!=0&&(count!=countChannel))||countChannel==0){
                self.notify('请选择全部通道后提交！','warning',3000);
                return false;
            }
            let paramsInspec={
                items:temp
            };
            let paramsUpdateStore={
                "store": [
                    {
                        "storeId": self.store.storeId,
                        "userId": self.curPerson
                    }
                ]
            };
            let resUpdateStore=null,resBindInspect=null;
            if(self.userId!=self.curPerson){  //如果没有修改负责人不执行
                resUpdateStore=await self.updateStoreInfo(paramsUpdateStore);
            }
            resBindInspect=await self.bindInspectItem(paramsInspec);
            if(((resUpdateStore!=null&&resUpdateStore.errMsg=='Success')&&(resBindInspect!=null&&resBindInspect.errMsg=='Success'))
            ||(resUpdateStore==null&&(resBindInspect!=null&&resBindInspect.errMsg=='Success'))){
                self.notify('提交成功！','success',3000);
            }
            else{
                self.notify('提交失败！','warning',3000);
                return false;
            }
        },
        bindInspectItem(params){
            return new Promise((resolve,reject)=>{
                bindInspectItem(params).then(res=>{
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
    .noraml-color{
            background-color: #F6F7FB;
            cursor: pointer;
        }
        .active-color{
            background-color: #FEE4E7;
            cursor: pointer;
        }
    .el-storeEdit-content{
        padding-left: 30px;
        padding-top: 20px;
        padding-right: 10px;
        .storeEdit-header{
            .store-title{
                overflow: hidden;
                text-align: left;
                .sub-btn{
                    float: right;
                    margin-right: 20px;
                    width: 80px;
                    color: #fff;
                    background-color: #FB505F;
                    border-color: #FB505F;
                }
            }
            .store-info{
                text-align: left;
                margin-top: 15px;
                font-size: 14px;
                span{
                    width:auto;
                    margin-right: 6%;
                }
                .el-schedule{
                    width: 140px;
                    margin-right: 25px;
                }
            }
            .store-handle{
                margin-top: 20px;
                text-align: left;
                span{
                    margin-right: 30px;
                }
            }
        }
        .storeEdit-content{
            margin-top: 20px;
            margin-bottom: 20px;
            background-color: #F6F7FB;
            .el-table-title{
                height: 50px;
                line-height: 50px;
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
                .schedule-title{

                }
            }
            .el-table-data{
                padding-left: 10px;
                padding-right: 10px;
                text-align: left;
                .grouptitle{
                    margin-left: 2%;
                    display: inline-block;
                    margin-top: 10px;
                }
                .schedule-data{
                    margin-top: 5px;
                    .schedule-detials{
                        text-align: left;
                        height: 50px;
                        line-height: 50px;
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
                        width: 120px;
                        .el-input__inner{
                            background-color: #fff;
                        }
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
.nape-value .el-input__inner{
    border-radius: 0px;
    background-color: #fff;
}
.el-select-dropdown__item{
    padding: 0 20px !important;
}
.el-select-dropdown__item.hover{
    background-color:#FEE4E7;
}
.el-select .el-input.is-focus .el-input__inner{
    border-color: #FEE4E7;
}
.el-select-dropdown__item.selected{
    color:#FB505F;
}
.el-checkbox__inner:hover{
    border-color: #FB505F !important;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB505F}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB505F !important;
    border-color:#FB505F !important;
}
</style>
