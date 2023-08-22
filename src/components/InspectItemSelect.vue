<template>
    <div class="content">
        <div class="type-pick">
            <div class="type-div" :style="{'width':getLangStyleValue(typeDivWidth)}">{{$t('remotePatrol.inspectionItems')}}</div>
            <el-select class="dropdown-select" v-model="layer1" value-key="value"  @change="changeLayer1">
                <el-option 
                  v-for="item in layer1List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
        </div>
        
        <div class="type-pick">
            <el-select v-bind:disabled='layer1=="all"' style="width:250px"
              class="dropdown-select" v-model="layer2" value-key="value"  @change="changeLayer2">
                <el-option 
                  v-for="item in layer2List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
        </div>
        
          <div v-if="showItems" class="type-pick">
            <el-select 
              v-bind:disabled='layer2=="all"' 
              style="width:250px"
              class="dropdown-select" 
              v-model="selectedItem" 
              value-key="value"  
              @change="changeLayer3">
                <el-option 
                  v-for="item in itemList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
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
import util from '@/common/util.js';
export default {
    name: 'InspectItemSelect',
    components: {
      MultiSelect,
      RegionMultiSelect,
      LimitSelect
    },
    props: {
        inspectItemList:{
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
          
          curLayer1: null,
          layer1: 'all',
          layer1List:[{value:'all',label:this.$t('eventView.all')}],
          
          curLayer2: null,
          layer2: 'all',
          layer2List:[{value:'all',label:this.$t('eventView.all')}],

          curLayer3: null,
          layer3: 'all',
          layer3List: [{value:'all',label:this.$t('eventView.all')}],

          hasLayer3List: false,
          layer3Id: 'all',

          itemList:[{value:'all',label:this.$t('eventView.all')}],
          selectedItem:'',

          curItem:null,
          selAllString:this.$t('eventView.all'),
          showItems:false,
          lang:this.$i18n.locale,
          typeDivWidth:[{key:'en',value:'calc(52/1440*100vw)'},{key:'zh',value:'calc(52/1440*100vw)'},{key:'zhtw',value:'calc(52/1440*100vw)'},
            {key:'ja-JP',value:util.getWindowWidth()>1600?'calc(62/1440*100vw)':'80px'},{key:'ko-KR',value:'calc(52/1440*100vw)'},{key:'vi-VN',value:'calc(52/1440*100vw)'},
            {key:'id-ID',value:'calc(52/1440*100vw)'},{key:'th-TH',value:'calc(72/1440*100vw)'}],
        }
  },
  created() {
   // console.log("InspectItemSelect Created")
    this.getLayer1List(this.inspectItemList);
  },
  watch: {
      inspectItemList: {
        handler (val,old ) {
          console.log("selectedItemList Changed")
          console.log(val)
          console.log(old)
          this.getLayer1List(val);
        }
    },
  },
  computed: {

  },
  methods: {
    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    getLayer1List(list){
      console.log("getLayer1List > list:",list)
      let layer1List =[];
      let layer2List =[{value:'all',label:this.$t('eventView.all')}];
      let showItems = false;
      if(list){
        console.log("getLayer1List list:",list);
        list.forEach(item => {
          layer1List.push({label:item.name,value:item.id})
        });
        if(list.length>0){
          this.curLayer1=list[0];
          this.layer1 = list[0].id;
          this.curLayer1.items.forEach(subitem => {
              if(subitem.subject){
                layer2List.push({label:subitem.subject,value:subitem.id})
              }
              else{
                showItems = true;
                layer2List.push({label:subitem.name,value:subitem.id})
              }   
          });
        }
      }
      console.log("getLayer1List layer1List:",layer1List);
      console.log("getLayer1List layer2List:",layer2List);
      this.showItems= showItems;
      this.layer2 = 'all'
      this.selectedItem = 'all'
      this.layer2List = layer2List;
      this.itemList =[{value:'all',label:this.$t('eventView.all')}];
      this.layer1List = layer1List;
      if(list.length==0){
        console.log("emit list empty")
        this.$emit("emitItemChanged",{item:[]});
        
      }else{
        this.notifyItemChanged();
      }
      
    },
    getIds(item){
        const self =this;
        let list = [];
        if(item.items){
          item.items.forEach(function(d){
            let o =  self.getIds(d);
            list = list.concat(o);
          })
          return list;
        }
        else{
          
          return [item.id]
        }

    },
    getScore(item){
      const self =this;
      if(item.items){
          let qualifiedScore = 0;
          item.items.forEach(function(d){
            qualifiedScore += self.getScore(d);
          })
          return qualifiedScore;
      }
      else{
        return item.itemScore;
      }
    },
    changeLayer1(e){
      console.log("Change Layer1 to",  e)
      console.log('this.inspectItemList :>> ', this.inspectItemList);

      this.curLayer1 = null;
      let layer2List =[{value:'all',label:this.$t('eventView.all')}];
      let showItems = false;
      if(this.inspectItemList){
        this.inspectItemList.forEach(item => {
          if(item.id == e){
            this.curLayer1 = item;
            item.items.forEach(subitem => {
              if(subitem.subject){
                layer2List.push({label:subitem.subject,value:subitem.id})
              }
              else{
                showItems = true;
                layer2List.push({label:subitem.name,value:subitem.id})
              }   
            });
          }
              
        });
      }
      this.showItems= showItems;
      this.layer1 = e;
      this.layer2 = 'all'
      this.selectedItem = 'all'
      this.layer2List = layer2List;
      this.itemList =[{value:'all',label:this.$t('eventView.all')}];
      this.notifyItemChanged();
    },

    changeLayer2(e){
      console.log("Change Layer2" , e)
      this.layer2 = e;
      let itemList =[{value:'all',label:this.$t('eventView.all')}];
      if(e =='all'){
          this.curLayer2 = null;
      }
      else{
        this.curLayer2 = null;
        this.curLayer1.items.forEach(subitem => {
          if(subitem.id == e){
            this.curLayer2 = subitem;
              if(this.curLayer2 && this.curLayer2.items){
                this.showItems= true;
                this.curLayer2.items.forEach(subitem => {
                itemList.push({label:subitem.subject,value:subitem.id})
              });
            }
            else{
              this.showItems=false;
            }
          }
        });
      }
      this.itemList = itemList;
      this.curItem = null;
      this.selectedItem = 'all'
      this.notifyItemChanged();
    },
    
    changeLayer3(e){
      console.log("Change Layer3" , e)
      this.hasLayer3List = true
      
      if( e == 'all'){
        this.layer3Id = 'all'
      } else {
        this.layer3Id = e
      }
      console.log('this.itemList', this.itemList)
      this.notifyItemChanged();
    },


    notifyItemChanged(){
      console.log("Notify changed")
      console.log("this.curItem:",this.curItem)

      let item = this.selectedItem!='all' && this.curItem ? this.curItem : this.layer2!='all'&& this.curLayer2 ? this.curLayer2 : this.curLayer1;

      console.log('this.layer3Id----->>>', this.layer3Id)
      console.log('this.curLayer2----->>>', this.curLayer2)
      let ids = []
      
      // if(this.layer3Id == 'all'){
      //   let ids = []
      //   if(this.curLayer2){
      //     this.curLayer2.items.forEach( i => {
      //       ids.push(i.id)
      //     })
      //   }
      //   item.ids = ids
      // } else {
      //   if(this.hasLayer3List){
      //     console.log('1')
      //     let ids = []
      //     ids.push(this.layer3Id)
      //     item.ids = ids;
      //   } 
      // }
    
      console.log('item----->>>', item)
      item.qualifiedScore = this.getScore(item);
      console.log('item.ids', item.ids)
      console.log('item.qualifiedScore', item.qualifiedScore)

      this.$emit("emitItemChanged",{item});
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
            margin: 2px 0 4px 4px;
            font-family: NotoSansCJKtc;
            font-size: calc(13/1920*100vw);
            text-align: center;
            color: #556679;
            align-self: center;
        }
        .dropdown-select{
            width:calc(155/1440*100vw);
            height:36px;
            border:1px solid #f7f9fa;
            color: #2b2b2b;
            align-self: center;
            align-items: center;
        }
    }
    .area-muti{
      width:calc(141.5/1440*100vw);
      font-size: calc(15/1920*100vw);
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
    font-size: calc(13/1920*100vw);
    min-width: 55px;
    min-height: 28px;
    text-overflow: ellipsis;
  }
</style>