<template>
    <div class="content">
        <div class="type-pick">
            <div class="type-div">{{$t('statistics.areaType')}}</div>
            <el-select class="dropdown-select" v-model="compareType" value-key="value"  @change="changeCompareType">
                <el-option 
                  v-for="item in compareTypeItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
            <div style="width:1px; height:20px;background-color:#556679;align-self: center;"></div>
            <div v-if="allowAll">
              <multi-select
                ref="multiSelect"
                class="area-muti"
                :compareType="compareType"
                :selected="curSelectId"
                :placeholder="dropdownPlaceholder"
                :options="curTypeArrary"
                :all="selAllString"
                :limit-num="limitNum"
                style=""
                @changeInput="onChangeCompareType"/>
              </div>
              <div v-else>
                <limit-select
                  class="area-muti"
                  :selected="curSelectId"
                  :options="curTypeArrary"
                  :input-size="`mini`"
                  :limit = "limitNum"
                  @changeInput="onChangeCompareType" />
              </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import MultiSelect from '@/components/MultiSelect2';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import { getBriefStoreList, getStoreDefineGroup } from '@/api/store';
import LimitSelect from '@/components/LimitSelect';
export default {
    name: 'TypeSelectArea',
    components: {
      MultiSelect,
      RegionMultiSelect,
      LimitSelect
    },
    props: {
        cachedParams: {
            type: Object
        },
        curCountry:{
            type:String
        },
        path:{
          type:String
        },
        allowAll:{
          type:Boolean,
          default:false
        },
        limitNum:{
          type:Number,
          default:0
        },
        regionArray1:{
          type:Array,
          default() {
            return []
          }
        },
        regionArray2:{
          type:Array,
            default() {
            return []
          }
        },
        curStoreGroup:{
          type:Array,
            default() {
            return []
          }
        },
        curStoreType:{
          type:Array,
           default() {
            return []
          }
        },
        curStores:{
          type:Array,
            default() {
            return []
          }
        },
    },
    data() {
        return {
            DatePickIconSrc: require('../../static/img/statistics/ic_edit.svg'),
            CalenderIconSrc: require('../../static/img/statistics/ic_calender.svg'),
            compareType:'stores',
            compareTypeItems:[{value:'area1',label:this.$t('statistics.area1')},{value:'area2',label:this.$t('statistics.area2')},
            {value:'storeGroup',label:this.$t('statistics.storeGroup')},{value:'storeType',label:this.$t('statistics.storeType')},
            {value:'stores',label:this.$t('statistics.stores')}],
            date:Date.now(),
            dateFormat:'yyyy/MM/DD',
            //curCountry: -1, 
            countryList: [],
            ifGetParamsFromCash: false,
            curProvince: [],
            provinceList: [],
            curCity: [],
            cityList: [],
            curStore: [],
            storeList: [],
            curStoreTypeList:[],
            curStoreGroupList:[],
            curStoreList:[],
            storeGroupList: [],
            storeTypeList: [],
            dropdownPlaceholder:this.$t('remotePatrol.stores'),
            curTypeArrary:[],
            curSelectId:[],
            selAllString:this.$t('overview.all'),
        }
  },
  created() {
    this.getStoreListAndGroupAndType();
  },
  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.ifGetParamsFromCash = false;
        this.getStoreListAndGroupAndType();
      }
    },
    regionArray1: {
        handler (val,old ) {
          console.log("RegionArray1 changed")
          this.provinceList  = [];
          val.map(item => {
            if(item!='-1'){
              this.provinceList.push({value:item,label:item});
            }
          });
           if(this.compareType== 'area1'){
            this.curSelectId=[];
            this.changeCompareType(this.compareType);
          }

        }
    },
    regionArray2: {
        handler (val,old ) {
          console.log("RegionArray2 changed")
          this.cityList = [];
          val.map(item => {
            if(item!='-1'){
              this.cityList.push({value:item,label:item});
            }
          });
          if(this.compareType== 'area2'){
            this.curSelectId=[];
            this.changeCompareType(this.compareType);
          }

        }
    },
    curStoreGroup: {
        immediate: false, 
        deep: true,
        handler (val,old ) {
          this.curStoreGroupList = [];
          val.map(item => {
            if(item!='-1'){
              this.storeGroupList.map(store=>{
                  if(item == store.value)
                    this.curStoreGroupList.push(store);
              });
              
            }
          });
    
          if(this.compareGroup== 'storeGroup'){
            this.curSelectId=[];
            this.changeCompareType(this.compareType);
          }

        }
    },
  curStoreType: {
        immediate: false, 
        deep: true,
        handler (val,old ) {
          this.curStoreTypeList = [];
          val.map(item => {
            if(item!='-1'){
              this.storeTypeList.map(store=>{
                  if(item == store.value)
                    this.curStoreTypeList.push(store);
              });
              
            }
          });
    
          if(this.compareType== 'storeType'){
            this.curSelectId=[];
            this.changeCompareType(this.compareType);
          }

        }
    },
    curStores: {
        immediate: false, 
        deep: true,
        handler (val,old ) {
          /*
          this.curStoreList = [];
          if(this.storeList.length==0){
            this.getStoreListAndGroupAndType()
          }
          val.map(item => {
            if(item!='-1'){
              this.storeList.map(store=>{
                  if(item == store.storeId)
                    this.curStoreList.push({value:store.storeId,storeId:store.storeId,label:store.name});
              });
              
            }
          });
          */
          console.log(this.curStoreList)
          if(this.compareType== 'stores'){
            this.curSelectId=[];
            this.changeCompareType(this.compareType);
          }

        }
    },
    async curCountry(val){
      console.log("!!curCountry:",val);
      this.getStoreListAndGroupAndType();
    }
  },
  computed: {
     cachedParamsInfo() {
      console.log(this.cachedParams)
      return this.cachedParams
    }
  },
  methods: {
    getStoreListAndGroupAndType() {
      console.log("getStoreListAndGroupAndType")
      const storeListPromise = this.getBriefStoreData();
      const storeGroupPromise = this.getStoreDefineList(1);
      const storeTypePromise = this.getStoreDefineList(0);
      Promise.all([storeListPromise, storeGroupPromise, storeTypePromise]).then(results => {
        //console.log("getStoreListAndGroupAndType:",results);
        const storeList = results[0];
        const groupList = results[1];
        const typeList = results[2];
        groupList.map(item => {
          item.label = item.defineName;
          item.value = item.defineId;
          item.storeIds = item.contents;
        });
        typeList.map(item => {
          item.label = item.defineName;
          item.value = item.defineId;
          item.storeIds = item.contents;
        });
        this.storeList = storeList;
        this.getCountryStore();
        this.storeGroupList = groupList;
        this.storeTypeList = typeList;
      }).catch(err => {
        console.log('StoreFilter - getStoreGroupAndType: ' + err);
      });
    },
    getCountryStore() {
      /*let temp = [];
      if (this.storeList.length !== 0) {
        this.storeList.forEach(item => {
          
          const country = item.country;
          if (temp.map(x => x.label).indexOf(country) === -1) {
            const obj = {
              value: country,
              label: country
            };
            temp.push(obj);
          }
        });
      }
      
      const countryList = temp;
      this.countryList[0] = {};
      this.countryList[0].label = this.$t('remotePatrol.country');
      this.countryList[0].countryList = countryList;
      //this.countryList[0].countryList.unshift({ value: '-1', label: this.$t('remotePatrol.all') });
      
      this.curCountry = (!this.ifGetParamsFromCash) ? countryList[0].value : this.curCountry;*/
      console.log("this.curCountry",this.curCountry);
      this.selectAllProAndCity(this.curCountry, true);
    },
    async selectAllProAndCity(val, isFirst) {
      const self = this;
      const storeList = self.storeList;
      const temp = [];
      const tempStore = [];
      storeList.forEach(item => {
        if (item.country === val || val === '-1') {
          if (temp.map(x => x.value).indexOf(item.province) === -1) {
            console.log("province > item",item);
            const obj = {
              label: item.province,
              value: item.province
            };
            temp.push(obj);
          }
          let storeObj = {};
          if (self.ifGetParamsFromCash && self.curProvince.length > 0 && self.curProvince !== '-1') {
            if (self.curCity.length > 0 && self.curCity !== '-1') {
              if (self.curProvince.includes(item.province) && self.curCity.includes(item.city)) {
                storeObj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name,
                  userId: item.userId,
                  userName: item.userName
                };
              }
            }
          } else {
            storeObj = {
              storeId: item.storeId,
              label: item.name,
              value: item.storeId,
              userId: item.userId,
              userName: item.userName
            };
          }
          Object.keys(storeObj).length > 0 && tempStore.push(storeObj);
        }
      });
      self.provinceList = temp;
      const cityTemp = [];
      self.provinceList.forEach(_item => {
        storeList.forEach(item => {
          if (item.province === _item.value) {
            let citObj = {};
            if (self.ifGetParamsFromCash && self.curProvince.length > 0 && self.curProvince !== '-1') {
              if (self.curCity.length > 0 && self.curCity !== '-1') {
                if (self.curProvince.includes(item.province)) {
                  if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
                    console.log("city > item",item);
                    citObj = {
                      label: item.city,
                      value: item.city
                    };
                  }
                }
              }
            } else {
              if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
                citObj = {
                  label: item.city,
                  value: item.city
                };
              }
            }
            Object.keys(citObj).length > 0 && cityTemp.push(citObj);
          }
        });
      });
      self.cityList = cityTemp;
      const provinceArr = [];
      self.provinceList.forEach(item => {
        provinceArr.push(item.value);
      });
      //console.log("self.provinceList:",self.provinceList);
      self.curProvince = (self.ifGetParamsFromCash && self.curProvince.indexOf('-1') === -1) ? self.curProvince : provinceArr;

      const cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      //console.log("self.cityList:",self.cityList);
      self.curCity = (self.ifGetParamsFromCash && self.curCity.indexOf('-1') === -1) ? self.curCity : cityArr;
      self.storeDataList = tempStore;
      //console.log("storeDataList:",self.storeDataList)
      const storeArr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
      });
      //console.log("self.storeDataList:",self.storeDataList);
      setTimeout(async() => {
        self.curStore = (self.ifGetParamsFromCash && self.curStore.indexOf('-1') === -1) ? self.curStore : [];
        self.ifGetParamsFromCash = false;
        self.changeCompareType(self.compareType)
        //self.changeStoreNew(self.curStore);
      }, 100);
    },
    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res.data);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },
    getStoreDefineList(type) {
      return new Promise((resolve, reject) => {
        const params = {
          type: type
        };
        getStoreDefineGroup(params).then(res => {
          resolve(res.data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    changeCompareType(val){
      console.log("Change Compare Type=" +val)
      const self = this;
      this.compareType = val;
      this.curSelectId = [];
      this.curTypeArrary = [];
      switch (val){
        case 'area1':
          this.dropdownPlaceholder = this.$t('remotePatrol.regionI');
          this.selAllString=this.$t('overview.allZoneI');
          this.curTypeArrary =this.provinceList;
          this.curTypeArrary.forEach(function(item){
            item.contents =[];
            self.storeList.forEach(function(store){
               if(self.curStores.indexOf(store.storeId)>=0 && store.province == item.label){
                 item.contents.push(store.storeId);
               }
            });
          })
          break;
        case 'area2':
          this.dropdownPlaceholder =  this.$t('remotePatrol.regionII');
          this.selAllString=this.$t('overview.allZoneII');
          this.curTypeArrary =  this.cityList;
          this.curTypeArrary.forEach(function(item){
            item.contents =[];
            self.storeList.forEach(function(store){
               if(self.curStores.indexOf(store.storeId)>=0 && store.city == item.label){
                 item.contents.push(store.storeId);
               }
            });
          })
          break;
        case 'storeGroup':
          this.dropdownPlaceholder =  this.$t('remotePatrol.storeGroup');
          this.selAllString=this.$t('storeView.all');
          this.curTypeArrary = this.curStoreGroupList;
          break;
        case 'storeType':
          this.dropdownPlaceholder =  this.$t('remotePatrol.storeType');
          this.selAllString=this.$t('storeView.all');
          this.curTypeArrary = this.curStoreTypeList;
          break;
        case 'stores':
          console.log(this.curStores)
          this.curStoreList = [];
          this.curStores.map(item => {
            if(item!='-1'){
              this.storeList.map(store=>{
                  if(item == store.storeId)
                    this.curStoreList.push({value:store.storeId,storeId:store.storeId,label:store.name});
              });
              
            }
          });
          this.dropdownPlaceholder =  this.$t('remotePatrol.stores');
          this.selAllString=this.$t('overview.all');
          this.curTypeArrary = this.curStoreList;
          break;
        default:
          this.dropdownPlaceholder =  this.$t('remotePatrol.stores');
          this.selAllString=this.$t('overview.all');
          this.curTypeArrary = this.curStoreList;
          break;
      }
      if(this.curSelectId.length==0 ){
          let defaultSel = this.curTypeArrary.length;
          let selectedLabels = [];
          let storeIds = [];
          this.curSelectId.push('-1');
          for(let i=0; i<defaultSel;i++){
            this.curSelectId.push(this.compareType=='stores'?this.curTypeArrary[i].storeId: this.curTypeArrary[i].value);
            selectedLabels.push(this.curTypeArrary[i].label);
            storeIds.push(this.curTypeArrary[i].storeIds)
          }
          this.onChangeCompareType({selectedArray:this.curSelectId,storeIds,selectedLabels});
            //this.$emit("emitTypeChanged",{compareType:this.compareType,compareArr:storeIds,selectedLabels});
        
            
      }
        
    },
    onChangeCompareType({selectedArray,storeIds,selectedLabels}) {
     // console.log("onChangeCompareType > selectedArray:",selectedArray);
      //console.log("onChangeCompareType > selectedLabels:",selectedLabels);
      this.curSelectId = selectedArray;
      let originArray = [];
      this.curTypeArrary.forEach(function(item){
        if(item.value !='-1' && selectedArray.indexOf(item.value) ){
          originArray.push(item)
        }
      })
      const compareArr= [];
      selectedArray.forEach(function(item){
          if(item!='-1')compareArr.push(item)
      })
      this.$emit("emitTypeChanged",{compareType:this.compareType,compareArr:compareArr,selectedLabels,originArray});
      //this.changeStoreNew(arr);
    },
    doGetStoreIdsByProvince(provinceArrary){
      //console.log("provinceArrary:",provinceArrary);
      const self = this;
      const storeList = self.storeList;
      const temp = [];
      const tempStoreIds = [];
      storeList.forEach(item => {
        //console.log("item.province:",item);
        if (item.country === this.curCountry || this.curCountry==-1) {
          let storeObj = {};
          if(provinceArrary.includes(item.province)){
            if(!tempStoreIds.includes(item.storeId))tempStoreIds.push(item.storeId);
          }
        }
      });
      return tempStoreIds;
    },
    doGetStoreIdsByCity(cityArrary){
      //console.log("cityArrary:",cityArrary);
      const self = this;
      const storeList = self.storeList;
      const temp = [];
      const tempStoreIds = [];
      storeList.forEach(item => {
        //console.log("item.city:",item);
        if (item.country === this.curCountry || this.curCountry==-1) {
          let storeObj = {};
          if(cityArrary.includes(item.city)){
            if(!tempStoreIds.includes(item.storeId))tempStoreIds.push(item.storeId);
          }
        }
      });
      return tempStoreIds;
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
    width:calc(285/1440*100vw);
    height:35px;
    border-radius: 5px;
    display:flex;
    flex-direction:row;
    background-color:#f7f9f9;
    float: left;
    .type-pick{
        display:flex;
        flex-direction:row;
        .type-div{
            width: calc(52/1440*100vw);
            height: 18px;
            margin: 2px 0 4px 4px;
            font-family: NotoSansCJKtc;
            font-size: 13px;
            text-align: center;
            color: #556679;
            align-self: center;
        }
        .dropdown-select{
            width:calc(85/1440*100vw);
            height:36px;
            border:1px solid #f7f9fa;
            color: #2b2b2b;
            align-self: center;
            align-items: center;
        }
    }
    .area-muti{
      width:calc(141.5/1440*100vw);
      font-size: 15px;
      ::v-deep.el-select.el-select--medium{
         background-color: #f7f9f9 !important;
        }
    }
    
}  
</style>
<style>
.area-muti.el-select.el-select--medium{
    color: #2b2b2b;
    background: #f7f9f9 !important;
    height: 35px;
    line-height: 35px;
    border: none !important;
    width: 100%;
    min-height: 35px;
    min-width: 85px;
  }
  .area-muti.input-class.el-input--medium .el-input__inner{
    height: 35px;
    line-height: 35px;
    color: #2b2b2b;
    background-color: #f7f9f9 !important;
    border:none;
    padding: 0 10px;
    font-size: 13px;
    min-width: 55px;
    min-height: 28px;
    text-overflow: ellipsis;
  }
</style>