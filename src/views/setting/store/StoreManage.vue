<template>
    <div class="el-event-content">
       <div class="seacrh-content">
            <span class="select-title">按省份选择</span>
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
            height="470px"
            @sort-change='sortChange'
            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;">
                <el-table-column
                    width=""
                    header-align="center"
                    align="center">
                        <template slot-scope="scope" >
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#FEA316;" v-if="scope.row.device.length==0" >未关联</span>
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#6097F4;" v-else>已关联</span>       
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
            <div class="toolbar pagination" style="width:100%; margin:10 15px;height:12%;margin-bottom:0px;">
              <el-pagination background small 
                :page-sizes="[10, 20, 50, 100]"
                @size-change="sizeChange"
                @current-change="currentChange"
              layout="jumper,total, prev, pager, next,sizes"  :page-size="sizeNum" :total="total" style="float:right;">
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
                multeCityList:[]
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
            getCityByProvince(province){
                let self=this;
                let temp=[];
                self.tempStoreData.forEach(item=>{
                    if(item.province==province){
                        let obj={};
                        obj.cityName=item.city;
                        obj.checked=false;
                        temp.push(obj);
                    }
                })
                self.cityList=temp;
            },
            async getProvinceList(){
                let self=this;
                let params={};
                let data=await self.getStoreData(params);
                self.tempStoreData=data;
                let temp=[];
                if(data!=undefined&&data.length!=0){
                    data.forEach(item=>{
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
            async getInitList(){
                let self=this;
                let params={
                    "filter": {
                        "page": 0,
                        "size": 100
                    }
                };
                self.storeData=await self.getStoreData(params);
                let temp=[];
                self.storeData.forEach(item=>{
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
            },
            selectChange(){

            },
            searchNape(){

            },
            searchEventList(){

            },
            sortChange(){

            },
            toEventDetail(row){
                let self=this;
                console.log(row);
                self.$router.push({name:'门店详情',params:row});
            },
            getStoreData(params){
                let self=this;
                return new Promise((resolve,reject)=>{
                    api.getStoreList(params).then(res=>{
                        let errMsg=res.data.errMsg;
                        if(errMsg!=undefined&&errMsg=='Success'){
                            let data=res.data.data.content;
                            resolve(data);
                        }
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
           
        },
        mounted(){
            let self=this;
            self.getProvinceList();
            self.getInitList();
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
        .city-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            #elCity{
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
            margin-left: 3px;
            left: 27%;
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
        background: #f0f5f8 !important;
        border-radius: 0px !important;
        border: 0px !important;
    }
    .el-input--small >>>.el-input__inner{
        background: #f0f5f8 !important;
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
        background-color: #f0f5f8;
        border-width:0px;
    }
</style>

