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
                <div class="city-panel" v-if="showCityContent"> 
                    <p :style="isChecked?{}:{'color':'#FB505F'}">全部</p>
                    <div class="city-details" v-for="(item,index) in cityList" :key="index">
                        <el-checkbox v-model="item.checked" @change="changeCityItem(item)"></el-checkbox>
                        <span>{{item.cityName}}</span>
                    </div>
                </div>
                <el-input
                    size="small"
                    class="el-search-input"
                    placeholder="请输入关键词搜索门店"
                    v-model="serachVale" @keyup.enter.native="searchStoreInput">
                    <i @click="searchStoreInput" slot="prefix" class="iconfont icon-sousuo" 
                    style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                </el-input>
            </div>
             <hr class="el-header-hr"/>
            <p class="el-header-title">请选择{{tabName}}表，需要关联的门店</p>
            <p class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"></i>当前账户共有{{storeCount}}家门店</p>
           
        </div>
        <div class="el-bind-content" :style="{'min-height':varyWindowWidth*0.60+'px'}">
            <div class="el-all-checkbox">
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
        </div>
        <div class="el-bind-footer">
            <div class="el-btn-content">
                <el-button class="btn" size="mini"  @click="applyNape"><i class="iconfont icon-quxiaolianjie" style="margin-right:10px;"></i>确认绑定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/index'
import {getStoreList} from '@/api/store'
import {applyItemInspectItem,getInspectBindList} from '@/api/inspect'
export default {
    name:'BindRuteInspect',
    data(){
        return{
            allData:false,
            tabName:'',
            storeCount:0,
            storeList:[],
            tempStoreList:[],
            varyWindowWidth:window.innerHeight,
            provinceList:[],
            curProvince:'',
            multeCityList:[],
            citys:'',
            isChecked:false,
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
            self.citys=str;
            self.multeCityList=temp;
        },
        searchStoreInput(){
            let self=this;

        },
        searchStore(){
            let self=this;
            self.showCityContent=false;
            let temp=self.tempStoreList;
            let province=self.curProvince;
            let citys=self.multeCityList;
            let tempArray=[];
            if(citys.length!=0){
                temp.forEach(item=>{
                    citys.forEach(_item=>{
                        if(_item==item.cityName){
                            tempArray.push(item);
                        }
                    })
                })
            }
            else{
                if(province.length!=0){  //只选择省份，不选城市
                    temp.forEach(item=>{
                        if(item.province==province){
                            tempArray.push(item);
                        }
                    })
                }
                else{
                    tempArray=temp;
                }
            }
            self.storeList=tempArray;
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
        getStoreData(){
            let self=this;
            let params={};
            params.like={
                'name':self.serachVale,
                'city':self.serachVale,
                'province':self.serachVale
            };
            return new Promise((resolve,reject)=>{
                getStoreList(params).then(res=>{
                    console.log(res);
                    let errMsg=res.errMsg;
                    let data=res.data.content;
                    console.log(data);
                    resolve(data);
                })
            })
        },
        //获取省份信息及初始化门店列表
        async getProvinceList(){
            let self=this;
            self.storeData=await self.getStoreData();
            self.storeCount=self.storeData.length;
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
            self.tempStoreList.forEach(item=>{
                if(item.province==province){
                    let obj={};
                    obj.cityName=item.cityName;
                    obj.checked=false;
                    temp.push(obj);
                }
            })
            self.cityList=temp;
        },
        async getStoreByCity(){
            let self=this;
            let data=await self.getStoreData();
            let bindStoreId=await self.getBindStoreList();
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
                //groupObj.checked=false;
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
        },
        applyNape(){
            let self=this;
            let storeId=[];
            let napeId=JSON.parse(sessionStorage.getItem('NapeId'));
            self.storeList.forEach(item=>{
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        storeId.push(_item.storeId);
                    }
                })
            })
            console.log(storeId);
            let temp=[];
            storeId.forEach(item=>{
                let obj={
                    storeId:item,
                    itemIds:napeId
                };
                temp.push(obj);
            })
            let params={
                storeList:temp
            }
            applyItemInspectItem(params).then(res=>{
                console.log(res);
                let errMsg=res.errMsg;
                if(errMsg!=undefined&&errMsg=='Success'){
                    self.notify('当前门店项成功绑定！','success',3000);
                }
                else{
                    self.notify('绑定失败!','warning',3000);
                    return false;
                }
            })
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
        self.getStoreByCity();

    }
}
</script>
<style lang="scss" scoped>
*{
    padding: 0;
    margin:0;
    text-align: left;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
}
.el-search-input{
    width: 200px;
    margin-right: 20px;
    position:absolute;
    right: 0px;
}
.el-bind-device{
    .seacrh-content{
        margin-top: 30px;
        margin-left: 30px;
        position: relative;
        .el-province{
            width: 160px;
            margin-right: 20px;
            margin-left: 15px;
        }
        #elCity{
            width: 160px;
        }
        .city-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            .input-arrow-panel{
                width: 160px;
                height: 28px;
                position: absolute;
                background-color: transparent;
                cursor: pointer;
                z-index: 100;
            }
            .el-input{
                width: 160px;
            }
        }
        .el-search-btn{
            width: 90px;
            text-align: center;
            margin-left: 15px;
            background-color: #FB505F;
            color: #fff;
        }
        .icon-input{
            position: absolute;
            right: 10px;
            top: 6px;
        }
        .city-panel{
            position:absolute;
            margin-top: 3px;
            left: 275px;
            width: 60%;
            height: auto;
            padding:10px 0px 30px 15px;
            z-index: 980;
            background-color: #fff;
            border:1px solid #ddd;
            p{
                font-size: 14px;
                font-weight: bold;
            }
            .city-details{
                width: auto;
                min-width: 12.5%;
                display: inline-block;
                margin-right: 15px;
                margin-top: 10px;
                font-size: 14px;
            }
        }
    }
    .el-header-title{
        font-size: 18px;
        font-weight: bold;
        margin-left: 30px;
        position: relative;
        top: 5px;
        display: inline;
    }
    .el-header-hr{
        margin-left: 30px;
        margin-top: 15px;
        margin-bottom: 20px;
        margin-right: 20px;
        border:0.5px solid #e3e9f4; 
        
    }
    .choice-device{
        text-align: right;
        margin-right: 30px;
        font-size: 13px;
        color: #4b5262;
        display: inline;
        position: absolute;
        right: 10px;
        margin-top: 10px;
    }
    .el-bind-content{
        margin-left: 30px;
        margin-top: 10px;
        margin-right: 20px;
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        .el-all-checkbox{
            margin: 20px auto 20px 15px;
            .all-device-title{
                margin-left: 15px;
                font-size: 14px;
            }
        }
        .device-group{
            width: 100%;
            margin-top: 20px;
            margin-bottom: 20px;
            .device-all-checkbox{
                margin-left: 15px;
                .group-name{
                    margin-left: 15px;
                    font-size: 14px;
                    font-weight: bold;
                }
            }
            .device-content{
                margin-left: 40px;
                overflow: hidden;
                .device-detail{
                    width: auto;
                    min-width: 160px;
                    margin-left: 10px;
                    margin-top: 10px;
                    float: left;
                    .device-name{
                        margin-left: 15px;
                    }
                }
            }
        }
    }
    .el-bind-footer{
        margin-top: 15px;
        .el-btn-title{
            margin-left: 30px;
            margin-top: 10px;
            .btn-title{
                margin-right: 100px;
            }
            .btn-infoS{
                margin-left: 20px;
                color: #fea315;
            }
        }
        .el-btn-content{
            margin-left: 25px;
            margin-top: 30px;
            margin-bottom: 20px;
            .btn{
                width: 120px;
                background-color: #FB505F; 
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
    border-color: #FB505F !important;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB505F}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB505F !important;
    border-color:#FB505F !important;
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
    color:#FB505F !important;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
}
</style>
