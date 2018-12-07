<template>
    <div class="el-bind-device">
        <div class="el-bind-header">
            <div class="seacrh-content">
                <span>按省份选择</span>
                  <el-select v-model="curProvince" placeholder="省份" size="mini" class="el-province" @change="changePro">
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
            </div>
            <p class="el-header-title">请选择{{tabName}}表，需要关联的门店</p>
            <p class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"></i>当前账户共有{{storeCount}}家门店</p>
            <hr class="el-header-hr"/>
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
            napeIdList:[]
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
                if(province.length!=0){  //只选择身份，不选城市
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
            console.log(item);
            let obj=item;
            item.itemData.forEach(item=>{
                item.checked=obj.checked;
            })
        },
        choiceAllDevice(index,item){
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
        },
        getStoreData(){
            let self=this;
            let params={};
            return new Promise((resolve,reject)=>{
                api.getStoreList().then(res=>{
                    console.log(res);
                    let errMsg=res.data.errMsg;
                    let data=res.data.data.content;
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
                groupObj.checked=false;
                let _temp=[];
                item.store.forEach(_item=>{
                    let _obj={};
                    // _obj.checked=false;
                    if(bindStoreId.indexOf(_item.storeId)==-1){
                        _obj.checked=false;
                    }
                    else{
                        _obj.checked=true;
                    }
                    _obj.storeId=_item.storeId;
                    _obj.name=_item.storeName;

                    _temp.push(_obj);
                })
                groupObj.itemData=_temp;
                groupTemp.push(groupObj);
            })

            self.storeList=groupTemp;
            self.tempStoreList=groupTemp;
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
            api.applyItemInspectItem(params).then(res=>{
                console.log(res);
                let errMsg=res.data.errMsg;
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
                api.getInspectBindList(params).then(res=>{
                    console.log(res.data.errMsg);
                    if(res.data.errMsg!=undefined&&res.data.errMsg=='Success'){
                        let data=res.data.data;
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
            margin-left: 3px;
            left: 25%;
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
        margin-top: 30px;
        margin-left: 30px;
        position: relative;
        top: 5px;
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
                    width: 160px;
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
    padding:7px 15px;
}
.el-checkbox__inner:hover{
    border-color: #FB505F;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB505F}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB505F;
    border-color:#FB505F
}
.el-province .el-input__inner{
    border-radius: 0px;
    background-color: #F4F5F9;
}
#elCity{
    border-radius: 0px;
    background-color: #F4F5F9;
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
</style>