<template>
    <div class="el-event-content" :style="{'height':windowHeight-138+'px'}">
       <div class="seacrh-content">
            <span class="select-title">按省份选择</span>
             <el-select v-model="curProvince" clearable  placeholder="省份" size="mini" 
             class="el-province" @change="changePro" @clear="clearCitys" :popper-class="popperClass">
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
            <el-button size="mini" class="el-search-btn" @click="searchStore" type="primary">搜索</el-button>
            <div class="city-panel" v-if="showCityContent" @mouseleave="showCityContent=false"> 
                <p :style="isChecked?{}:{'color':'#FB4C5D'}"><el-checkbox v-model="allCityChecked" @change="choiceAllCity"
                    style="margin-right:10px;"></el-checkbox>全部</p>
                <div class="city-details" v-for="(item,index) in cityList" :key="index">
                    <el-checkbox v-model="item.checked" @change="changeCityItem(item)" class="elcheckBox"></el-checkbox>
                    <span>{{item.cityName}}</span>
                </div>
            </div>
            <el-input
                size="small"
                class="el-search-input"
                clearable
                v-model="serachVale" @keyup.enter.native="searchEventList" @clear="searchEventList">
                <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
            </el-input>
       </div>
        <div class="el-table-content">
            <el-table 
            :data="tableData" 
            :highlight-current-row="true"
            empty-text='没有门店信息'
            align='left'
            :height="tableHieght"
            @sort-change='sortChange'
            @row-click='rowClickItem'
            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;">
                <el-table-column
                    min-width="120"
                    header-align="center"
                    align="center">
                        <template slot-scope="scope" v-if="scope.row.showTag">
                        <span class="icon-span" style="background-color:#6097F4;" 
                        v-if="scope.row.bindDevice" ><i class="iconfont icon-yichangshijianliebiaocopy"></i> 已关联</span>
                        <span class="icon-span" style="background-color:#FEA316;" 
                        v-else><i class="iconfont icon-yichangshijianliebiaocopy"></i> 未关联</span>       
                    </template>
                </el-table-column>
            <el-table-column v-for="(item,index) in tableInfoData" :key="index"
                :prop="item.prop" :label="item.label" :sortable="item.sortable" :min-width="item.width">
            </el-table-column>
            <el-table-column
                prop="napeTable"
                label="关联巡检表"
                min-width="160"
                align="left">
                <template slot-scope="scope">
                    <el-popover
                    v-if="scope.row.napeTable.length!=0&&(scope.row.napeTable!='--'&&scope.row.napwTable!='现场巡检')"
                        placement="top-start"
                        width="200"
                        trigger="hover">
                        <span v-for="(_item,_index) in scope.row.napeTable.split('，')"
                        :key="_index">
                            {{_item}}
                        </span>
                        <!-- :style="_item=='远程巡检'?{'color':'red','font-weight':'bold'}:{}" -->
                        <span class="napeTable-prp" slot="reference">{{scope.row.napeTable}}</span>
                    </el-popover>
                    <span v-else>
                        {{scope.row.napeTable}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="schedue"
                label="巡检排程"
                min-width="120"
                align="left">

            </el-table-column>
            <el-table-column
                prop="option"
                label="操作"
                min-width="60"
                align="left">
                <template slot-scope="scope">
                    <i class="iconfont icon-gengduo" style="font-size:20px;cursor: pointer;" @click="toEventDetail(scope.row)"></i>
                </template>
            </el-table-column>
            <div slot="empty">
                <div>
                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">无门店数据</span>
                </div> 
            </div>
        </el-table>
            <div class="toolbar pagination" style="width:100%; margin:10px 15px;height:12%;">
              <el-pagination background small 
                :page-sizes="[10, 20, 50, 100]"
                @size-change="sizeChange"
                @current-change="currentChange"
              layout="jumper,total, prev, pager, next,sizes"  
              :page-size="sizeNum" :total="total" 
              :current-page="page"
              style="float:right;margin-top:15px;">
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api/index'
import {getInspectBindCount} from '@/api/inspect'
import {getStoreList} from '@/api/store'
import {isLoginIn} from '@/api/login'
import PubSub from 'pubsub-js'
    export default {
        name: "StoreManage",
        data(){
            return{
                citys:'',
                tableInfoData:[
                     {
                        "prop":"name",
                        "label":"门店名称",
                        "sortable":'custom',
                        "width":160
                    },
                    {
                        "prop":"userName",
                        "label":"负责人",
                        "sortable":'custom',
                        "width":120
                    },
                    {
                        "prop":"phone",
                        "label":"联系方式",
                        "sortable":false,
                        "width":160
                    },
                ],
                allCityChecked:false,
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
                page:1,
                serachVale:'',
                timeid:0,
                isChecked:false,
                popperClass:'province-popper'
            }
        },
        computed:{
            tableHieght(){
                if(this.windowHeight>800){
                    return this.windowHeight*0.72;
                }
                else if(this.windowHeight>700){
                    return this.windowHeight*0.67;
                }
                else{
                    return this.windowHeight*0.63;
                }
            }
        },
        methods:{
            changePro(val){
                let self=this;
                console.log(val);
                self.getCityByProvince(val);
                self.citys='';
                self.multeCityList.length=0;
                self.allCityChecked=false;
            },
            clearCitys(){
                let self=this;
                self.cityList=[];
                
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
                self.isChecked=val;
                self.citys=str.substring(0,str.length-1);
                self.multeCityList=temp;
            },
            changeCityItem(item){
                console.log(item);
                let self=this;
                let str='';
                //let flag=false;
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
                self.citys=str.substring(0,str.length-1);
                if(temp.length==self.cityList.length){
                    self.allCityChecked=true;
                }
                else{
                    self.allCityChecked=false;
                }
                self.multeCityList=temp;
            },
            searchStore(){
                let self=this;
                self.showCityContent=false;
                //self.serachVale='';
                self.params.like={};
                let temp=[];
                self.page=1;
                self.cityList.forEach(item=>{
                    if(item.checked){
                        temp.push(item.cityName);
                    }
                })
                if(self.curProvince.length!=0){
                    if(temp.length!=0){
                        self.params.clause={
                            city:temp,
                            province:self.curProvince
                        };
                    }
                    else{
                        self.params.clause={
                            province:self.curProvince
                        }
                    }
                }
                else{
                    self.params.clause={};
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
                self.page=val;
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
                let params={
                    "filter":{
                        "page":0,
                        "size":1000
                    }
                };
                let data=await self.getStoreData(params);
                if(data.response!=undefined&&data.response.status==500){
                    return false;
                }
                self.tempStoreData=data.data.content;
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
            getInitData(){
                let self=this;
                self.params.filter={
                    'page':self.page-1,
                    'size':self.sizeNum
                };
                self.getStoreList(self.params);
            },
            async getStoreList(params){
                let self=this;
                console.log(params);
                params.filter={page:this.page-1,size:this.sizeNum};
                let data=await self.getStoreData(params);

                self.storeData=data.data;
                console.log(self.storeData);
                let temp=[];
                self.storeData.content.forEach(item=>{
                    let obj={};
                    if(item.appliedInspect.indexOf('远程巡检')==-1){
                        obj.showTag=false;
                    }
                    else{
                        obj.showTag=true;
                    }
                    obj.bindDevice=false;
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userName=item.userName;
                    obj.userId=item.userId;
                    obj.phone=item.phoneNumber;
                    obj.favorite=item.favorite;
                    obj.napeTable=item.appliedInspect.length!=0?item.appliedInspect.join('，'):'--';
                    obj.schedue='---',
                    obj.device=item.device;
                    temp.push(obj);
                })
                let paramsGetBind={
                    "storeIds": temp.map(x=>x.storeId)
                };
                let tempStoreId=temp.map(x=>x.storeId);
                self.tableData=temp;
                self.total=self.storeData.totalElements;
                if(paramsGetBind.storeIds.length!=0){
                    getInspectBindCount(paramsGetBind).then(res=>{
                        let data=res.data;
                        console.log(data);
                        let tempRet=[];

                        for(let i=0;i<tempStoreId.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(tempStoreId[i]==data[j].storeId){
                                    tempRet.push(data[j]);
                                }
                            }
                        }
                        console.log(tempRet);
                        for(let i=0;i<data.length;i++){
                            self.tableData[i].bindDevice=(tempRet[i].unbindCount==0)?true:false;
                        }
                    })
                }
            },
            searchEventList(){
                let self=this;
                self.params.clause={};
                self.curProvince='';
                self.citys='';
                self.page=1;
                if(self.serachVale.length!=0){
                    self.params.like={
                        "name": self.serachVale,
                        "userName": self.serachVale
                    };
                }
                else{
                    self.params.like={};
                }
                
                self.getStoreList(self.params);
            },
            sortChange(column){
                console.log(column);
                let self=this;
                self.params.order={
                    direction:column.order=='ascending'?'asc':'desc',
                    property:column.prop
                };
                self.page=1;
                self.getStoreList(self.params);
            },
            getINspectItemResult(){

            },
            toEventDetail(row){
                let self=this;
                sessionStorage.setItem('STORE_ROW',JSON.stringify(row));
                self.$router.push({name:'门店详情',params:row});
            },
            rowClickItem(row,column,event){
                let self=this;
                sessionStorage.setItem('STORE_ROW',JSON.stringify(row));
                self.$router.push({name:'门店详情',params:row});
            },
            getStoreData(params){
                let self=this;
                return new Promise((resolve,reject)=>{
                    getStoreList(params).then(res=>{
                        let errMsg=res.errMsg;
                        if(errMsg!=undefined&&errMsg=='Success'){
                            let data=res.data;
                            resolve(res);
                        }
                    }).catch(res => {
                        console.log(res);
                        resolve(res);
                    })
                })
            },
            isLoginIn(){
                let self=this;
                return new Promise((resolve,reject)=>{
                    isLoginIn().then(res=>{
                        console.log(res);
                        self.getProvinceList();
                        self.getInitData();
                        resolve(res);
                    })
                }).catch(err=>{
                    console.log(err);
                })
            },
            notify(msg,type,time) {
                this.$message({
                    message: msg,
                    type: type,
                    duration:time
                });
            },
           
        },
        async  mounted(){
            let self=this;
            let windowHeight=window.innerHeight;
            if(windowHeight>800){
                this.tableHeight=770+'px';
                this.sizeNum=20;
            }
            console.log(this.tableHeight);
            await this.isLoginIn();
            if(!this.timeid){
                this.timeid=window.setInterval(this.getStoreList(this.params),60*1000);
            }
        },
        beforeRouteEnter(to, from, next){
            console.log(to);
            next(vm=>{
                console.log(vm);
                PubSub.publish('change-color',{showTag:false});
            })
        },
        beforeDestroy(){
           window.clearInterval(this.timeid);
        },
        activated(){
            this.getStoreList(this.params);
        },
    }
</script>

<style lang="scss" scoped>
@import '../../../assets/css/textStyle.css'; 
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
 $red:#f31d65;
.el-event-content{
    width: 100%;
    position: relative;
    .elcheckBox {
        margin-right: 10px !important;
    }
    .seacrh-content{
        @include point(padding-left,30);
        @include point(margin-top,20);
        @include point(padding-bottom,20);
        position: relative;
        text-align: left;
        border-bottom: 0.5px solid #e3e9f4;
        .select-title{
            color: #424151;
            font-size: 14px;
        }
        .el-province{
            @include point(width,160);
            @include point(margin-right,20);
            @include point(margin-left,15);
        }
        .el-search-btn{
            width: 90px;
            text-align: center;
            @include point(margin-left,15);
            color: #fff;
            height: 30px;
        }
        .city-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            #elCity{
                @include point(width,160);
                border-radius: 0px;
                background-color: #f0f5f8;
            }
            .input-arrow-panel{
                @include point(width,160);
                @include point(height,28);
                position: absolute;
                background-color: transparent;
                cursor: pointer;
                z-index: 100;
            }
            .icon-input{
                position: absolute;
                @include point(right,10);
                @include point(top,6);
            }
        }
        .city-panel{
            position: absolute;
            @include point(margin-top,3);
            @include point(left,305);
            width: 55%;
            @include point(height,auto);
            padding: 10px 0px 30px 15px;
            z-index: 980;
            background-color: #fff;
            border: 1px solid #ddd;
            font-size: 14px;
            p{
                font-weight: bold;
            }
            .city-details{
                width: auto;
                min-width: 12.5%;
                display: inline-block;
                @include point(margin-top,10);
            }
        }
        .el-search-input{
            @include point(width,180);
            @include point(margin-right,20);
            position:absolute;
            right: 0px;
        }
    }
    .el-table-content{
        width: 97.46%;
        float: left;
        background-color: #fff;
        .napeTable-prp{
            width: 70%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: pointer;
        }
        .icon-span{
            display:inline-block;
            width: 72px;
            height:22px;
            color:white;
            padding-left:5px;
            padding-right:5px;
            font-size: 12px;
        }
    }
}
.empty-data-icon{
    font-size: 22px;
    color: #53c247;
}
</style>
<style scoped>
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
@import '../../../assets/css/pagination.css';
    .el-table::before{
        height: 0px !important;
    }
    #elCity{
        border-radius: 0px;
        background-color: #F4F5F9;
    }
    .current-row > td {
        background: #FEE7E4 !important;
    }
</style>

