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
            <div style="width:1px; height:20px;background-color:rgba(172, 174, 177,0.3);align-self: center;"></div>
            <div v-if="allowAll">
              <multi-select
                ref="multiSelectTypeSelected"
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
import util from '@/common/util.js';
import MultiSelect from '@/components/MultiSelect2';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getDepartmentList } from '@/api/checkin';
import { getUserInfo } from '@/api/login';
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
        allowPerson:{
          type:Boolean,
          default:false
        },
        allowAll:{
          type:Boolean,
          default:false
        },
        limitNum:{
          type:Number,
          default:0
        },
        inspectId:{
          type:String,
          default:''
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
    data() {//,{value:'position',label:this.$t('overview.position')},{value:'users',label:this.$t('overview.user')}
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
            orginStoreList:{},
            curStoreTypeList:[],
            curStoreGroupList:[],
            curStoreList:[],
            storeGroupList: [],
            storeTypeList: [],
            dropdownPlaceholder:this.$t('remotePatrol.stores'),
            curTypeArrary:[],
            curSelectId:[],
            selAllString:this.$t('overview.all'),
            userPosition:[],
            origianlUserList:[],
            userIds: [],
            userList: [],
            origianlUserList: [],
            positionIds: [],
            positionsList: [],
        }
  },
  async created() {
    console.log("On Created")
    await this.getStoreListAndGroupAndType();
    if(this.allowPerson){
     this.compareTypeItems.push({value:'position',label:this.$t('overview.position')})
     this.compareTypeItems.push({value:'users',label:this.$t('overview.user')})
     this.getSearchCondition();
    }

  },
  watch: {
    async accountChanged(val) {
      console.log("Get Account Changed")
      const self = this;
      if (val !== 0) {
        self.ifGetParamsFromCash = false;
        self.getStoreListAndGroupAndType();
        if(self.allowPerson){
            this.getSearchCondition();
         }
      }
    },
    inspectId:{
              immediate: false, 
        deep: true,
       handler (val,old ) {
          console.log("Inspect ID Changed")
          let selectedLabels = [];
          let storeIds = [];
          this.curSelectId.push('-1');
          for(let i=0; i<this.curTypeArrary.length;i++){
            this.curSelectId.push(this.compareType=='stores'?this.curTypeArrary[i].storeId: this.curTypeArrary[i].value);
            selectedLabels.push(this.curTypeArrary[i].label);
            storeIds.push(this.curTypeArrary[i].storeIds)
          }
          this.onChangeCompareType({selectedArray:this.curSelectId,storeIds,selectedLabels});

        }
    },
    regionArray1: {
              immediate: false, 
        deep: true,
        handler (val,old ) {
          console.log("RegionArray1 changed")
          console.log("this.storeList:",this.storeList);
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
              immediate: false, 
        deep: true,
        handler (val,old ) {
       //   console.log("RegionArray2 changed")
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
          //console.log("Change curStoreGroup")
          //console.log(val);
          this.curStoreGroupList = [];
          val.map(item => {
            if(item!='-1'){
              this.storeGroupList.map(store=>{
                  if(item == store.value)
                    this.curStoreGroupList.push(store);
              });
              
            }
          });
    
          if(this.compareType== 'storeGroup'){
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
          const self = this;
          console.log("Change curStoes")
          console.log(val);
          console.log(self.orginStoreList)
          let curStoreList = [];      
          val.map(item => {
            if(item!='-1' && self.orginStoreList[item]){
              curStoreList.push(self.orginStoreList[item]);
            }
          });
          this.curStoreList = curStoreList;
          if(this.compareType== 'stores'){
            this.curSelectId=[];
            this.changeCompareType(this.compareType);
          }

        }
    },
    async curCountry(val){
     //console.log("!!curCountry:",val);
    //  await this.getStoreListAndGroupAndType();
    }
  },
  computed: {
     ...mapGetters({ accountChanged: 'accountChanged' }),
     cachedParamsInfo() {
     // console.log(this.cachedParams)
      return this.cachedParams
    }
  },
  methods: {
    async getStoreListAndGroupAndType() {
      console.log("getStoreListAndGroupAndType")
      const self = this;  
      let results = [[],[],[]];
      results[0] =await  this.getBriefStoreData();
      results[1] =await this.getStoreDefineList(1);
      results[2] =await  this.getStoreDefineList(0);
    //  Promise.all([storeListPromise, storeGroupPromise, storeTypePromise]).then(results => {
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
        const orginStoreList ={};
        this.storeList = storeList;
        storeList.forEach(item=>{
          orginStoreList[item.storeId] = {value:item.storeId,label:item.name,storeId:item.storeId};
        })
        this.orginStoreList = orginStoreList;
   
        this.getCountryStore();
        this.storeGroupList = groupList;
        this.storeTypeList = typeList;

         this.curStoreGroup.map(item => {
            if(item!='-1'){
              this.storeGroupList.map(store=>{
                  if(item == store.value)
                    this.curStoreGroupList.push(store);
              });
              
            }
          });
          this.curStoreType.map(item => {
            if(item!='-1'){
              this.storeTypeList.map(store=>{
                  if(item == store.value)
                    this.curStoreTypeList.push(store);
              });
              
            }
          });
          let curStoreList = [];      
          this.curStores.map(item => {
            if(item!='-1' && self.orginStoreList[item]){
              curStoreList.push(self.orginStoreList[item]);
            }
          });
          this.curStoreList = curStoreList;
          //console.log(this.orginStoreList)
          //console.log(this.curStoreList)
          //console.log("StoreListAndGroupAndType Leave")
     /// }).catch(err => {
      //  console.log('StoreFilter - getStoreGroupAndType: ' + err);
      //});
    },
    getCountryStore() {
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
     //       console.log("province > item",item);
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
                //    console.log("city > item",item);
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
     async getSearchCondition() {
      const userPosition = getDepartmentList({ type: 1 }); //取得職務
      const userPromise = getUserInfo();
      try {
        const result = await Promise.all([userPosition, userPromise]);
        this.getUserList(result[1].data);
        this.getUserPositionList(result[0].data);
      } catch (e) {
        console.log(e);
      }
    },
    getUserIdFromName(name){
      console.log("getUserIdFromName="+name)
      if(this.userList){
        console.log(this.userList)
        let d =  this.userList.find(item=>item.label==name);
        console.log(d)
        if(d)return d.value;
      }
      return null;
    },
    getUserPositionList(data) {
      console.log(data)
      this.positionsList = [];
      const userIdList = [];
      data.map(department => {
        const departmentJson = {};
        departmentJson.label = department.defineName;
        departmentJson.value = department.defineId;
        departmentJson.contents = department.contents;
        userIdList.push(department.contents);
        this.positionsList.push(departmentJson);
      });
      const userList = this.origianlUserList.map(user => user.value);
      const filterUser = util.getDiffBetweenArrays(userIdList, userList);
      this.roleId === 1 && this.userPosition.push({
        label: this.$t('titleView.others'),
        value: '00',
        content: filterUser
      });
      this.positionIds = this.ifCachedParams ? this.departmentIds : this.positionsList.map(depart => depart.value);
    },

    getUserList(data) {
     // console.log(data)
      this.userList = [];
      this.origianlUserList = [];
      data.map(user => {
        const userJson = {};
        userJson.label = user.userName;
        userJson.value = user.userId;
        userJson.title = user.title;
        this.origianlUserList.push(userJson);
        this.userList.push(userJson);
      });
      this.userIds = this.ifCachedParams ? this.userIds : this.userList.map(user => user.value);
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
      //console.log("Change Compare Type=" +val);
      let self = this;
      self.compareType = val;
      self.curSelectId = [];
      self.curTypeArrary = [];
      let storeIds = [];
      switch (val){
        case 'area1':
          self.dropdownPlaceholder = self.$t('remotePatrol.regionI');
          self.selAllString=self.$t('overview.allZoneI');
          self.curTypeArrary =self.provinceList;
          self.curTypeArrary.forEach(function(item){
            item.contents =[];
            self.storeList.forEach(function(store){
               if(self.curStores.indexOf(store.storeId)>=0 && store.province == item.label){
                 item.contents.push(store.storeId);
               }
            });
          })
          break;
        case 'area2':
          self.dropdownPlaceholder =  self.$t('remotePatrol.regionII');
          self.selAllString=self.$t('overview.allZoneII');
          self.curTypeArrary =  self.cityList;
          self.curTypeArrary.forEach(function(item){
            item.contents =[];
            self.storeList.forEach(function(store){
               if(self.curStores.indexOf(store.storeId)>=0 && store.city == item.label){
                 item.contents.push(store.storeId);
               }
            });
          })
          break;
        case 'storeGroup':
          //console.log("storeGroup");
          self.dropdownPlaceholder =  self.$t('remotePatrol.storeGroup');
          self.selAllString=self.$t('storeView.all');
          self.curTypeArrary = self.curStoreGroupList;
          for(let i=0; i<self.curTypeArrary ;i++){
            storeIds = storeIds.concat(self.curTypeArrary[i].storeIds);
          }
          //console.log("self.curTypeArrary:",self.curTypeArrary);
          break;
        case 'storeType':
          self.dropdownPlaceholder =  self.$t('remotePatrol.storeType');
          self.selAllString=self.$t('storeView.all');
          self.curTypeArrary = self.curStoreTypeList;
          for(let i=0; i<self.curTypeArrary ;i++){
            storeIds = storeIds.concat(self.curTypeArrary[i].storeIds);
          }
          break;
        case 'users':
          self.dropdownPlaceholder =  self.$t('overview.user');
          self.selAllString=self.$t('overview.allUser');
          self.curTypeArrary = self.userList;
          break;
        case 'position':
          self.dropdownPlaceholder =  self.$t('overview.position');
          self.selAllString=self.$t('overview.allPosition');
          self.curTypeArrary = self.positionsList ;
          break;
        case 'stores':
      //    console.log(self.curStores)
          self.dropdownPlaceholder =  self.$t('remotePatrol.stores');
          self.selAllString=self.$t('overview.all');
          self.curTypeArrary = self.curStoreList;
          for(let i=0; i<self.curTypeArrary ;i++){
            if(self.curTypeArrary[i].storeId != '-1'){
              storeIds.push(self.curTypeArrary[i].storeId);
            }
          }
          break;
        default:
          self.dropdownPlaceholder =  self.$t('remotePatrol.stores');
          self.selAllString=self.$t('overview.all');
          self.curTypeArrary = self.curStoreList;
          break;
      }
      //console.log("curSelectId:",self.curSelectId);
      //if(self.curSelectId.length==0){
        let selectedLabels = [];
        /*if(!self.allowAll){
          console.log("self.limitNum:",self.limitNum);
          let defaultSel = (self.curTypeArrary.length>self.limitNum)?self.limitNum:self.curTypeArrary.length;
          let selectedLabels = [];
          for(let i=0; i<defaultSel;i++){
            if(self.curSelectId.length==0){
              self.curSelectId.push((self.compareType=="stores")?self.curTypeArrary[i].storeId:self.curTypeArrary[i].value);
            }
            selectedLabels.push(self.curTypeArrary[i].label);
            if(self.compareType=='stores'){
              storeIds.push(self.curTypeArrary[i].storeId);
            }else if(self.compareType=='storeGroup' || self.compareType=='storeType' ){
              console.log("**",self.curTypeArrary[i].storeIds);
              storeIds = storeIds.concat(self.curTypeArrary[i].storeIds);
            }
          }
        }else{*/
          let defaultSel = self.curTypeArrary.length;
          if(!self.allowAll){
             defaultSel = (self.curTypeArrary.length>self.limitNum)?self.limitNum:self.curTypeArrary.length;
          }
          let selIdLength = self.curSelectId.length;
          for(let i=0; i<defaultSel;i++){
            if(selIdLength==0){
              //if(self.allowAll) self.curSelectId.push('-1');
              self.curSelectId.push((self.compareType=="stores")?self.curTypeArrary[i].storeId:self.curTypeArrary[i].value);
            }
            selectedLabels.push(self.curTypeArrary[i].label);
            if(self.compareType=='stores'){
              storeIds.push(self.curTypeArrary[i].storeId);
            }else if(self.compareType=='storeGroup' || self.compareType=='storeType' ){
              console.log("**",self.curTypeArrary[i].storeIds);
              storeIds = storeIds.concat(self.curTypeArrary[i].storeIds);
            }
            
          }
        //}
          //console.log("storeIds:",storeIds);
          self.onChangeCompareType({selectedArray:self.curSelectId,storeIds:storeIds,selectedLabels});
            //self.$emit("emitTypeChanged",{compareType:self.compareType,compareArr:storeIds,selectedLabels});    
      //}
        
    },
    onChangeCompareType({selectedArray,storeIds,selectedLabels}) {
      //console.log("onChangeCompareType > selectedArray:",selectedArray);
      //console.log("onChangeCompareType > selectedLabels:",selectedLabels);
      console.log("1.onChangeCompareType > storeIds:",storeIds);
      this.curSelectId = selectedArray;
      let originArray = [];
      this.curTypeArrary.forEach(function(item){
        if(item.value !='-1'  ){
          originArray.push(item)
        }
      })
      const compareArr= [];
      selectedArray.forEach(function(item){
          if(item!='-1')compareArr.push(item)
      })
      let storeId = [];
      if(storeIds.includes('-1')){
        storeIds = storeIds.slice(1,storeIds.length-1);
      }
      storeId = storeIds;
      if(this.compareType== 'area1'){
        storeId=this.doGetStoreIdsByProvince(selectedArray);
        //("storeId:",storeId);
        
      }else if(this.compareType=='area2'){
        storeId=this.doGetStoreIdsByCity(selectedArray);
        //console.log("storeId:",storeId);
      }
      //console.log("2.onChangeCompareType > storeId:",storeId);
      this.$emit("emitTypeChanged",{compareType:this.compareType,compareArr:compareArr,selectedLabels,originArray,selStoreIdArr:storeId});
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
    width:calc(355/1440*100vw);
    height:36px;
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
            margin: 2px 0 4px 4px;
            font-family: NotoSansCJKtc;
            font-size: 13px;
            text-align: center;
            color: #556679;
            align-self: center;
        }
        .dropdown-select{
            width:calc(105/1440*100vw);
            height:36px;
            border:1px solid #f7f9fa;
            color: #2b2b2b;
            align-self: center;
            align-items: center;
        }
    }
    .area-muti{
      width:calc(180/1440*100vw);
      font-size: 15px;
      ::v-deep.el-select.el-select--medium{
         background-color: #f7f9f9 !important;
        }
    }
    
}  
</style>
<style>
.dropdown-select.el-select .el-input--medium .el-input__inner{
    height: 35px;
    font-size: 13px;
    text-align: left;
    border: none;
    background-color: #f7f9fa;
    color:#2b2b2b;
    border-radius: 0px;
  }
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