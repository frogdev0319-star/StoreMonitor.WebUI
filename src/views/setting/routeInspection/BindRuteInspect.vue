<template>
    <div class="el-bind-device">
        <div class="el-bind-header">
            <div class="seacrh-content">
                <span>{{generateStoreLang('provinceTitle')}}</span>
                  <el-select v-model="curProvince" :placeholder="generateStoreLang('provincePlaceholder')" clearable size="mini" class="el-province"
                  @change="changePro" @clear="clearCitys">
                    <el-option
                    v-for="item in provinceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>

                <el-popover
                    placement="bottom-start"
                    width="600"
                    visible-arrow='false'
                    :disabled='showPopoVer'
                    v-model="showCityContent"
                    trigger="click">
                        <div class="city-panel" @mouseleave="showCityContent=false">
                            <p :style="isChecked?{}:{'color':'#FB4C5D'}"><el-checkbox v-model="allCityChecked" @change="choiceAllCity"
                                style="margin-right:10px;"></el-checkbox>{{generateStoreLang('all')}}</p>
                            <div class="city-details" v-for="(item,index) in cityList" :key="index">
                                <el-checkbox v-model="item.checked" @change="changeCityItem(item)" class="elcheckBox"></el-checkbox>
                                <span>{{item.cityName}}</span>
                            </div>
                        </div>
                    <div slot="reference" @click="choiceCity" class="city-input"><span :style="multeCityList.length!=0?'color:#606266':'color:#C0C4CC'">{{curCitys}}</span><i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i></div>
                </el-popover>

                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="el-search-btn" @click="searchStore" type="primary">{{generateStoreLang('searchButton')}}</el-button>

                <el-input
                    size="small"
                    class="el-search-input"
                    :clearable=true
                    :placeholder= "generateInsSettingLang('searchPlaceholder')"
                    v-model="serachVale" @keyup.enter.native="searchStoreInput">
                    <i @click="searchStoreInput" slot="prefix" class="iconfont icon-sousuo"
                    style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                </el-input>
            </div>
             <hr class="el-header-hr"/>
            <!--<p class="el-header-title">请选择{{tabName}}表，需要关联的门店</p>-->
            <p class="el-header-title" v-if="lang==='en'">{{generateInsSettingLang('bindStores')}}</p>
            <p class="el-header-title" v-else >{{generateInsSettingLang('selectStore')}}{{tabName}}{{generateInsSettingLang('needBind')}}</p>
            <p class="choice-device" v-if="lang=='en'"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"></i>{{totalCount}} {{generateInsSettingLang('total')}}
               {{storeCount}} {{generateInsSettingLang('bind')}}</p>
          <p class="choice-device" v-else><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"></i>{{tabName}}{{generateInsSettingLang('total')}}{{totalCount}}
            {{generateInsSettingLang('bindStore')}},{{generateInsSettingLang('bindWith')}}{{storeCount}}{{generateInsSettingLang('bindStore')}}</p>
        </div>
        <div class="el-bind-content" :style="{'min-height':varyWindowHeight*0.56+'px'}">
            <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                <div class="el-all-checkbox" v-if="storeList.length!=0">
                    <el-checkbox  v-model="allData" @change="choiceAll"></el-checkbox>
                    <span class="all-device-title">{{generateInsSettingLang('relateAllStores')}}</span>
                </div>
                <div class="device-group" v-for="(item,index) in storeList" :key="index">
                    <div class="device-all-checkbox">
                        <el-checkbox v-model="item.checked" @change="choiceAllGroup(item)"></el-checkbox>
                        <span class="group-name">{{item.cityName}}</span>
                    </div>
                    <div class="device-content">
                        <div class="device-detail" v-for="(_item,_index) in item.itemData" :key="_index">
                            <el-checkbox v-model="_item.checked" @change="choiceAllDevice(index,item,_index,_item)"></el-checkbox>
                            <span class="device-name">{{_item.name}}</span>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="el-bind-footer">
            <div class="el-btn-content">
                <el-button :disabled="storeList.length==0" :class="lang=='en'? 'en-btn': 'btn'" size="mini" type="primary" @click="applyNape"><i class="iconfont icon-quxiaolianjie" style="margin-right:10px;"></i>
                  {{generateInsSettingLang('confirmBound')}}</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/index'
import {getStoreList} from '@/api/store'
import {applyItemInspectItem,UnapplyInspectItem,getInspectBindList} from '@/api/inspect'
import {generateStoreLang} from '@/api/i18n'
import {generateInsSettingLang} from '@/api/i18n'

export default {
    name:'BindRuteInspect',
    data(){
        return{
            allData:false,
            tabName:'',
            tabNameLang: '',
            storeCount:0,
            totalCount:0,
            storeList:[],
            tempStoreList:[],
            varyWindowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth,
            provinceList:[],
            curProvince:'',
            multeCityList:[],
            citys:'',
            isChecked:false,
            allCityChecked:false,
            cityList:[],
            showCityContent:false,
            showDrap:true,
            storeData:[],
            napeIdList:[],
            serachVale:'',
            curCitys: this.$t('storeView.cityPlaceholder'),
            showPopoVer:true,
            lang: this.$i18n.locale
        }
    },
    methods:{
        generateStoreLang,
        generateInsSettingLang,
      //切换省份
        changePro(val){
            let self=this;
            self.getCityByProvince(val);
            self.curCitys= self.$t('storeView.cityPlaceholder');
            self.multeCityList.length=0;
            self.allCityChecked=false;
        },
        clearCitys(){
            let self=this;
            self.cityList=[];
            self.showCityContent=false;
            self.curCitys = self.$t('storeView.cityPlaceholder');
            self.multeCityList.length=0;
        },
        choiceCity(){
            let self=this;
            if(self.curProvince.length==0){
                self.notify(self.$t('storeView.selectProviceInfo'),'warning',3000);
                self.showPopoVer=true;
                return false;
            }
            else{
                self.showPopoVer=false;
                self.showDrap=!self.showDrap;
            }
        },
        choiceAllCity(val){
            let self=this;
            let str='';
            let temp=[];
            if(!val){
                self.curCitys= self.$t('storeView.cityPlaceholder');
                self.multeCityList=[];
                self.cityList.forEach(item=>{
                    item.checked=val;
                    if(val){
                        str=str+item.cityName+';';
                        temp.push(item.cityName);
                    }
                })
            }
            else{
                self.cityList.forEach(item=>{
                    item.checked=val;
                    if(val){
                        str=str+item.cityName+';';
                        temp.push(item.cityName);
                    }
                })
                self.isChecked=val;
                self.curCitys='';
                self.curCitys=str.substring(0,str.length-1);
                self.multeCityList=temp;
            }
        },
        changeCityItem(item){
           console.log(item);
            let self=this;
            let str='';
            let temp=[];
            self.cityList.forEach(_item=>{
                if(_item.checked){
                    str=str+_item.cityName+';';
                    temp.push(_item.cityName);

                }
            })
            if(temp.length!=0){
                self.isChecked=true;
            }
            else{
                self.isChecked=false;
            }
            self.curCitys='';
            self.curCitys=str.substring(0,str.length-1);
            if(temp.length==self.cityList.length){
                self.allCityChecked=true;
            }
            else{
                self.allCityChecked=false;
            }
            if(temp.length==0){
                self.curCitys = self.$t('storeView.cityPlaceholder');
            }
            self.multeCityList=temp;
        },
        async searchStoreInput(){
            let self=this;
            self.curProvince='';
            self.citys='';
            let params={};
            if(self.serachVale.length!=0){
                params={
                    like:{
                        "name": self.serachVale,
                        "userName": self.serachVale
                    },
                    filter:{
                        page:0,
                        size:1000
                    }
                };
            }
            else{
                params={
                    filter:{
                        page:0,
                        size:1000
                    }
                }
            }
            let resData=await self.getStoreData(params);
            let data=resData.content;
            self.getStoreByCity(data);

            let count=0;
            self.storeList.forEach(item=>{
                if(item.checked){
                    count++;
                }
            })
            if(count==self.storeList.length){
                self.allData=true;
            }
            else{
                self.allData=false;
            }
        },
        async searchStore(){
            let self=this;
            self.showCityContent=false;
            self.serachVale='';
            let params={};
            let temp=[];
            self.cityList.forEach(item=>{
                if(item.checked){
                    temp.push(item.cityName);
                }
            })
            if(self.curProvince==null || self.curProvince==0){
                params={
                    filter:{
                        page:0,
                        size:1000
                    }
                };
            }
            else{
                if(temp.length!=0){
                    params={
                        clause:{
                            city:temp,
                            province:self.curProvince
                        },
                        filter:{
                            page:0,
                            size:1000
                        }
                    };
                }
                else{
                    params={
                        clause:{
                            province:self.curProvince
                        },
                        filter:{
                            page:0,
                            size:1000
                        }
                    }
                }
            }
            let resData=await self.getStoreData(params);
            let data=resData.content;
            self.getStoreByCity(data);

            let count=0;
            self.storeList.forEach(item=>{
                if(item.checked){
                    count++;
                }
            })
            if(count==self.storeList.length){
                self.allData=true;
            }
            else{
                self.allData=false;
            }
        },
        choiceAll(val){
            let self=this;
            self.storeList.forEach(item=>{
                item.checked=val;
                item.itemData.forEach(_item=>{
                    _item.checked=val;
                })
            })
        },
        choiceAllGroup(item){
            let self=this;
            console.log(item);
            let obj=item;
            item.itemData.forEach(item=>{
                item.checked=obj.checked;
            })
            let arr=[];
            self.storeList.forEach(_item=>{
                if(_item.checked){
                    arr.push(_item);
                }
            })
            if(self.storeList.length==arr.length){
                self.allData=true;
            }
            else{
                self.allData=false;
            }
        },
        choiceAllDevice(index,item){
            let self=this;
            console.log(index);
            let count=0;
            item.itemData.forEach(itemS=>{
                if(itemS.checked){
                    count++;
                }
            })
            if(count==item.itemData.length){
                item.checked=true;
            }
            else{
                item.checked=false;
            }
            let length=0, countItem=0;
            self.storeList.forEach(_item=>{
                length+=_item.itemData.length;
                _item.itemData.forEach(itemS=>{
                    if(itemS.checked){
                        countItem++;
                    }
                })
            })
            if(length==countItem){
                self.allData=true;
            }
            else{
                self.allData=false;
            }
        },
        getStoreData(params){
            let self=this;
            return new Promise((resolve,reject)=>{
                getStoreList(params).then(res=>{
                    console.log(res);
                    let errMsg=res.errMsg;
                    let data=res.data;
                    console.log(data);
                    resolve(data);
                })
            })
        },
        //获取省份信息及初始化门店列表
        async getProvinceList(){
            let self=this;
            let params={
                filter:{
                    page:0,
                    size:1000
                }
            };
            let resStore=await self.getStoreData(params);
            self.storeData=resStore.content;
            self.totalCount=resStore.totalElements;
            let temp=[];
            if(self.storeData!=undefined&&self.storeData.length!=0){
                self.storeData.forEach(item=>{
                    let province=item.province;
                    if(temp.map(x=>x.label).indexOf(province)==-1){
                        let obj={
                            value:province,
                            label:province,
                            citys:[],
                        }
                        temp.push(obj);
                    }
                })
            }
            self.provinceList=temp;
        },
        async getCityByProvince(province){
            let self=this;
            let temp=[];

            self.storeData.forEach(item=>{
                if(item.province==province){
                    let obj={};
                    obj.cityName=item.city;
                    obj.checked=false;
                    if(temp.map(x=>x.cityName).indexOf(obj.cityName)==-1){
                        temp.push(obj);
                    }

                }
            })
            self.cityList=temp;
        },
        async getStoreByCity(data){
            let self=this;
            let bindStoreId=await self.getBindStoreList();
            self.storeCount=bindStoreId.length;
            console.log(data);
            let cityList=[];
            data.forEach(item=>{
                if(cityList.indexOf(item.city)==-1){
                    cityList.push(item.city);
                }
            })
            console.log(cityList);
            let temp=[];
            cityList.forEach(item=>{
                let obj={};
                obj.city=item;
                let _temp=[];
                data.forEach(_item=>{
                    if(item==_item.city){
                        let _obj={};
                        obj.province=_item.province;
                        _obj.storeName=_item.name;
                        _obj.storeId=_item.storeId;
                        _temp.push(_obj);
                    }
                })
                obj.store=_temp;
                temp.push(obj);
            })
            console.log(temp);
            let groupTemp=[];
            temp.forEach(item=>{
                let groupObj={};
                groupObj.province=item.province;
                groupObj.cityName=item.city;
                let _temp=[];
                let _tempCount=0;
                item.store.forEach(_item=>{
                    let _obj={};
                    if(bindStoreId.indexOf(_item.storeId)==-1){
                        _obj.checked=false;
                    }
                    else{
                        _obj.checked=true;
                        _tempCount++;
                    }
                    _obj.storeId=_item.storeId;
                    _obj.name=_item.storeName;
                    _temp.push(_obj);
                })
                if(_tempCount==item.store.length){
                    groupObj.checked=true;
                }
                else{
                    groupObj.checked=false;
                }
                groupObj.itemData=_temp;
                groupTemp.push(groupObj);
            })
            self.storeList=groupTemp;
            self.tempStoreList=groupTemp;
            let count=0;
            self.storeList.forEach(item=>{
                if(item.checked){
                    count++;
                }
            })
            if(count==self.storeList.length){
                self.allData=true;
            }
            else{
                self.allData=false;
            }
        },
        bindNapeToStore(params){
            return new Promise((resolve,reject)=>{
                applyItemInspectItem(params).then(res=>{
                    resolve(res);
                })
            })
        },
        UnbindNapeToStore(params){
            return new Promise((resolve,reject)=>{
                UnapplyInspectItem(params).then(res=>{
                    resolve(res);
                })
            })
        },
        async applyNape(){
            let self=this;
            let storeIdChecked=[];
            let storeIdUnchecked=[];
            let count=0;
            let napeId=JSON.parse(sessionStorage.getItem('NapeId'));
            self.storeList.forEach(item=>{
                count+=item.itemData.length;
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        storeIdChecked.push(_item.storeId);
                    }
                    else{
                        storeIdUnchecked.push(_item.storeId);
                    }
                })
            })
            let tempchecked=[];
            storeIdChecked.forEach(item=>{
                let obj={
                    storeId:item,
                    itemIds:napeId
                };
                tempchecked.push(obj);
            })
            let paramsBind={
                storeList:tempchecked
            };
            let tempUnchecked=[];
            storeIdUnchecked.forEach(item=>{
                let obj={
                    storeId:item,
                    itemIds:napeId
                };
                tempUnchecked.push(obj);
            })
            let paramsUnBind={
                storeList:tempUnchecked
            };
            let flag=false;
            if(storeIdChecked.length==count){  //全部勾选，只有绑定操作
                let resBind=await self.bindNapeToStore(paramsBind);
                console.log(resBind);
                if(resBind.errMsg=='Success'&&resBind.errCode=='0'){
                    flag=true;
                }
            }
            else if(storeIdUnchecked.length==count){ //全部取消勾选，只有解绑操作
                let resUnBind=await self.UnbindNapeToStore(paramsUnBind);
                console.log(resUnBind);
                 if(resUnBind.errMsg=='Success'&&resUnBind.errCode=='0'){
                    flag=true;
                }
            }
            else{
                let resBind=await self.bindNapeToStore(paramsBind);
                let resUnBind=await self.UnbindNapeToStore(paramsUnBind);
                if(resBind.errMsg=='Success'&&resUnBind.errMsg=='Success'){
                    flag=true;
                }
            }
            if(flag){
                let bindIdList=await self.getBindStoreList();
                self.storeCount=bindIdList.length;
                //self.notify(`门店绑定修改成功，巡检表绑定${bindIdList.length}家门店！`,'success',3000);
                self.notify(`${self.$t('insSettingView.editSuss')} ${bindIdList.length} ${self.$t('insSettingView.storesBound')}`,'success',3000);
            }
            else{
                self.notify(self.$t('insSettingView.bindFail'),'warning',3000);
                return false;
            }
        },
        getBindStoreList(){
            let self=this;
            let tagName=self.tabName;
            let params={tagName:tagName};
            return new Promise((resolve,reject)=>{
                getInspectBindList(params).then(res=>{
                    console.log(res.errMsg);
                    if(res.errMsg!=undefined&&res.errMsg=='Success'){
                        let data=res.data;
                        resolve(data);
                    }
                })
            })
        },
        InitData(){
            let self=this;
            let name='';
            let nameLang = '';
            switch(Number(sessionStorage.getItem('TabName'))){
                case 0: {
                  name = "远程巡检";
                  nameLang = self.$t('insSettingView.remotePatrol');
                  break
                };
                case 1: {
                  name = "现场巡检";
                  nameLang = self.$t('insSettingView.onsitePatrol');
                  break
                };
                default: {
                  name="test";
                  nameLang = "test";
                  break
                };
            }
            self.tabName= name;
            self.tabNameLang = nameLang; //转化为多语言的表名
            self.getProvinceList();
            self.searchStore();

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
        let self=this;
        self.InitData();
    }
}
</script>
<style lang="scss" scoped>
*{
    padding: 0;
    margin:0;
    text-align: left;
    font-family: Arial, Microsoft YaHei;
}
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
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
.el-search-input{
    @include point(width,200);
    @include point(margin-right,20);
    position:absolute;
    right: 0px;
    top: 3px;
}
.city-panel{
    @include point(height,auto);
    padding: 0px 15px 30px 15px;
    z-index: 980;
    .elcheckBox{
        margin-right:10px;
    }
    font-size: 14px;
    p{
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .city-details{
        width: auto;
        min-width: 12.5%;
        display: inline-block;
        @include point(margin-top,5);
        @include point(margin-bottom,5);
        @include point(margin-right,20);
    }
}
.el-bind-device{
  border: 1px solid $border;
  background-color: #fff;
    .seacrh-content{
        @include point(margin-top,30);
        @include point(margin-left,30);
        position: relative;
        span{
            font-size: 14px;
        }
        .el-province{
            width: calc(160/1920*100vw);
            @include point(margin-left,15);
            @include point(margin-right,20);
        }
        .city-input{
            width: calc(160/1920*100vw);
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            background: #F4F5F9 !important;
            cursor: pointer;
            display:inline-block;
            position: relative;
            // border: 1px solid #DCDFE6;
            top: 8px;
            span{
                display: inline-block;
                font-size: 12px;
                color: #C0C4CC;
                margin-left: 15px;
                @include point(width,130);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .icon-input{
                position: absolute;
                @include point(right,10);
                top: 6px;
                font-size: calc(14/1920*100vw);
                color: #C0C4CC;
            }
        }
        .el-search-btn{
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            padding: 0;
            width: calc(130/1920*100vw);
            text-align: center;
            @include point(margin-left,15);
            color: #fff;
            /*padding: 9px 15px;*/
        }
        .icon-input{
            position: absolute;
            right: 10px;
            @include point(right,10);
            @include point(top,6);
        }
    }
    .el-header-title{
        font-size: 18px;
        font-weight: bold;
        @include point(margin-left,30);
        position: relative;
        top: 5px;
        display: inline;
        color: $black;
    }
    .el-header-hr{
        @include point(margin-left,30);
        @include point(margin-top,15);
        @include point(margin-bottom,20);
        @include point(margin-right,20);
        border:0.5px solid #e3e9f4;

    }
    .choice-device{
        @include point(margin-right,30);
        font-size: 12px;
        color: $tab;
        display: inline;
        position: absolute;
        @include point(right,10);
        @include point(margin-top,10);
      .icon-tishi1{
        font-size: calc(16/1920*100vw);
      }
    }
    .el-bind-content{
        @include point(margin-left,30);
        @include point(margin-top,10);
        @include point(margin-right,20);
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        color: $black;
        .el-all-checkbox{
            margin: 20px auto 20px 15px;
            @include point(margin-left,15);
            .all-device-title{
                @include point(margin-left,15);
                font-size: 14px;
            }
        }
        .device-group{
            width: 100%;
            @include point(margin-top,20);
            @include point(margin-bottom,20);
            .device-all-checkbox{
                @include point(margin-left,15);
                .group-name{
                    @include point(margin-left,15);
                    font-size: 14px;
                    font-weight: bold;
                }
            }
            .device-content{
                @include point(margin-left,40);
                overflow: hidden;
                .device-detail{
                    width: auto;
                    @include point(min-width,160);
                    @include point(margin-left,10);
                    @include point(margin-top,10);
                    float: left;
                    .device-name{
                        @include point(margin-left,15);
                        font-size: 14px;
                    }
                }
            }
        }
    }
    .el-bind-footer{
        @include point(height,50);
        @include point(line-height,50);
        @include point(margin-bottom,25);
        position: relative;
        .el-btn-content{
            @include point(margin-left,25);
            position: absolute;
            @include point(margin-top,15);
            @include point(margin-bottom,15);
            .btn{
              @include point(width,90);
              min-width: 100px;
             // background-color: #f31d65;
              border-color:  #f31d65;
              color: #fff;
            }
            .en-btn{
              width: calc(130/1920*100vw);
              height: calc(36/1920*100vw);
              /*min-width: 160px;*/
              border-color:  #f31d65;
              color: #fff;
              text-align: center;
              .iconfont {
                font-size: calc(24 / 1920 * 100vw);
              }
              span{
                font-size: calc(14 / 1920 * 100vw);
              }
              @media screen and (max-width: 1680px){
                width: 130px;
              }
            }
        }
    }
}
</style>
<style>
.el-button--mini, .el-button--mini.is-round{
    /*padding:7px 15px !important;*/
}
.el-province .el-input__inner{
    border-radius: 0px !important;
    background-color: #F4F5F9 !important;
    border :0 !important;
}
.el-select-dropdown__item{
    padding: 0 20px !important;
}
.el-select-dropdown__item.hover{
    background-color:#FEE4E7 !important;
}
.el-select .el-input.is-focus .el-input__inner{
    border-color: #FEE4E7 !important;
}
.el-select-dropdown__item.selected{
    color:#f31d65 !important;
}
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
}
</style>
