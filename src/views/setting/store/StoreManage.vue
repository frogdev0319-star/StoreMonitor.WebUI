<template>
    <div class="el-event-content" :style="{'height':windowHeight-142+'px'}">
       <el-col :span="24" class="seacrh-content">
            <span class="select-title">{{$t('reportView.selectStores')}}</span>
            <el-select v-model="curCountry"  :placeholder="$t('reportView.country')" size="mini"
                     class="el-province" @change="changeCountry">
                <el-option-group
                v-for="group in CountryList"
                :key="group.label"
                :label="group.label">
                <el-option
                    v-for="item in group.countryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-option-group>
            </el-select>
            <el-select v-model="curStoreTag" clearable :placeholder="$t('reportView.selectStoreTag')" size="mini"
             class="el-province" @change="changeStoreTag" :disabled="curProvince.length!=0">
                    <el-option
                    v-for="item in StoreTagList"
                    :key="item.tagId"
                    :label="item.tagName"
                    :value="item.tagId">
                    </el-option>
            </el-select>
            <region-multi-select :selected="curProvince" :placeholder="$t('reportView.regionI')" :options="provinceList" @changeInput="handleProChange"
                                style="display: inline;margin-left: calc(20/1920*100vw);" ref="proviceSelect" :disabled="curCountry.length==0||curStoreTag!=''" :all="$t('overview.allZoneI')"></region-multi-select>
            <region-multi-select :selected="curCity" :placeholder="$t('reportView.regionII')" :options="cityList" @changeInput="handleCityChange"
                                style="display: inline;" ref="citySelect" :disabled="curProvince.length==0||curStoreTag!=''" :all="$t('overview.allZoneII')"></region-multi-select>

            <multi-select :selected="curStore" :placeholder="$t('reportView.stores')" :options="storeDataList" @changeInput="handleStoreChange"
                                style="display: inline;" ref="multiSelect"></multi-select>
            <el-input
                size="small"
                class="el-search-input"
                clearable
                v-model="serachVale" @keyup.enter.native="searchEventList" @clear="searchEventList">
                <i slot="prefix" class="iconfont icon-sousuo iconsou"></i>
            </el-input>
            <div class="store-handle">
              <el-col :span="24" class="header-details1">
                <span class="choice-store"><i class="iconfont icon-tishi1"></i>{{$t('reportView.selected')}}<span class="storename-str" style="margin-left:20px;">{{storeStr}}</span></span>
              </el-col>
            </div>
       </el-col>
        <el-col :span="24" class="el-table-content">
            <el-table
            :data="tableData"
            :highlight-current-row="true"
            :empty-text="generateStoreLang('noStoreData')"
            align='left'
            stripe
            :height="tableHieght"
            @sort-change='sortChange'
            @row-click='toEventDetail'
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
                <!-- <el-table-column prop="schedue"
                    :label="generateStoreLang('bindSchedule')"
                    min-width="100"
                    align="left">

                </el-table-column> -->
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
                        <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262'}">{{noData}}</span>
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
        </el-col>
    </div>
</template>

<script>
import api from '@/api/index'
import {mapGetters} from 'vuex'
import {getInspectBindCount} from '@/api/inspect'
import {getStoreList,getBriefStoreList,GetTagList} from '@/api/store'
import {isLoginIn} from '@/api/login'
import PubSub from 'pubsub-js'
import {generateStoreLang} from '@/api/i18n'
import MultiSelect from '@/components/MultiSelect'
import RegionMultiSelect from '@/components/RegionMultiSelect'

    export default {
        name: "StoreManage",
        components: {
            MultiSelect,
            RegionMultiSelect
        },
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
                storeDataList:[],
                CountryList:[],
                StoreTagList:[],
                curCountry:'',
                curProvince:[],
                curCity:[],
                curStore:[],
                curStoreTag:'',
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
                noData: '',
                storeStr:''
            }
        },
        watch:{
            accountChanged(val,oldVal){
                console.log(val);
                let self=this;
                if(val!=0){
                    // self.getProvinceList();
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
            changeStoreTag(val){
                let self=this
                let temp=[]
                self.clearStoreInfo();
                self.tempStoreData.forEach(item=>{
                    item.tagIds.forEach(_item=>{
                        if(_item==val&&self.curCountry==item.country){
                            let obj={
                                storeId:item.storeId,
                                label:item.name,
                                value:item.name,
                                userId:item.userId,
                                tagIds:item.tagIds
                            };
                            temp.push(obj);
                        }
                    })
                })
                self.storeDataList=temp
                let str = '',storeArr=[],arr=[]
                self.storeDataList.forEach(item=>{
                    storeArr.push(item.storeId)
                    arr.push(item.value)
                })
                self.curStore=storeArr
                arr.forEach(item=>{
                    str+=item+'，'
                })
                str=str.substr(0,str.length-1)
                self.storeStr=str;
                self.searchStore()
            },
            changeCountry(val){
                let self=this;
                let temp=[]
                self.curStoreTag=''
                self.clearProviceInfo()
                self.clearCityInfo();
                self.clearStoreInfo();
                self.selectAllProAndCity(val);
            },
            changePro(val){
                let self=this;
                self.curCity= [];
                self.clearCityInfo();
                self.clearStoreInfo();
                let storeList=self.tempStoreData;
                let temp=[];
                let tempStore=[];
                if(val==''){
                    storeList.forEach(item=>{
                        if(item.country==self.curCountry){
                                let obj={
                                    storeId:item.storeId,
                                    label:item.name,
                                    value:item.name,
                                    userId:item.userId,
                                    tagIds:item.tagIds
                                };
                                tempStore.push(obj);
                        }
                    })
                }else{
                    val.forEach(_item=>{
                        storeList.forEach(item=>{
                            if(item.province==_item){
                            if(temp.map(x=>x.value).indexOf(item.city)==-1){
                                let obj={
                                label:item.city,
                                value:item.city
                                }
                                temp.push(obj);
                            }
                            let obj={
                                storeId:item.storeId,
                                label:item.name,
                                value:item.name,
                                userId:item.userId,
                                tagIds:item.tagIds
                            };
                            tempStore.push(obj);
                            }
                        })
                    })
                    self.cityList=temp;
                    let cityArr=[]
                    if(self.cityList.length!=0){
                    self.cityList.forEach(item=>{
                        cityArr.push(item.value)
                    })
                    self.curCity=cityArr
                }
                }
                self.storeDataList=tempStore;
                let storeArr=[],arr=[]
                
                self.storeDataList.forEach(item=>{
                   storeArr.push(item.storeId)
                   arr.push(item.value)
                })
                
                self.curStore=storeArr
                let str = ''
                arr.forEach(item=>{
                    str+=item+'，'
                })
                str=str.substr(0,str.length-1)
                self.storeStr=str;
                self.searchStore()
            },
            changeCity(val){
                let self=this;
                self.clearStoreInfo();
                let storeList=self.tempStoreData;
                let temp=[];
                if(val.length != 0){
                    val.forEach(_item=>{
                    storeList.forEach(item=>{
                        if(item.city==_item){
                            if(temp.map(x=>x.value).indexOf(item.city)==-1){
                                let obj={
                                storeId:item.storeId,
                                label:item.name,
                                value:item.name,
                                userId:item.userId,
                                tagIds:item.tagIds
                                }
                                temp.push(obj);
                            }
                        }
                    })
                    })
                }
                self.storeDataList=temp;
                let str = '',storeArr=[],arr=[]
                self.storeDataList.forEach(item=>{
                    storeArr.push(item.storeId)
                    arr.push(item.value)
                })
                self.curStore=storeArr
                arr.forEach(item=>{
                    str+=item+'，'
                })
                str=str.substr(0,str.length-1)
                self.storeStr=str;
                self.searchStore()
            },
            handleStoreChange (arr) {
                let self=this;
                self.curStore = arr
                self.changeStore(arr)
            },
            handleProChange(arr){
                let self=this;
                console.log(arr)
                self.curProvince = arr
                self.changePro(arr)
            },
            handleCityChange(arr){
                let self=this;
                console.log(arr)
                self.curCity = arr
                self.changeCity(arr)
            },
            clearStoreInfo(){
                let self=this;
                self.curStore=[];
                self.storeStr='';
                self.$refs.multiSelect.selectedArray = [];
                self.$refs.multiSelect.input=''
            },
            clearProviceInfo(){
                let self=this;
                self.curProvince=[];
                self.$refs.proviceSelect.selectedArray = [];
                self.$refs.proviceSelect.input=''
            },
            clearCityInfo(){
                let self=this;
                self.curCity=[];
                self.$refs.citySelect.selectedArray = [];
                self.$refs.citySelect.input=''
            },
            changeStore(val){
                let self=this;
                let str='';
                self.tempStoreData.forEach((item,index)=>{
                    val.forEach(_item=>{
                    if(item.storeId==_item){
                        str+=item.name+'，'
                    }
                    })
                })
                str=str.substr(0,str.length-1)
                self.storeStr=str;
                self.searchStore()
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
            searchStore(){
                let self=this;
                self.params.like={};
                let temp=[];
                self.page=1;
                let storeList = self.storeStr.split('，')
                if(storeList.length!=0){
                    self.params.clause={
                        name:storeList
                    }
                }else{
                    self.params.clause={};
                }
                // self.cityList.forEach(item=>{
                //     if(item.checked){
                //         temp.push(item.cityName);
                //     }
                // })
                // if(self.curProvince!= null && self.curProvince.length!=0){
                //     if(temp.length!=0){
                //         self.params.clause={
                //             city:temp,
                //             province:self.curProvince
                //         };
                //     }
                //     else{
                //         self.params.clause={
                //             province:self.curProvince
                //         }
                //     }
                // }
                // else{
                //     self.params.clause={};
                // }
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
            // getCityByProvince(province){
            //     let self=this;
            //     let temp=[];
            //     self.tempStoreData.forEach(item=>{
            //         if(item.province==province){
            //             let obj={};
            //             obj.cityName=item.city;
            //             obj.checked=false;
            //             if(temp.map(x=>x.cityName).indexOf(obj.cityName)==-1){
            //                 temp.push(obj);
            //             }
            //         }
            //     })
            //     self.cityList=temp;
            // },
            async getCountryStore(){
                let self=this;
                let data=await self.getBriefStoreData();
                let temp=[]
                if(data.errCode==0&&data.errMsg=='Success'){
                    self.tempStoreData=data.data;
                    if(self.tempStoreData.length!=0){
                        self.tempStoreData.forEach(item=>{
                            let country=item.country;
                            if(temp.map(x=>x.label).indexOf(country)==-1){
                                let obj={
                                    value:country,
                                    label:country
                                }
                                temp.push(obj);
                            }
                        })
                    }
                    // temp.length>0 ? temp.unshift({value:'', label:self.$t('reportView.country')}) : temp;
                    let countryList=temp;
                    self.CountryList[0] = {}
                    self.CountryList[0].label= self.$t('reportView.country');
                    self.CountryList[0].countryList = countryList
                    self.curCountry = countryList[0].label;
                    // self.curCountry=self.CountryList[1].label
                    self.selectAllProAndCity(self.curCountry);
                }
            },
            selectAllProAndCity(val){
                let self = this;
                let storeList = self.tempStoreData;
                let temp = [];
                let tempStore = [];
                storeList.forEach(item=>{
                    if(item.country==val){
                    if(temp.map(x=>x.value).indexOf(item.province)==-1){
                        let obj={
                        label:item.province,
                        value:item.province
                        }
                        temp.push(obj);
                    }
                    let obj={
                        storeId:item.storeId,
                        label:item.name,
                        value:item.name,
                        userId:item.userId,
                        tagIds:item.tagIds
                    };
                    tempStore.push(obj);
                    }
                })
                self.provinceList = temp;
                let cityTemp = [];
                self.provinceList.forEach(_item=>{
                    storeList.forEach(item=>{
                    if(item.province==_item.value){
                        if(cityTemp.map(x=>x.value).indexOf(item.city)==-1){
                        let obj={
                            label:item.city,
                            value:item.city
                        }
                        cityTemp.push(obj);
                        }
                    }
                    })
                })
                self.cityList = cityTemp;
                let provinceArr = [];
                self.provinceList.forEach(item=>{
                    provinceArr.push(item.value)
                })
                self.curProvince = provinceArr;

                let cityArr = [];
                self.cityList.forEach(item=>{
                    cityArr.push(item.value)
                })
                self.curCity = cityArr;
                self.storeDataList = tempStore;
                let storeArr = [];
                self.storeDataList.forEach(item=>{
                    storeArr.push(item.storeId)
                })
                self.curStore = storeArr;
                self.changeStore(self.curStore)
            },
            clearPage(){
                let self=this;
                self.params={};
                self.curProvince=[];
                //self.curCitys='城市';
                self.curCitys=this.$t('storeView.cityPlaceholder');
                self.serachVale='';
                self.multeCityList=[];
                self.curStoreTag=''
            },
            getInitData(){
                let self=this;
                self.clearPage();
                self.getCountryStore()
                self.getTagListData() 
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
                    let obj={};
                    obj.bindDevice=false;
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userName=item.userName;
                    obj.userId=item.userId;
                    obj.supervisorName = item.supervisorName; //督导名称
                    obj.supervisorId = item.supervisorId; //督导编号
                    obj.phone=item.phoneNumber;
                    obj.favorite=item.favorite;
                    obj.appliedInspect=item.appliedInspect
                    if(item.appliedInspect.length!=0){
                        let au_inspect=[]
                        let mode=[]
                        item.appliedInspect.forEach(au_item=>{
                            mode.push(au_item.mode)
                        })
                        if(mode.indexOf(0)!=-1){
                            au_inspect.push(self.$t('overview.remotePatrol'))
                        }
                        if(mode.indexOf(1)!=-1){
                            au_inspect.push(self.$t('overview.onsitePatrol'))
                        }
                        obj.napeTable=au_inspect.join('，')
                    }else{
                        obj.napeTable='--'
                    }
                    if(obj.napeTable.indexOf(self.$t('overview.remotePatrol'))==-1){
                        obj.showTag=false;
                    }
                    else{
                        obj.showTag=true;
                    }
                    // obj.napeTable=item.appliedInspect.length!=0?item.appliedInspect.join('，'):'--';
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
                self.curProvince=[];
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
                if(row.napeTable.indexOf(self.$t('overview.remotePatrol'))!=-1){
                    sessionStorage.setItem('STORE_ROW',JSON.stringify(row));
                    self.$router.push({name:'storeDetail',params:row});
                }else{
                    self.notify(self.$t('insSettingView.storeNoInspect'),'warning',3000);
                    return false;
                }
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
            getBriefStoreData(){
                let self=this;
                return new Promise((resolve,reject)=>{
                    getBriefStoreList().then(res=>{
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
            getTagListData(){
                let self=this;
                return new Promise((resolve,reject)=>{
                    GetTagList().then(res=>{
                        let errMsg=res.errMsg;
                        if(errMsg!=undefined&&errMsg=='Success'){
                            self.StoreTagList=res.data;
                            resolve(res);
                        }
                    }).catch(res => {
                        resolve(res);
                    })
                })
            },
            // isLoginIn(){
            //     let self=this;
            //     return new Promise((resolve,reject)=>{
            //         isLoginIn().then(res=>{
            //             self.getProvinceList();
            //             self.getInitData();
            //             resolve(res);
            //         })
            //     }).catch(err=>{
            //         console.log(err);
            //     })
            // },
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
            self.getCountryStore() //查询门店列表
            self.getTagListData() //查询门店标签

            // self.getProvinceList();

            // self.getInitData();

            //await this.isLoginIn();
            // if(!this.timeid){
            //     this.timeid=window.setInterval(this.getStoreList(this.params),60*1000);
            // }
        },
        beforeRouteEnter(to, from, next){
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
 $tab:#7d8cad;
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
    .elcheckBox {
        margin-right: 10px !important;
    }
    .seacrh-content{
        padding: 30px calc(40/1920*100vw);
        text-align: left;
        border-bottom: 0.5px solid #e3e9f4;
        align-items: center;
        background-color: #fff;
        .store-handle{
            margin-top:30px;
            .header-details1{
                text-align: left;
                height: 30px;
                line-height: calc(30/1920*100vw);
                span{
                    font-size: calc(14/1920*100vw);
                    margin-right: calc(20/1920*100vw);
                }
                .choice-store{
                    color: $tab;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    float:left;
                    width: 98%;
                    i{
                        margin-right: calc(15/1920*100vw);
                    }
                    .icon-tishi1{
                        font-size: calc(16/1920*100vw);
                    }
                }
            }
        }
        .select-title{
            color: #424151;
            font-size: calc(14/1920*100vw);
        }
        .el-province{
            width: calc(160/1920*100vw);
            min-width: 85px;
            margin-left: calc(20/1920*100vw);
            margin-right: 0;
            @media screen and (max-width: 1024px){
              margin-right: 10px;
              margin-left: 10px;
            }
        }
        .el-search-btn{
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            width: calc(130/1920*100vw);
            padding: 0 0;
            margin-left: calc(20/1920*100vw);
            color: #fff;
        }
        .en-el-search-btn{
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          width: calc(130/1920*100vw);
          padding: 0 0;
          text-align: center;
          margin-left:calc(20/1920*100vw);
          color: #fff;
        }
        .city-input{
          width: calc(160/1920*100vw);
          height: calc(36/1920*100vw);
          line-height: calc(36/1920*100vw);
          background: #F4F5F9 !important;
          cursor: pointer;
          border: 1px solid #E4E7ED;
          box-sizing: border-box;
          border-radius: 3px;
          overflow: hidden;
          min-height: 28px;
          min-width: 85px;
          position: relative;
          display: flex;
          align-items: center;
          span{
            display: inline-block;
            font-size: 12px;
            color: #7d8cad;
            margin-left: 15px;
            width: calc(160/1920*100vw - 40px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .icon-input{
            position: absolute;
            right: calc(15/1920*100vw);
            font-size: calc(14/1920*100vw);
            color: #C0C4CC;
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
            top:7px;
            font-size:18px;
        }
    }
    .el-table-content{
        float: left;
        background-color: #fff;
        margin: calc(30/1920*100vw);
        padding:0 30px 30px 0px;
        width:96%;
        border: 1px solid $border;
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

