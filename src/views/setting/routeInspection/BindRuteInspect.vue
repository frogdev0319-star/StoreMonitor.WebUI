<template>
    <div class="el-bind-device">
        <div class="el-bind-header">
            <div class="seacrh-content">
                <span>按省份选择</span>
                  <el-select v-model="curProvince" placeholder="省份" clearable size="mini" class="el-province" 
                  @change="changePro" @clear="clearCitys">
                    <el-option
                    v-for="item in provinceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div class="city-content" @click="choiceCity">
                    <div class="input-arrow-panel">

                    </div>
                    <el-input v-model="citys" size="mini" id="elCity" placeholder="城市" 
                 :readonly=true></el-input>
                 <i :class="showDrap?'el-icon-arrow-down':'el-icon-arrow-up'" class='icon-input'></i>
                </div>
                <el-button size="mini" class="el-search-btn" @click="searchStore">搜索</el-button>
                <div class="city-panel" v-if="showCityContent" @mouseleave="showCityContent=false">
                    
                    <p :style="isChecked?{}:{'color':'#FB4C5D'}">
                        <el-checkbox v-model="allCityChecked" @change="choiceAllCity"
                        class="elcheckBox"></el-checkbox>全部</p>
                    <div class="city-details" v-for="(item,index) in cityList" :key="index">
                        <el-checkbox v-model="item.checked" @change="changeCityItem(item)" class="elcheckBox"></el-checkbox>
                        <span>{{item.cityName}}</span>
                    </div>
                </div>
                <el-input
                    size="small"
                    class="el-search-input"
                    :clearable=true
                    placeholder="请输入关键词搜索门店"
                    v-model="serachVale" @keyup.enter.native="searchStoreInput">
                    <i @click="searchStoreInput" slot="prefix" class="iconfont icon-sousuo" 
                    style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                </el-input>
            </div>
             <hr class="el-header-hr"/>
            <p class="el-header-title">请选择{{tabName}}表，需要关联的门店</p>
            <p class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"></i>{{tabName}}表共有{{totalCount}}家门店,已绑定{{storeCount}}家门店</p>
           
        </div>
        <div class="el-bind-content" :style="{'min-height':varyWindowWidth*0.56+'px'}">
            <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                <div class="el-all-checkbox" v-if="storeList.length!=0">
                    <el-checkbox  v-model="allData" @change="choiceAll"></el-checkbox>
                    <span class="all-device-title">关联至所有门店</span>
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
                <el-button :disabled="storeList.length==0" class="btn" size="mini"  @click="applyNape"><i class="iconfont icon-quxiaolianjie" style="margin-right:10px;"></i>确认绑定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/index'
import {getStoreList} from '@/api/store'
import {applyItemInspectItem,UnapplyInspectItem,getInspectBindList} from '@/api/inspect'
export default {
    name:'BindRuteInspect',
    data(){
        return{
            allData:false,
            tabName:'',
            storeCount:0,
            totalCount:0,
            storeList:[],
            tempStoreList:[],
            varyWindowWidth:window.innerHeight,
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
            serachVale:''
        }
    },
    methods:{
        //切换省份
        changePro(val){
            let self=this;
            console.log(val);
            self.getCityByProvince(val);
            self.citys='';
            self.multeCityList.length=0;
            self.serachVale='';
            self.allCityChecked=false;
        },
         clearCitys(){
            let self=this;
            self.multeCityList.length=0;
        },
        choiceCity(){
            let self=this;
            if(self.curProvince.length==0){
                self.notify('请选择省份！','warning',3000);
                return false;
            }
            self.showCityContent=!self.showCityContent;
            self.showDrap=!self.showDrap;
        },
        choiceAllCity(val){
            let self=this;
            let str='';
            let temp=[];
            if(!val){
                self.citys='';
                self.multeCityList=[];
            }
            self.cityList.forEach(item=>{
                item.checked=val;
                if(val){
                    str=str+item.cityName+';';
                    temp.push(item.cityName);
                }
            })
            let cityStr=str.substring(0,str.length-1);
            self.citys=cityStr.length>10?cityStr.substr(0,10):cityStr;
            self.multeCityList=temp;
        },
        changeCityItem(item){
            console.log(item);
            let self=this;
            let str='';
            let flag=false;
            let temp=[];
            self.cityList.forEach(_item=>{
                if(_item.checked){
                    str=str+_item.cityName+';';
                    temp.push(_item.cityName);
                }
                flag=flag||_item.checked;
            })
            self.isChecked=flag;
            let cityStr=str.substring(0,str.length-1);
            self.citys=cityStr.length>10?cityStr.substr(0,10):cityStr;
            if(temp.length==self.cityList.length){
                self.allCityChecked=true;
            }
            else{
                self.allCityChecked=false;
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
            if(self.curProvince==0){
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
                self.notify(`门店绑定修改成功，巡检表绑定${bindIdList.length}家门店！`,'success',3000);
            }
            else{
                self.notify('绑定失败!','warning',3000);
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
            switch(Number(sessionStorage.getItem('TabName'))){
                case 0: name="远程巡检";break;
                case 1: name="现场巡检";break;
                default: name="test";break;
            }
            self.tabName= name;
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
    font-family: 'Microsoft YaHei';
}
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
}
.el-bind-device{
    .seacrh-content{
        @include point(margin-top,30);
        @include point(margin-left,30);
        position: relative;
        .el-province{
            @include point(width,160);
            @include point(margin-left,15);
            @include point(margin-right,20);
        }
        #elCity{
            @include point(width,160);
        }
        .city-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            .input-arrow-panel{
                @include point(width,160);
                @include point(height,28);
                position: absolute;
                background-color: transparent;
                cursor: pointer;
                z-index: 100;
            }
            .el-input{
                @include point(width,160);
            }
        }
        .el-search-btn{
            @include point(width,90);
            text-align: center;
            @include point(margin-left,15);
            background-color: #FB4C5D;
            color: #fff;
        }
        .icon-input{
            position: absolute;
            right: 10px;
            @include point(right,10);
            @include point(top,6);
        }
        .city-panel{
            position:absolute;
            margin-top: 3px;
            @include point(left,275);
            width: 60%;
            height: auto;
            padding:10px 0px 30px 15px;
            z-index: 980;
            background-color: #fff;
            border:1px solid #ddd;
            .elcheckBox{
                margin-right: 10px;
            }
            font-size: 14px;
            p{
                font-weight: bold;
            }
            .city-details{
                width: auto;
                min-width: 12.5%;
                display: inline-block;
                @include point(margin-right,15);
                @include point(margin-top,10);
            }
        }
    }
    .el-header-title{
        font-size: 18px;
        font-weight: bold;
        @include point(margin-left,30);
        position: relative;
        top: 5px;
        display: inline;
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
        color: #4b5262;
        display: inline;
        position: absolute;
        @include point(right,10);
        @include point(margin-top,10);
    }
    .el-bind-content{
        @include point(margin-left,30);
        @include point(margin-top,10);
        @include point(margin-right,20);
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        .el-all-checkbox{
            margin: 20px auto 20px 15px;
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
                @include point(width,120);
                background-color: #FB4C5D; 
                color: #fff;
            }
        }
    }
}
</style>
<style>
.el-button--mini, .el-button--mini.is-round{
    padding:7px 15px !important;
}
.el-checkbox__inner:hover{
    border-color: #FB4C5D !important;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB4C5D}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB4C5D !important;
    border-color:#FB4C5D !important;
}
.el-province .el-input__inner{
    border-radius: 0px !important;
    background-color: #F4F5F9 !important;
}
#elCity{
    border-radius: 0px;
    background-color: #F4F5F9;
    border: 1px solid #dcdfe6;
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
    color:#FB4C5D !important;
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
