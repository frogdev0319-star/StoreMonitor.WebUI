<template>
    <div class="el-event-content">
       <div class="seacrh-content">
            <span class="select-title noraml-text">按省份选择</span>
             <el-select v-model="curProvince" placeholder="省份" size="mini" class="el-province" @change="changePro">
                    <el-option
                    v-for="item in provinceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>
            <div class="city-content" @click="choiceCity">
                <div class="input-arrow-panel"></div>
                    <el-input v-model="citys" size="mini" id="elCity" placeholder="城市" :readonly=true></el-input>
                    <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
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
                v-model="serachVale" @keyup.enter.native="searchEventList">
                <i @click="searchEventList" slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
            </el-input>
       </div>
        <div class="el-table-content">
            <el-table 
            :data="tableData" 
            :highlight-current-row="true"
            empty-text='没有异常数据'
            align='left'
            :height="windowHeight*(windowHeight>1000?0.76:0.65)"
            @sort-change='sortChange'
            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;">
                <el-table-column
                    width="120"
                    header-align="center"
                    align="center">
                        <template slot-scope="scope" >
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#6097F4;" v-if="scope.row.bindDevice" >已关联</span>
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#FEA316;" v-else>未关联</span>       
                    </template>
                </el-table-column>
            <el-table-column v-for="(item,index) in tableInfoData" :key="index"
                :prop="item.prop" :label="item.label" :sortable="item.sortable" :width="item.width">
            </el-table-column>
            <el-table-column
                prop="option"
                label="操作"
                width="80"
                align="left">
                <template slot-scope="scope">
                    <i class="iconfont icon-gengduo" style="font-size:20px;cursor: pointer;" @click="toEventDetail(scope.row)"></i>
                </template>
            </el-table-column>
            <div slot="empty">
                <div>
                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">无异常数据</span>
                </div> 
            </div>
        </el-table>
            <div class="toolbar pagination" style="width:100%; margin:10px 15px;height:12%;">
              <el-pagination background small 
                :page-sizes="[10, 20, 50, 100]"
                @size-change="sizeChange"
                @current-change="currentChange"
              layout="jumper,total, prev, pager, next,sizes"  
              :page-size="sizeNum" :total="total" style="float:right;margin-top:10px;">
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api/index'
    export default {
        name: "StoreManage",
        data(){
            return{
                citys:'',
                tableInfoData:[
                     {
                        "prop":"storename",
                        "label":"门店名称",
                        "sortable":false,

                    },
                    {
                        "prop":"leading",
                        "label":"负责人",
                        "sortable":false,
                    },
                    {
                        "prop":"phone",
                        "label":"联系方式",
                        "sortable":false
                    },
                    {
                        "prop":"napeTable",
                        "label":"关联巡检表",
                        "sortable":false
                    },
                     {
                        "prop":"schedue",
                        "label":"巡检排程",
                        "sortable":false
                    }
                ],
                storeData:[],
                tempStoreData:[],
                tableData:[],
                provinceList:[],
                cityList:[],
                curProvince:'',
                showDrap:false,
                showCityContent:false,
                multeCityList:[],
                tagList:[],
                windowHeight:window.innerHeight,
                params:{},
                total:0,
                sizeNum:10,
                page:0,
                serachVale:''
            }
        },
        methods:{
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
                self.params.clause={
                   	'province':self.curProvince
                };
                if(self.multeCityList.length!=0){
                    self.params.clause.city=self.multeCityList;
                }
                self.getStoreList(self.params);
            },
            sizeChange(val){
                let self=this;
                self.sizeNum=val;
                self.getStoreList(self.params);
            },
            currentChange(val){
                let self=this;
                self.page=val-1;
                self.getStoreList(self.params);
            },
            getCityByProvince(province){
                let self=this;
                let temp=[];
                self.tempStoreData.forEach(item=>{
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
            async getProvinceList(){
                let self=this;
                let params={};
                let data=await self.getStoreData(params);
                self.tempStoreData=data.content;
                let temp=[];
                if(self.tempStoreData!=undefined&&self.tempStoreData.length!=0){
                    self.tempStoreData.forEach(item=>{
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
            getCheckOutData(row){
                let self=this;
                let params={
                    storeId:row.storeId,
                    mode:0
                };
                api.checkOutInspectItem(params).then(res=>{
                    console.log(res);
                    let data=res.data.data;
                    let count=0;
                    let countAll=0;
                    if(data.length!=0){
                        data.forEach(item=>{
                            countAll+=item.items.length;
                            for(const _item of item.items){
                                if(_item.deviceId!=-1){
                                    count++;
                                }
                            }
                        })
                    }
                    if(countAll==count){
                        row.bindDevice=true;
                    }
                    else{
                        row.bindDevice=false;
                    }
                })
            },
            getInitData(){
                let self=this;
                self.params.filter={
                    'page':self.page,
                    'size':self.sizeNum
                };
                self.getStoreList(self.params);
            },
            async getStoreList(params){
                let self=this;
                self.storeData=await self.getStoreData(params);
                let temp=[];
                self.storeData.content.forEach(item=>{
                    let obj={};
                    obj.storeId=item.storeId;
                    obj.storename=item.name;
                    obj.leading='刘三强',
                    obj.phone='1733351233',
                    obj.napeTable='远程巡检',
                    obj.schedue='排程一',
                    obj.device=item.device;
                    temp.push(obj);
                })
                self.tableData=temp;
                self.total=self.storeData.totalElements;
            },
            searchEventList(){
                let self=this;
                self.params.clause={};
                self.params.like={
                    "storeId": self.serachVale,
                    "name": self.serachVale,
                    "city": self.serachVale,
                    "province": self.serachVale,
                    "country": self.serachVale,
                    "userId": self.serachVale
                };
                self.getStoreList(self.params);
            },
            sortChange(){

            },
            getINspectItemResult(){

            },
            toEventDetail(row){
                let self=this;
                console.log(row);
                let params={
                    storeId:row.storeId,
                    mode:0
                };
                api.checkOutInspectItem(params).then(res=>{
                    let data=res.data.data;
                    if(res.data.errMsg=='Success'&&data.length!=0){
                        sessionStorage.setItem('STORE_ROW',JSON.stringify(row));
                        self.$router.push({name:'门店详情',params:row});
                    }
                    else{
                        self.notify('当前门店未绑定巡检项，请先绑定巡检项！','warning',3000);
                        return false;
                    }
                })
                
            },
            getStoreData(params){
                let self=this;
                return new Promise((resolve,reject)=>{
                    api.getStoreList(params).then(res=>{
                        let errMsg=res.data.errMsg;
                        if(errMsg!=undefined&&errMsg=='Success'){
                            let data=res.data.data;
                            resolve(data);
                        }
                    })
                })
            },
            getNapeList(){
                return new Promise((resolve,reject)=>{
                    api.getInspectItemList().then(res=>{
                        let code=res.data.errMsg;
                        let data=res.data.data;
                        if(code!=null&&code=='Success'){
                            console.log(res.data);
                        }
                        resolve(data);
                    })
                })
            },
            getStoreByTag(tag){
                return new Promise((resolve,reject)=>{
                    let params={
                        tagName:tag
                    };
                    api.getInspectBindList(params).then(res=>{
                        console.log(res);
                        resolve(res.data.data);
                    })
                })
            },
            async getBindInfo(){
                let self=this;
                let data=await self.getNapeList();
                let temp=[];
                let tagList=[];
                if(data.length!=0){
                    data.forEach(item=>{
                        let tag=item.tag;
                        if(tagList.indexOf(tag)==-1){
                            tagList.push(tag);
                        }
                    })
                   for(const item of tagList){
                        let data=await self.getStoreByTag(item);
                        let obj={
                            tag:item,
                            data:data
                        };
                        temp.push(obj);
                    }
                    self.tagList=temp;
                }
                else{
                    console.log('当前没有巡检表信息');
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
            let self=this;
            let windowHeight=window.innerHeight;
            if(windowHeight>800){
                this.tableHeight=770+'px';
            }
            console.log(this.tableHeight);
            self.getBindInfo();
            self.getProvinceList();
            self.getInitData();
            // if(!this.timeid){
            //     this.timeid=window.setInterval(this.getStoreList(this.params),60*1000);
            // }
        },
        // beforeDestroy(){
        //    window.clearInterval(this.timeid);
        // },
        // activated(){
        //     this.getEventList(this.params);
        // }
    }
</script>

<style lang="scss" scoped>
@import '../../../assets/css/textStyle.css'; 
.el-event-content{
    width: 100%;
    position: relative;
    .seacrh-content{
        padding-left: 30px;
        margin-top: 30px;
        margin-bottom: 20px;
        position: relative;
        text-align: left;
        .el-province{
            width: 160px;
            margin-right: 20px;
            margin-left: 15px;
        }
        .el-search-btn{
            width: 90px;
            text-align: center;
            margin-left: 15px;
            background-color: #FB505F;
            color: #fff;
        }
        .city-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            
            #elCity{
                width: 160px;
                border-radius: 0px;
                background-color: #f0f5f8;
            }
            .el-input{
                width: 160px;
            }
            .input-arrow-panel{
                width: 160px;
                height: 28px;
                position: absolute;
                background-color: transparent;
                cursor: pointer;
                z-index: 100;
            }
            .icon-input{
                position: absolute;
                right: 10px;
                top: 6px;
            }
        }
        .city-panel{
            position: absolute;
            margin-top: 3px;
            left: 315px;
            width: 55%;
            height: auto;
            padding: 10px 0px 30px 15px;
            z-index: 980;
            background-color: #fff;
            border: 1px solid #ddd;
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
        .el-search-input{
            width:180px;
            margin-right:20px;
            position:absolute;
            right: 0px;
        }
    }
    .el-table-content{
        width: 97.46%;
        float: left;
        background-color: #fff;
    }
    
}
.empty-data-icon{
    font-size: 22px;
    color: #53c247;
}
</style>
<style scoped>
    .page-login-toolTipClass{
        background-color: #2992FF !important;
        color: red;
    }
    .el-select >>> .el-input__inner{
        background: #F4F5F9 !important;
        border-radius: 0px !important;
    }
    .el-input--small >>>.el-input__inner{
        background: #F4F5F9 !important;
        border-radius: 15px !important;
    }
</style>
<style>
    .el-tooltip__popper.is-light{
        background: #E2F3FD !important;
        color: #4b5262 !important;
        border: 1px solid #2992FF !important;
    }
    #elCity{
        border-radius: 0px;
        background-color: #F4F5F9;
    }
    .el-checkbox__inner:hover{
        border-color: #FB505F !important;
    }
    .el-checkbox.is-bordered.is-checked{border-color:#FB505F}
    .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: #FB505F !important;
        border-color:#FB505F !important;
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

