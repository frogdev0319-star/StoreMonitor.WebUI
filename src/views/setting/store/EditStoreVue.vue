<template>
    <el-row class="el-storeEdit-content">
        <el-col :span="24" class="storeEdit-header">
            <div class="store-title ">
                <span>{{storeTitle}}</span>
                <el-button @click="submitData"  class="sub-btn" :size="varyWindowWidth>1680?'small':'mini'" type='primary'>{{generateStoreLang('mySubmit')}}</el-button>
            </div>
            <div class="store-info">
                <span style="margin-right:20px;"><strong>{{generateStoreLang('solver')}}</strong></span>
                <el-select v-model="curPerson" :placeholder="generateStoreLang('selectPlaceholder')" size="mini"
                class="el-schedule" @change="changePerson">
                    <el-option
                    v-for="item in personList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
                    </el-option>
                </el-select>
                <strong style="margin-right:20px;">{{generateStoreLang('contact')}}</strong><span style="min-width:100px;display:inline-block;">{{phone}}</span>
                <span style="margin-right:20px;"><strong>{{generateStoreLang('routeSchedule')}}</strong></span>
                <el-select v-model="schedule" :placeholder="generateStoreLang('selectPlaceholder')" size="mini" class="el-schedule" :disabled=true>
                    <el-option
                    v-for="item in scheduleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="store-handle">
                <span style="font-size:14px;font-weight:bold;">{{generateStoreLang('bindInspectList')}}</span>
                <span style="font-size:14px;">{{curTag}}</span>
            </div>
        </el-col>
        <el-col :span="24" class="storeEdit-content" :style="{'min-height':emptyContentHeight+'px'}">
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
import {checkOutInspectItem,bindInspectItem} from '@/api/inspect'
import {updateStoreInfo} from '@/api/store'
import {generateStoreLang} from '@/api/i18n'

export default {
    name:'EditStoreVue',
    data(){
        return{
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
            varyWindowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth
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
    mounted(){
        let self=this;

        self.store=JSON.parse(sessionStorage.getItem('STORE_ROW'));
        let storeId=self.store.storeId;
        self.storeTitle=self.store.name;
        self.userId=self.store.userId;
        self.curTag=self.store.napeTable;
        self.phone=self.store.phone;
        self.getChannelByStore(storeId);
        self.getNapeByStore(storeId);

        self.getUserList();
    },
    methods:{
        generateStoreLang,
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
            let params={
                storeId:self.store.storeId
            }
            getUserInfo(params).then(res=>{
                console.log(res);
                let temp=res.data;
                if(self.userId!=null&&self.userId.length!=0){
                    if(temp.map(x=>x.userId).indexOf(self.userId)==-1){
                        let obj={
                            userId:self.store.userId,
                            userName:self.store.userName,
                            phoneNumber:self.store.phone
                        }
                        temp.push(obj);
                    }
                }
                self.personList=temp;
                self.curPerson=self.userId;
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
            let paramsUpdateStore={
                "store": [
                    {
                        "storeId": self.store.storeId,
                        "userId": self.curPerson
                    }
                ]
            };
            if(self.scheduleData.length==0){
                let resUpdateStore=null;
                if(self.curPerson==null||self.curPerson.length==0){
                    self.notify(this.$t('storeView.selectStoreOwner'),'warning',3000);
                    return false;
                }
                if(self.curPerson.length!=0&&(self.userId!=self.curPerson)){  //如果没有修改负责人不执行
                    resUpdateStore=await self.updateStoreInfo(paramsUpdateStore);
                }
                if(resUpdateStore!=null&&resUpdateStore.errMsg=='Success'||resUpdateStore==null){
                     self.notify(this.$t('storeView.successSubmit'),'success',3000);
                }
            }
            else{
                if((count!=0&&(count!=countChannel))||countChannel==0){
                    self.notify(this.$t('storeView.selectAllChanels'),'warning',3000);
                    return false;
                }
                let paramsInspec={
                    items:temp
                };

                let resUpdateStore=null,resBindInspect=null;
                if(self.curPerson!=null&&(self.curPerson.length!=0&&(self.userId!=self.curPerson))){  //如果没有修改负责人不执行
                    resUpdateStore=await self.updateStoreInfo(paramsUpdateStore);
                }
                else{
                    self.notify(this.$t('storeView.selectStoreOwner'),'warning',3000);
                    return false;
                }
                resBindInspect=await self.bindInspectItem(paramsInspec);
                if(((resUpdateStore!=null&&resUpdateStore.errMsg=='Success')&&(resBindInspect!=null&&resBindInspect.errMsg=='Success'))
                ||(resUpdateStore==null&&(resBindInspect!=null&&resBindInspect.errMsg=='Success'))){
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
    $red:#FB4C5D;
    $fff:#fff;
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
        @include point(padding-left,30);
        @include point(padding-top,20);
        @include point(padding-right,10);
        .storeEdit-header{
            .store-title{
                overflow: hidden;
                text-align: left;
                font-size: 18px;
                font-weight: bold;
                color: #424151;
                .sub-btn{
                    float: right;
                    @include point(margin-right,20);
                    @include point(width,90);
                }
            }
            .store-info{
                text-align: left;
                @include point(margin-top,15);
                font-size: 14px;
                span{
                    width:auto;
                    margin-right:30px;
                }
                .el-schedule{
                    @include point(width,140);
                    @include point(margin-right,25);
                }
            }
            .store-handle{
                @include point(margin-top,20);
                text-align: left;
                span{
                    @include point(margin-right,30);
                }
            }
        }
        .storeEdit-content{
            @include point(margin-top,20);
            @include point(margin-bottom,20);
            background-color: #F6F7FB;
            .el-table-title{
                @include point(line-height,50);
                @include point(height,50);
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
                @include point(padding-left,10);
                @include point(padding-right,10);
                text-align: left;
                .grouptitle{
                    margin-left: 2%;
                    display: inline-block;
                    @include point(margin-top,10);
                    font-size: 15px;
                    font-weight: bold;
                    color: #424151;
                }
                .schedule-data{
                    margin-top: 5px;
                    .schedule-detials{
                        text-align: left;
                        @include point(line-height,50);
                        @include point(height,50);
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

</style>
