<template>
    <el-row id="el-containter">
        <el-col :span="24" class="report-header">
            <el-col :span="24" class="header-details">
                <span>{{generateReportLang('selectStores')}}</span>
                <el-select v-model="curCountry"  :placeholder="generateReportLang('country')" size="mini"
                class="el-province" @change="changeCountry">
                    <!--<el-option-->
                    <!--v-for="item in countryList"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                  <el-option-group
                    v-for="group in countryList"
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
                <!--<el-select v-model="curProvince"  :placeholder="generateReportLang('regionI')" size="mini" :disabled="curCountry.length==0"-->
                <!--class="el-province" @change="changePro" @clear="cleaPro">-->
                    <!--<el-option-->
                    <!--v-for="item in provinceList"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-select v-model="curCity"  :placeholder="generateReportLang('regionII')" size="mini" :disabled="curProvince.length==0"-->
                <!--class="el-province" @change="changeCity" @clear="clearCity">-->
                    <!--<el-option-->
                    <!--v-for="item in cityList"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <region-multi-select :selected="curProvince" :placeholder="$t('reportView.regionI')" :options="provinceList" @changeInput="handleProChange"
                                     style="display: inline" ref="proviceSelect" :disabled="curCountry.length==0||curStoreTag!=''" :all="$t('overview.allZoneI')"></region-multi-select>
                <region-multi-select :selected="curCity" :placeholder="$t('reportView.regionII')" :options="cityList" @changeInput="handleCityChange"
                                     style="display: inline" ref="citySelect" :disabled="curProvince.length==0||curStoreTag!=''" :all="$t('overview.allZoneII')"></region-multi-select>
                <multi-select :selected="curStore" :options="storeDataList" @changeInput="handleStoreChange" style="display: inline" ref="multiSelect">
                </multi-select>
              <!--<el-select multiple collapse-tags v-model="curStore" clearable  :placeholder="generateReportLang('stores')" size="mini"-->
                <!--class="el-province select-store" @change="changeStore" @clear="clearStore">-->
                    <!--<el-option-->
                    <!--v-for="item in storeDataList"-->
                    <!--:key="item.storeId"-->
                    <!--:label="item.label"-->
                    <!--:value="item.storeId">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <!--<div class="search-content" v-if="searchContent">-->
                    <!--<span>{{generateReportLang('keywords')}}</span>-->
                    <!--<el-input size="mini" v-model="searchInput" class="search-input"></el-input>-->
                <!--</div>-->
            </el-col>
            <el-col :span="24" class="header-details">
                <span :class="lang== 'en'? 'en-span-class' : ''">{{generateReportLang('time')}}</span>
                <el-date-picker
                    ref="datePicker"
                    v-model="dateValue"
                    type="datetimerange"
                    range-separator="~"
                    size="mini"
                    :clearable=false
                    :editable=false
                    format="yyyy/MM/dd HH:mm:ss"
                    class="date-range"
                    :picker-options='dateOpt'
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="dateChange"
                    @focus="dateFocus"
                    :popper-class="poperClass"
                    :default-time="defaultTime">
                </el-date-picker>
                <el-tooltip class="item" effect="dark"
                    placement="bottom-end">
                    <div slot="content">*{{generateReportLang('timePlaceholder')}}</div>
                    <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;vertical-align: middle;"></i>
                </el-tooltip>
                <span>{{generateReportLang('reportType')}}</span>
                <el-select v-model="curReportType"  :placeholder="generateReportLang('all')" size="mini"
                    class="el-province" @change="changeReportType" @clear="clearReportType">
                    <el-option
                    v-for="item in reportTypeList"
                    :key="item.mode"
                    :label="item.label"
                    :value="item.mode">
                    </el-option>
                </el-select>
                <span>{{generateReportLang('resultType')}}</span>
                <el-select v-model="curAppraise"  :placeholder="generateReportLang('all')" size="mini"
                    class="el-province " @change="changeAppraise" @clear="clearAppraise">
                    <el-option
                    v-for="item in appraiseList"
                    :key="item.status"
                    :label="item.label"
                    :value="item.status">
                    </el-option>
                </el-select>
                 <div class="search-content">
                    <span>{{generateReportLang('keywords')}}</span>
                    <el-input size="mini" v-model="searchInput" class="search-input" clearable></el-input>
                </div>
                <el-button size="mini" :class="lang==='en'? 'en-search-btn':'search-btn' " @click="searchData" type="primary"
                           :disabled="curProvince.length==0&&curStoreTag==''">{{generateReportLang('search')}}</el-button>
            </el-col>
            <el-col :span="24" class="header-details1">
                <span class="choice-store">
                  <i class="iconfont icon-tishi1" @mouseover="showStoreInfo=true" @mouseleave="showStoreInfo=false"></i>
                  {{generateReportLang('selected')}}
                  <span class="storename-str" style="margin-left:20px;">{{storeStr}}</span>
                </span>
                <div class="store-selected" v-if="showStoreInfo">
                  <h1>{{generateReportLang('selected')}}</h1>
                  <ul class="store-list" v-show="storeStr.length > 0">
                    <li v-for="(item,index) in storeStr.split('，')" :key="index" class="store-item" style="display: block; text-align: left">
                        - {{item}}
                    </li>
                  </ul>
                </div>
            </el-col>
        </el-col>
        <el-col :span="24" class="report-content">
            <el-row class="card-content" v-if="reportList.length!=0">
                <el-col :span="24" class="card-header" v-if="reportList.length!=0">
                    <el-radio v-model="curSortType" v-for="(item,index) in sortTypeList" :key="index" :label="item.id" @change="checkSortType">
                        <span class="sort-name">{{item.name}}</span>
                    </el-radio>
                </el-col>
                <el-col :span="4" class="report-card" v-for="(item,index) in reportList" :key="index">
                    <div class="cards" @click="clickReport(item,index)">
                        <img :src="item.iconSrc" alt="" :height="iconSrcHeight" class="item-img"/>
                        <div class="item-flex">
                          <div class="item-header">
                            <!-- <img :src="item.inspectSrc" alt="" :height="iconSrcHeight*3/5" class="inspect-img"/> -->
                            <div class="store-name">
                              <span class="name">{{item.storeName}}</span>
                              <span class="inspect">{{item.tagName}}</span>
                            </div>
                          </div>
                          <div class="item-icon">
                            <i class="iconfont inspectIcon" :class="item.mode==0?'icon-yuanchengxunjian':'icon-xianchangxunjian'"></i>
                          </div>
                          <div class="item-content">
                            <span class="assigner">{{generateReportLang('submitter')}} {{item.submitterName}}</span>
                            <span class="datestr">{{item.datestr}}</span>
                          </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="24" class="el-pat">
                    <el-pagination background small
                        @current-change="currentChange"
                    layout="jumper,total, prev, pager, next"
                    :page-size="sizeNum" :total="total"
                    :current-page="page"
                    class="el-pag">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-row class="card-content" v-else>
              <div class="empty-content">{{noData}}</div>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>
import {getInspectReportList} from '@/api/inspect'
import {getStoreList,getBriefStoreList,GetTagList} from '@/api/store'
import util from '@/common/util'
import {Message} from 'element-ui'
import {generateReportLang} from '@/api/i18n'
import {mapGetters} from 'vuex'
import MultiSelect from '@/components/MultiSelect'
import RegionMultiSelect from '@/components/RegionMultiSelect'

export default {
    name:'InspectReportList',
    components: {
      MultiSelect,
      RegionMultiSelect
    },
    data(){
        return{
            varyWindowWidth:window.innerWidth,
            varyWindowHeight:window.innerHeight,
            videoSrc:require('../../../static/img/监控icon.png'),
            inspectSrc:require('../../../static/img/远程icon.png'),
            insiteInspectSrc:require('../../../static/img/现场icon.png'),
            searchContent:false,
            inspectSrc1:require('../../../static/img/总评icon1.png'),
            inspectSrc2:require('../../../static/img/总评icon2.png'),
            inspectSrc3:require('../../../static/img/总评icon3.png'),
            inspectSrc4:require('../../../static/img/总评icon4.png'),
            inspectSrc5:require('../../../static/img/总评icon5.png'),
            inspectSrc6:require('../../../static/img/总评icon6.png'),
            inspectSrc7:require('../../../static/img/总评icon7.png'),
            inspectSrc8:require('../../../static/img/总评icon8.png'),
            inspectSrc9:require('../../../static/img/总评icon9.png'),
            inspectSrc10:require('../../../static/img/总评icon10.png'),
            reportList:[],
            curSortType:0,
            sortTypeList:[
                {
                    id:0,
                    name: this.$t('reportView.rankTime')
                },
                {
                    id:1,
                    name: this.$t('reportView.rankScore')
                },
                {
                    id:2,
                    name: this.$t('reportView.rankStore')
                }
            ],

            curCountry:'',
            countryList:[],
            curProvince: [],
            curStoreTag:'',
            StoreTagList:[],
            provinceList:[],
            curCity:[],
            cityList:[],
            curStore:[],
            storeList:[],
            searchInput:'',
            sizeNum:12,
            defaultTime:[],
            dateValue:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()],
            dateOpt: {
                disabledDate:(time)=>{
                    return time.getTime() > Date.now();
                }
            },
            curReportType: -1,
            reportTypeList:[
              {'mode':-1,'label':this.$t('reportView.all')},{'mode':0,'label':this.$t('reportView.remotePatrol')},{'mode':1,'label':this.$t('reportView.onsitePatrol')}
            ],
            curAppraise: -1,
            appraiseList:[
                {'status':-1,'label':this.$t('reportView.all')},
                {'status':0,'label':this.$t('reportView.dangerous')},
                // {'status':1,'label':this.$t('reportView.improve')},
                {'status':2,'label':this.$t('reportView.qualified')},
                // {'status':3,'label':this.$t('reportView.excellent')},
            ],
            storeStr:'',
            total: 0,
            page:0,
            params:{},
            storeDataList:[],
            storeIdList:[],  //存放当前选中的门店id
            poperClass:'date-picker-poper',
            lang: this.$i18n.locale,
            isFirstLoad: false,
            storeName: '',
            showMonthDrap: false,
            showStoreContent: false,
            checkAllStore: false,
            noData: '',
            showStoreInfo: false
        }
    },
    created(){
      let self=this
      self.isFirstLoad = true
      self.getCountryStore()
      self.getTagListData()
    },
    computed:{
        iconSrcHeight(){
            return (this.varyWindowWidth/1920)*50;
        },
        ...mapGetters({accountChanged:'accountChanged'})
    },
    watch:{
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.storeDataList = [];
          self.$refs.multiSelect.selectedArray = [];
          self.$refs.multiSelect.input=''
          self.initData();
          // self.getRegionInfo();
          self.getCountryStore()
          self.getInitReportList();
          window.setTimeout(function(){
              self.$route.meta.keepAlive = true;
              console.log(self.$route.meta.keepAlive);
            },
            300);
        }
      }
    },
    methods:{
        generateReportLang,
        changeBrand(){
            let self=this;
            self.curCountry='';
            self.countryList=[];
            self.curProvince= [];
            self.provinceList=[];
            self.curCity= [];
            self.cityList=[];
            self.curStore=[];
            self.storeList=[];
            self.searchInput='';
            self.curStoreTag=''

        },
        initData(){
          let self=this;
          self.changeBrand();
          self.defaultTime=[];
          self.storeStr = '';
          self.dateValue = [new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()];
          self.reportList=[];
          self.curSortType=0;
          self.storeName =  '';
          self.showMonthDrap = false;
          self.showStoreContent =  false;
          self.checkAllStore =  false;
          self.curStore=[];
        },
        getReportList(params){
            let self=this;
            getInspectReportList(params).then(res=>{
                let errCode=res.errCode;
                let data=[];
                if(errCode==0){
                    data=res.data.content;
                }
                let temp=[];
                data.forEach(item => {
                    let obj={};
                    obj.id=item.id;
                    obj.datestr=util.getDateStr(item.ts);
                    obj.storeName=item.storeName;
                    obj.tagName=item.tagName;
                    obj.submitterName=item.submitterName;
                    obj.submitter=item.submitter;
                    obj.routeObj=item;
                    obj.mode=item.mode;

                    switch(item.status){

                      /**
                       * 根据语言和类型返回图片形式
                       */
                      case 0: {
                          // 立即督导
                          if(self.lang == 'zh'){
                            obj.iconSrc=self.inspectSrc1;
                          }
                          else if(self.lang == 'en'){
                            obj.iconSrc=self.inspectSrc4;
                          }
                          else if(self.lang == 'zhtw'){
                            obj.iconSrc=self.inspectSrc7;
                          }
                          else {
                            obj.iconSrc=self.inspectSrc1;
                          }
                          break;
                        }
                        case 1: {
                          // 待改善
                          if(self.lang == 'zh'){
                            obj.iconSrc=self.inspectSrc3;
                          }
                          else if(self.lang == 'en'){
                            obj.iconSrc=self.inspectSrc6;
                          }
                          else if(self.lang == 'zhtw'){
                            obj.iconSrc=self.inspectSrc3;
                          }
                          else {
                            obj.iconSrc=self.inspectSrc3;
                          }
                          break;
                        }

                      case 2:{
                          //合格
                          if(self.lang == 'zh'){
                            obj.iconSrc=self.inspectSrc2;
                          }
                          else if(self.lang == 'en'){
                            obj.iconSrc=self.inspectSrc5;
                          }
                          else if(self.lang == 'zhtw'){
                            obj.iconSrc=self.inspectSrc2;
                          }
                          else {
                            obj.iconSrc=self.inspectSrc2;
                          }
                          break;
                        }
                      default :{
                        //good
                        if(self.lang == 'zh'){
                          obj.iconSrc=self.inspectSrc8;
                        }
                        else if(self.lang == 'en'){
                          obj.iconSrc=self.inspectSrc9;
                        }
                        else if(self.lang == 'zhtw'){
                          obj.iconSrc=self.inspectSrc10;
                        }
                        else {
                          obj.iconSrc=self.inspectSrc8;
                        }
                        break;
                      }
                    }
                    temp.push(obj);
                });
                self.reportList=temp;
                self.total=res.data.totalElements;
                if(self.reportList.length == 0){
                  self.noData = self.$t('deviceView.noData')
                }
            })
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
        getInitReportList(){
            let self=this;
            let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
            let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
            self.params.beginTs=start;
            self.params.endTs=end;
            self.params.filter={page:0,size:self.sizeNum};
            let storeIds = self.curStore.filter(item=> item!= -1)
            console.log(storeIds)
            self.params.clause = {storeId: storeIds}
            self.getReportList(self.params);
        },
        async getRegionInfo(){
            let self=this;
            let params={
                "filter":{
                    "page":0,
                    "size":1000
                }
            };
            let retData=await self.getStoreData(params);
            let storeList=retData.data.content;
            self.storeList=storeList;

            let getCountry=storeList=>{
                let temp=[];
                // temp.push({label:self.$t('reportView.country'), value:''})
                storeList.forEach(item=>{
                    if(temp.map(x=>x.value).indexOf(item.country)==-1){
                        let obj={
                            label:item.country,
                            value:item.country
                        }
                        temp.push(obj);
                    }
                })
                return temp;
            }
            let countryList=getCountry(storeList);
            let tempStore=[];
            storeList.forEach(item=>{
                let obj={
                    storeId:item.storeId,
                    label:item.name,
                    value:item.name,
                    userId:item.userId,
                    userName:item.userName,
                    checked: false
                }
                tempStore.push(obj);
            })
            self.storeDataList=tempStore;
            // self.countryList=countryList;
            self.countryList[0] = {}
            self.countryList[0].label= self.$t('reportView.country');
            self.countryList[0].countryList = countryList
            console.log(self.countryList);
            self.curCountry = countryList[0].label;
            self.selectAllProAndCity(self.curCountry);
        },
        async getCountryStore(){
                let self=this;
                let data=await self.getBriefStoreData();
                let temp=[]
                if(data.errCode==0&&data.errMsg=='Success'){
                    self.storeList=data.data;
                    if(self.storeList.length!=0){
                        self.storeList.forEach(item=>{
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
                    let countryList=temp;
                    self.countryList[0] = {}
                    self.countryList[0].label= self.$t('reportView.country');
                    self.countryList[0].countryList = countryList
                    self.curCountry = countryList[0].label;
                    self.selectAllProAndCity(self.curCountry);
                }
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
        handleStoreChange (arr) {
          console.log(arr)
          this.curStore = arr
          this.changeStore(arr)
        },
        handleProChange(arr){
          console.log(arr)
          this.curProvince = arr
          this.changePro(arr)
        },
        handleCityChange(arr){
          console.log(arr)
          this.curCity = arr
          this.changeCity(arr)
        },
        changeStore(val){
          let self=this;
          let str='';
          self.storeList.forEach((item,index)=>{
            val.forEach(_item=>{
              if(item.storeId==_item){
                str+=item.name+'，'
              }
            })
          })
          str=str.substr(0,str.length-1)
          self.storeStr=str;
        },
        changePro(val){
          console.log(val)
          let self=this;
          self.curCity= [];
          self.clearCityInfo();
          self.clearStoreInfo();

          let storeList=self.storeList;
          let temp=[];
          let tempStore=[];
          if(val == ''){
            storeList.forEach(item=>{
              if(item.country==self.curCountry){
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
                  userName:item.userName
                };
                tempStore.push(obj);
              }
            })
            self.provinceList=temp;
            self.checkAllStore = false;
          }
          else{
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
                    userName:item.userName
                  };
                  tempStore.push(obj);
                }
              })
            })
            self.cityList=temp;
          }
          self.storeDataList=tempStore;
        },
        changeCountry(val){
          let self=this;
          console.log(val);
          self.curProvince= [];
          self.curCity=[];
          self.curStoreTag=''
          let storeList=self.storeList;
          let tempStore=[];
          let temp=[];
          self.clearProviceInfo();
          self.clearCityInfo();
          self.clearStoreInfo();
          if(val== ''){
            storeList.forEach(item=>{
              let obj={
                storeId:item.storeId,
                label:item.name,
                value:item.name,
                userId:item.userId,
                userName:item.userName
              }
              tempStore.push(obj);
            })
            //self.storeDataList=tempStore;
            self.checkAllStore = false;
          }
          else{
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
                  userName:item.userName
                };
                tempStore.push(obj);
              }
            })
          }
          self.provinceList=temp;
          self.storeDataList=tempStore;

        },
        changeStoreTag(val){
          let self=this
          let temp=[]
          self.clearStoreInfo();
          self.storeList.forEach(item=>{
              item.tagIds.forEach(_item=>{
                  if(_item==val){
                      let obj={
                          storeId:item.storeId,
                          label:item.name,
                          value:item.name,
                          userId:item.userId,
                          userName:item.userName
                      };
                      temp.push(obj);
                  }
              })
          })
          self.storeDataList=temp
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
        changeCity(val){
          let self=this;
          self.clearStoreInfo();
          console.log(val)
          let storeList=self.storeList;
          let temp=[];
          if(val.length == 0){
            console.log(self.curProvince)
            self.curProvince.forEach(_item=>{
              console.log(_item)

              storeList.forEach(item=>{
                console.log(item)
                if(item.province==_item){
                  let obj = {};
                  obj.storeId = item.storeId;
                  obj.label = item.name;
                  obj.value = item.name;
                  obj.userId = item.userId;
                  obj.userName = item.userName;
                  temp.push(obj);
                }
              })
            })
          }
          else{
            val.forEach(_item=>{
              storeList.forEach(item=>{
                if(item.city==_item){
                  if(temp.map(x=>x.value).indexOf(item.city)==-1){
                    let obj={
                      storeId:item.storeId,
                      label:item.name,
                      value:item.name,
                      userId:item.userId,
                      userName:item.userName
                    }
                    temp.push(obj);
                  }
                }
              })
            })
          }
          console.log(temp)
          self.storeDataList=temp;
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
        selectAllProAndCity(val){
          let self = this;
          let storeList = self.storeList;
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
                userName:item.userName
              };
              tempStore.push(obj);
            }
          })
          self.provinceList = temp;
          console.log(self.provinceList)
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
        clearStore(){
            let self=this;

        },
        dateFocus(){
            let self=this;
            self.getDeafultTime();
        },
        getDeafultTime(){
            let self=this;
            let date=new Date();
            let hour=date.getHours()<10?'0'+date.getHours():date.getHours();
            let minutes=date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
            let second=date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
            let dateStr=hour+':'+minutes+':'+second;
            let timeTemp=[];
            timeTemp[0]=dateStr;
            timeTemp[1]=dateStr;
            self.defaultTime=timeTemp;
        },
        dateChange(val){
            let self=this;
            console.log(val);
            let start=typeof(val[0])==='object'?val[0].getTime():val[0];
            let end=typeof(val[1])==='object'?val[1].getTime():val[1];

            if((end-start)/(3600*24*30*1000)>1){  //当前选择的时间范围超过了30天
                self.$message({
                    message: this.$t('eventView.changeTimeRange'),
                    type:'warning',
                    duration:3*1000
                })
                start=end-3600*24*30*1000;
                self.dateValue=[new Date().setTime(start),new Date().setTime(end)];
            }
            // self.params.beginTs=start;
            // self.params.endTs=end;
            // self.getReportList(self.params);
        },
        changeReportType(val){

        },
        clearReportType(){

        },
        changeAppraise(val){

        },
        clearAppraise(){

        },

        currentChange(val){
            let self=this;
            self.page=val;
            self.params.filter={page:val-1,size:self.sizeNum};
            self.getReportList(self.params);
        },
        searchData(){
            let self=this;

            console.log(self.params);
            let val = self.dateValue;
            console.log(val);
            let start=typeof(val[0])==='object'?val[0].getTime():val[0];
            let end=typeof(val[1])==='object'?val[1].getTime():val[1];
            self.params.beginTs=start;
            self.params.endTs=end;

            console.log(self.storeDataList);
            self.page=1;
            let clause={};
            if(self.curStore.length!=0){
              clause.storeId= self.curStore.filter(item=> item!= -1)
            }
            else{
              clause.storeId=self.storeDataList.map(x=>x.storeId);
              self.curStore = (clause.storeId).concat();
              self.changeStore(clause.storeId)
            }
            console.log(self.curReportType);
            if(self.curReportType!== null && self.curReportType!== -1){
                clause.mode=self.curReportType;
            }
            if(self.curAppraise!== null && self.curAppraise!== -1){
                clause.status=self.curAppraise;
            }
            self.params.clause=clause;
            let search=self.searchInput.trim();
            if(search.length!=0){
                self.params.like={
                    tagName:search,
                    submitterName:search,
                    storeName:search
                }
            }
            else{
                self.params.like={};
            }

            self.params.filter={page:0,size:self.sizeNum};
            self.getReportList(self.params);
        },
        checkSortType(typeId){
            console.log(typeId);
            let self=this;
            switch(typeId){
                case 0: self.params.order={direction:'desc',property:'ts'}; break;
                case 1: self.params.order={direction:'asc',property:'status'}; break;
                case 2: self.params.order={direction:'asc',property:'storeName'}; break;
            }
            self.getReportList(self.params);
        },

        clickReport(item,index){
            let self=this;
            console.log(item.routeObj);
            sessionStorage.setItem('report_data',JSON.stringify(item.routeObj));
            self.$router.push({name:"reportDetails",params:{data:item.routeObj}});
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
    beforeRouteEnter (to, from, next) {
      to.meta.keepAlive = true
      if(from.name=='reportDetails'&& to.name == 'reports'){
        to.meta.isBack = true;
        next();
      }
      else{
        to.meta.isBack = false;
        next();
      }
    },
    beforeRouteLeave (to, from, next) {
      console.log(this.params);
      if(to.name != 'reportDetails'){
        from.meta.keepAlive = false;
        next(vm=>{
          console.log(vm)
        });
      }
      else{
        from.meta.keepAlive = true;
        next(vm=>{
          console.log(vm)
        });
      }
    },
    // async mounted(){
    //     console.log(this.sortTypeList);
    //     let self=this;
    //     //self.getDeafultTime();
    //     await self.getRegionInfo();
    //     self.getInitReportList();
    // },
    activated(){
      let self=this;
      if(!self.$route.meta.isBack || self.isFirstLoad){
        self.initData();
        // self.getRegionInfo();
        self.getCountryStore()
        self.getInitReportList();
      }
      else{
        //
      }
      self.$route.meta.isBack = false;
      self.isFirstLoad = false;
    },
}
</script>
<style lang="scss" scoped>
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
$qualified:#6097F3;
$noqualied:#FDBA40;
$suggestBack:#F1F6FE;
#el-containter{
    // padding-top: calc(60/1920*100vw);
    // padding-right: calc(30/1920*100vw);
    .report-header{
        margin-bottom: 20px;
        border-bottom: 1px solid $border;
        background-color: #fff;
        padding-top: 30px;
        padding-bottom: 30px;
        color: $black;
        .header-details1{
            text-align: left;
            padding-left: calc(30/1920*100vw);
            padding-right: calc(30/1920*100vw);
            height: 20px;
            line-height: 20px;
            span{
                font-size: calc(14/1920*100vw);
                margin-right: calc(20/1920*100vw);
                margin-left: calc(20/1920*100vw);
            }
            .choice-store{
                color: $tab;
                white-space: nowrap;
                overflow: hidden;
                /* text-overflow: ellipsis; */
                width: 90%;
                display: inline-block;
                i{
                    margin-right: calc(15/1920*100vw);
                    font-size: calc(16/1920*100vw);
                }
            }
            .store-selected{
              top: unset;
              background-color: rgba(30, 34, 52, 0.75);
              position: absolute;
              /* display: none; */
              z-index: 1;
              padding: 20px;
              min-width: 200px;
              border-radius: 10px;
              left: calc(80 / 1920 * 100vw);
              h1{
                white-space: nowrap;
                font-size: 18px;
                margin: 0;
                font-family: Roboto, "Microsoft YaHei", "Microsoft JhengHei", SimHei, Arial;
                color: #fff;
                font-weight: 500;
                line-height: 1.1;
              }
              .store-list{
                margin-top: 10px;
                margin-left: 10px;
                padding: 0;
                .store-item{
                  white-space: nowrap;
                  font-size: 14px;
                  margin: 0;
                  list-style-type: none;
                  font-family: Roboto, "Microsoft YaHei", "Microsoft JhengHei", SimHei, Arial;
                  color: #fff;
                }
              }
            }
        }
        .header-details{
            text-align: left;
            padding-left: calc(50/1920*100vw);
            position: relative;
            .search-content{
                display: inline-block;
            }
            .date-range{
                width:290px;
            }
            .iconbangzhu{
              font-size: calc(20/1920*100vw);
              margin-right: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1560px){
                margin-right: 10px;
              };
              @media screen and (min-width: 1024px) and (max-width: 1280px){
                margin-right: 5px;
              };
            }
            span{
                font-size: calc(14/1920*100vw);
                margin-right: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1560px){
                margin-right: 10px;
              };
            }
            @media screen and(max-width: 1280px){
              .en-span-class{
                //margin-right: 56px;
              }
            }
            .el-province{
                width: calc(160/1920*100vw);
                min-width: 85px;
                margin-right: calc(15/1920*100vw);
                @media screen and (min-width: 1280px) and (max-width: 1360px){
                  width: 85px;
                };
                @media screen and (max-width: 1022px){
                  margin-right: 10px;
                };
            }
          /deep/ .content .el-select.el-select--medium{
            @media screen and (min-width: 1280px) and (max-width: 1360px){
              width: 85px;
            };
            @media screen and (max-width: 1022px){
              margin-right: 10px;
            };
          }
          .stores-panel{
            position: relative;
            display: inline-block;
            .month-content{
              width: calc(200/1920*100vw);
              display: inline-block;
              position: relative;
              cursor: pointer;
              #elMonth{
                width: 200px;
                border-radius: 0px;
                background-color: #f0f5f8;
              }
              .el-input{
                width: calc(160/1920*100vw);
                /deep/ .el-input__inner{
                  padding-right: 20px;
                  height: calc(36/1920*100vw);
                  line-height: calc(36/1920*100vw);
                  background-color: #f4f5f9;
                  color: $tab;
                }
              }
              .input-arrow-panel{
                width: calc(160/1920*100vw);
                height: calc(36/1920*100vw);
                position: absolute;
                background-color: transparent;
                cursor: pointer;
                z-index: 100;
              }
              .icon-input{
                position: relative;
                right: 25px;
                top: 1px;
                font-size: 12px;
                color: #C0C4CC;
              }
            }
            .month-panel{
              position: absolute;
              margin-top: 3px;
              white-space:nowrap;
              box-sizing: border-box;
              height: 150px;
              z-index: 980;
              background-color: #fff;
              border: 1px solid #ddd;
              padding: 5px;
              overflow: auto;
              .month-details{
                padding: 2px 0px;
                span{
                  margin-left: 10px;
                  font-size: 14px;
                  color: #606266;
                }
                .el-checkbox{
                  margin-right: 0;
                }
              }
            }
          }
            .search-input{
                width: calc(160/1920*100vw);
                @media screen and (min-width: 1280px) and (max-width: 1360px){
                  width: 85px;
                };
            }
            .search-btn{
              width: calc(130/1920*100vw);
              height: calc(36/1920*100vw);
              padding: 0 0;
              font-size: calc(14/1920*100vw);
              margin-left: calc(20/1920*100vw);
            }
            .en-search-btn{
              width: calc(130/1920*100vw);
              height: calc(36/1920*100vw);
              padding: 0 0;
              font-size: calc(14/1920*100vw);
              margin-left: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1360px){
                width: 85px;
              };
              @media screen and (max-width: 1024px){
                margin-left: 10px;
              };
            }
            // .storename-str{
            //     width: 100%;
            //     white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
            //     overflow: hidden; //隐藏超出单元格的部分。
            //     text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
            // }
        }
      .header-details:nth-child(2){
        padding-top:20px;
        padding-bottom: 30px;
      }
    }
    .report-content{
        padding-right: calc(20/1920*100vw);
        padding-left: calc(20/1920*100vw);
        .card-content{
            border: 1px solid $border;
            background-color: #fff;
            padding-top: 20px;
            padding-right: calc(20/1920*100vw);
            min-height: calc(100vh - 125px - 230px);
            /*margin-bottom: calc(20/1920*100vw);*/
            padding-bottom: 20px;
            //height: calc(730/1080*100vh);
        }
        .empty-content{
          font-size: 16px;
          color: $tab;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .card-header{
            text-align: left;
            padding-left: calc(20/1920*100vw);
            margin-bottom: 15px;
        }
    }
    .report-card{
        margin-bottom: 20px;
        .cards{
            cursor: pointer;
            margin-left: calc(20/1920*100vw);
            border: 1px solid $border;
            // width: calc(200/1920*100vw);
            height: calc(240/1920*100vw);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            background-color: #fff;
            min-height: 160px;
            .item-img{
                position: absolute;
                right: 1px;
                top: 1px;
            }
          .item-flex{
            display: flex;
            flex-direction: column;
            padding-top: calc(40/1920*100vw);
            justify-content: space-around;
            height: calc(100% - 40/1920*100vw);
          }
            .item-header{
                width: 100%;
                //margin-top: calc(40/1920*100vw);
                overflow: hidden;
                .inspect-img{
                    margin-left: calc(20/1920*100vw);
                    float: left;
                }
                .store-name{
                    float: left;
                    width: calc(120/1920*100vw);
                    margin-left: calc(20/1920*100vw);
                    text-align: left;
                    width: calc(100% - 40/1920*100vw);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .name{
                        font-size: calc(18/1920*100vw);
                        font-weight: bold;
                        display: block;
                        color: $black;
                        overflow: hidden;
                        text-overflow: ellipsis
                }
                .inspect{
                    font-size: calc(12/1920*100vw);
                    color: $tab;
                }
            }
        }
        .item-icon{
            text-align: left;
            padding-left: calc(20/1920*100vw);
        }
        .inspectIcon{
            font-size: calc(60/1920*100vw);
            color: $border;
        }
        .item-content{
            text-align: left;
            padding-left: calc(20/1920*100vw);
            /*position: absolute;*/
            /*bottom: 0;*/
            span{
                font-size: calc(14/1920*100vw);
                color: $tab;
                display: block;
                margin-bottom: calc(15/1920*100vw);
            }
        }
    }
}
.el-pat{
    //position: absolute;
    height: 30px;
    .el-pag{
        position: absolute;
        //float: right;
        right: calc(20/1920*100vw);
        bottom: 20px;
    }
}
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
        background: #f4f5f9 !important;
        border: 1px solid #E4E7ED  !important;
        /*border-radius: 0px !important;*/
        /*border: 0 !important;*/
        /*height: 28px !important;*/
        /*line-height: 28px !important;*/
    }
    /* 浏览器滚动条样式 */

    /* width */
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: rgb(255, 255, 255);
      border-radius: 8px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgb(201, 201, 202);
      border-radius: 8px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: rgb(162, 162, 163);
    }
</style>
<style>
@import '../../assets/css/pagination.css';
.date-picker-poper .el-button--text{
    visibility: hidden !important;
}
</style>
