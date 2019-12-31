<template>
    <div class="el-event-content" :style="{'height':windowHeight-142+'px'}">
       <div class="seacrh-content">
            <span class="select-title">{{generateStoreLang('provinceTitle')}}</span>
            <el-select v-model="curProvince"  :placeholder="generateStoreLang('provincePlaceholder')" size="mini"
             class="el-province" @change="changePro" @clear="clearCitys">
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
                <div slot="reference" @click="choiceCity" class="city-input"><span>{{curCitys}}</span><i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i></div>
            </el-popover>

            <el-button :size="varyWindowWidth>1680?'small':'mini'"  :class="lang=='en'? 'en-el-search-btn': 'el-search-btn'" @click="searchStore" type="primary">{{generateStoreLang('searchButton')}}</el-button>
            <el-input
                size="small"
                class="el-search-input"
                clearable
                v-model="serachVale" @keyup.enter.native="searchEventList" @clear="searchEventList">
                <i slot="prefix" class="iconfont icon-sousuo iconsou"></i>
            </el-input>
       </div>
        <div class="el-table-content">
            <el-table
            :data="tableData"
            :highlight-current-row="true"
            :empty-text="generateStoreLang('noStoreData')"
            align='left'
            stripe
            :height="tableHieght"
            @sort-change='sortChange'
            @row-click='rowClickItem'
            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;"
            :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
            :cell-style="cellStyle"
            >
                <el-table-column
                    min-width="140"
                    header-align="center"
                    align="center">
                        <template slot-scope="scope" v-if="scope.row.showTag">
                        <span class="icon-span" style="background-color:#6097F4;"
                              v-if="scope.row.bindDevice" ><i class="iconfont icon-yichangshijianliebiaocopy"></i> <span>{{generateStoreLang('binded')}}</span></span>
                        <span class="icon-span" style="background-color:#FEA316;"
                              v-else><i class="iconfont icon-yichangshijianliebiaocopy"></i> <span>{{generateStoreLang('unbinded')}}</span></span>
                    </template>
                </el-table-column>
            <el-table-column v-for="(item,index) in tableInfoData" :key="index"
                :prop="item.prop" :label="item.label" :sortable="item.sortable" :min-width="item.width">
            </el-table-column>
            <el-table-column
                prop="napeTable"
                :label="generateStoreLang('bindInspectList')"
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
                :label="generateStoreLang('bindSchedule')"
                min-width="100"
                align="left">

            </el-table-column>
            <el-table-column
                prop="option"
                :label="generateStoreLang('operation')"
                align="left"
                min-width="100"
            >
                <template slot-scope="scope">
                    <i class="iconfont icon-gengduo" style="cursor: pointer; vertical-align: middle" @click="toEventDetail(scope.row)"></i>
                </template>
            </el-table-column>
            <div slot="empty">
                <div>
                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">{{noData}}</span>
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
import {mapGetters} from 'vuex'
import {getInspectBindCount} from '@/api/inspect'
import {getStoreList} from '@/api/store'
import {isLoginIn} from '@/api/login'
import PubSub from 'pubsub-js'
import {generateStoreLang} from '@/api/i18n'

    export default {
        name: "StoreManage",
        data(){
            return{
                tableInfoData:[
                     {
                        "prop":"name",
                        "label":this.$t('storeView.storeName'),
                        "sortable":'custom',
                        "width":130
                    },
                    {
                        // "prop":"userName",
                        "prop":"supervisorName",
                        "label":this.$t('storeView.supervisor'),
                        "sortable":'custom',
                        "width":120
                    },
                    {
                      "prop":"userName",
                      "label":this.$t('storeView.solver'),
                      "sortable": false,
                      "width":100
                    },
                    {
                        "prop":"phone",
                        "label":this.$t('storeView.contact'),
                        "sortable":false,
                        "width":120
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
                varyWindowWidth:window.innerWidth,
                params:{},
                total:0,
                sizeNum:10,
                page:1,
                serachVale:'',
                timeid:0,
                isChecked:false,
                curCitys:'城市',
                showPopoVer:true,
                lang: this.$i18n.locale,
                noData: ''
            }
        },
        watch:{
            accountChanged(val,oldVal){
                console.log(val);
                let self=this;
                if(val!=0){
                    self.getProvinceList();
                    self.getInitData();
                }
            }
        },
        computed:{
            tableHieght(){
              console.log(this.windowHeight);
              if(this.windowHeight>800){
                    return this.windowHeight*0.70;
                }
                else if(this.windowHeight>700){
                    return this.windowHeight*0.67;
                }
                else{
                    return this.windowHeight*0.55;
                }
            },
            ...mapGetters({accountChanged:'accountChanged'})
        },
        methods:{
          cellStyle({ row, column, rowIndex, columnIndex}){
            console.log(row);
            console.log(columnIndex);
            let obj = {};
            if(columnIndex == 0){
              obj = {'border-left': '1px solid #e3e9f4','border-right':'1px solid #e3e9f4'};
            }
            else{
              obj = {'border-right':'1px solid #e3e9f4'}
            }
            return obj;
          },
            generateStoreLang,
            changePro(val){
                let self=this;
                if(val == ''){
                  self.cityList=[];
                  self.showCityContent=false;
                  self.curCitys=this.$t('storeView.cityPlaceholder');
                  self.multeCityList.length=0;
                }
                else{
                  self.getCityByProvince(val);
                  self.curCitys=this.$t('storeView.cityPlaceholder');
                  self.multeCityList.length=0;
                  self.allCityChecked=false;
                }
            },
            clearCitys(){
                let self=this;
                self.cityList=[];
                self.showCityContent=false;
                self.curCitys=this.$t('storeView.cityPlaceholder');
                self.multeCityList.length=0;
            },
            choiceCity(){
                let self=this;
                if(self.curProvince.length==0){
                    self.notify(this.$t('storeView.selectProviceInfo'),'warning',3000);
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
                    //self.curCitys='城市'
                    self.curCitys=this.$t('storeView.cityPlaceholder');
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
                self.curCitys='';
                self.curCitys=str.substring(0,str.length-1);
                if(temp.length==self.cityList.length){
                    self.allCityChecked=true;
                }
                else{
                    self.allCityChecked=false;
                }
                if(temp.length==0){
                    //self.curCitys='城市';
                    self.curCitys=this.$t('storeView.cityPlaceholder');
                }
                self.multeCityList=temp;
            },
            searchStore(){
                let self=this;
                self.params.like={};
                let temp=[];
                self.page=1;
                self.cityList.forEach(item=>{
                    if(item.checked){
                        temp.push(item.cityName);
                    }
                })
                if(self.curProvince!= null && self.curProvince.length!=0){
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
                let dom=document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0];
                let offestTop=dom.offsetTop;
                if(dom!=undefined){
                    document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0].scrollTop=0;
                }
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
                temp.length>0 ? temp.unshift({value:'', label:self.$t('storeView.provincePlaceholder'),}) : temp;
                self.provinceList=temp;
            },
            clearPage(){
                let self=this;
                self.params={};
                self.curProvince='';
                //self.curCitys='城市';
                self.curCitys=this.$t('storeView.cityPlaceholder');
                self.serachVale='';
                self.multeCityList=[];
            },
            getInitData(){
                let self=this;
                self.clearPage();
                self.params.filter={
                    'page':self.page-1,
                    'size':self.sizeNum
                };
                self.getStoreList(self.params);
            },
            async getStoreList(params){
                let self=this;
                params.filter={page:this.page-1,size:this.sizeNum};
                let data=await self.getStoreData(params);
                self.storeData=data.data;
                let temp=[];
                self.storeData.content.forEach(item=>{
                  console.log(item)
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
                    obj.supervisorName = item.supervisorName; //督导名称
                    obj.supervisorId = item.supervisorId; //督导编号
                    obj.phone=item.phoneNumber;
                    obj.favorite=item.favorite;
                    obj.napeTable=item.appliedInspect.length!=0?item.appliedInspect.join('，'):'--';
                    obj.schedue='--',
                    obj.device=item.device;
                    temp.push(obj);
                })
                let paramsGetBind={
                    "storeIds": temp.map(x=>x.storeId)
                };
                let tempStoreId=temp.map(x=>x.storeId);
                self.tableData=temp;
                console.log(self.tableData)
                if(self.tableData.length == 0){
                  self.noData = self.$t('storeView.noStoreData')
                }
                self.total=self.storeData.totalElements;
                if(paramsGetBind.storeIds.length!=0){
                    getInspectBindCount(paramsGetBind).then(res=>{
                        let data=res.data;
                        let tempRet=[];
                        for(let i=0;i<tempStoreId.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(tempStoreId[i]==data[j].storeId){
                                    tempRet.push(data[j]);
                                }
                            }
                        }
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
                //self.curCitys='城市';
                self.curCitys=this.$t('storeView.cityPlaceholder');
                self.page=1;
                if(self.serachVale.length!=0){
                    self.params.like={
                        "name": self.serachVale,
                       // "userName": self.serachVale,
                        "supervisorName" : self.serachVale,
                    };
                }
                else{
                    self.params.like={};
                }

                self.getStoreList(self.params);
            },
            sortChange(column){
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
                self.$router.push({name:'storeDetail',params:row});
            },
            rowClickItem(row,column,event){
                let self=this;
                sessionStorage.setItem('STORE_ROW',JSON.stringify(row));
                self.$router.push({name:'storeDetail',params:row});
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
                        resolve(res);
                    })
                })
            },
            isLoginIn(){
                let self=this;
                return new Promise((resolve,reject)=>{
                    isLoginIn().then(res=>{
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
            self.getProvinceList();
            self.getInitData();
            //await this.isLoginIn();
            // if(!this.timeid){
            //     this.timeid=window.setInterval(this.getStoreList(this.params),60*1000);
            // }
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
  $border:#e3e9f4;
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
.el-event-content{
    width: 100%;
    position: relative;
    border: 1px solid $border;
    background-color: #fff;
    .elcheckBox {
        margin-right: 10px !important;
    }
    .seacrh-content{
        @include point(padding-left,30);
        @include point(height,60);
        @include point(line-height,60);
        position: relative;
        text-align: left;
        border-bottom: 0.5px solid #e3e9f4;
        .select-title{
            color: #424151;
            font-size: 14px;
        }
        .el-province{
            width: calc(160/1920*100vw);
            @include point(margin-right,20);
            @include point(margin-left,15);
            position: relative;
            @include point(bottom,1);
        }
        .el-search-btn{
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            width: calc(130/1920*100vw);
            padding: 0 0;
            @include point(margin-left,15);
            color: #fff;
            position: relative;
            @include point(bottom,1);
        }
        .en-el-search-btn{
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          width: calc(130/1920*100vw);
          padding: 0 0;
          text-align: center;
          @include point(margin-left,15);
          color: #fff;
          position: relative;
          @include point(bottom,1);
        }
        .city-input{
            width: calc(160/1920*100vw);
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            background: #F4F5F9 !important;
            cursor: pointer;
            display:inline-block;
            position: relative;
            border: 1px solid #DCDFE6;
            box-sizing: border-box;
            vertical-align: middle;
            border-radius: 3px;
            overflow: hidden;
            /*@media screen and (max-width: 1920px){*/
            /*  top: 12px;*/
            /*}*/
            /*@media screen and (max-width: 1600px){*/
            /*  top: 10px;*/
            /*}*/
            /*@media screen and (max-width: 1280px){*/
            /*  top: 8px;*/
            /*}*/
            /*top: 8px;*/
            span{
                display: inline-block;
                font-size: 12px;
                color: #7d8cad;
                margin-left: 15px;
                @include point(width,130);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .icon-input{
                position: absolute;
                @include point(right,10);
                top: 10px;
                font-size: 14px;
                color: #C0C4CC;
              @media screen and(max-width: 1440px){
                top: 6px;
              }
              @media screen and(max-width: 1280px){
                top: 4px;
              }
            }
        }
        .el-search-input{
            @include point(width,180);
            @include point(margin-right,20);
            position:absolute;
            right: 0px;
        }
        .iconsou{
            position:relative;
            left:6px;
            font-size:18px;
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
            width: 92px;
            height:22px;
            color:white;
            padding-left:5px;
            padding-right:5px;
            font-size: 12px;
            span{
              position: relative;
              @include point(bottom, 1);
            }

        }
        .icon-gengduo{
          font-size: calc(24/1920*100vw);
          color: #7d8cad;
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
        border: 1px solid #E4E7ED !important;
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
    .current-row > td {
        background: #FEE7E4 !important;
    }
    .el-table tbody tr:hover>td {
        background-color: #FDE8EF !important;
    }
    /*.el-table--border th{*/
        /*border-right: 0 !important;*/
    /*}*/
    /*.el-table--border, .el-table--group{*/
        /*border: none !important;*/
    /*}*/
    .el-table__header-wrapper th:nth-last-of-type(2){
        border-right: none !important;
    }
    .el-table--border td:nth-last-of-type(1){
        border-right: none !important;
    }
    .el-table--border::after, .el-table--group::after{
        width: 0 !important;
    }
    .title-table .el-table--border{
      border-left: none;
    }
    .el-table__row{
      height: calc(60/1920*100vw);
      font-size: calc(14/1920*100vw);
      color: #182752;
    }
    .el-table-content .el-table .cell{
      padding-left: calc(20/1920*100vw);
      padding-right: calc(20/1920*100vw);
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td{
      background-color: #f7f8fb;
    }
    .el-table__header{
      font-size: calc(12/1920*100vw);
    }
</style>

