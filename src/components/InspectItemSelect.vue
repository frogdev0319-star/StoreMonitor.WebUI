<template>
    <div class="content">
        <div class="type-pick">
            <div class="type-div">{{$t('remotePatrol.inspectionItems')}}</div>
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
            <el-select v-bind:disabled='layer2=="all"' style="width:250px"
             class="dropdown-select" v-model="selectedItem" value-key="value"  @change="changeItem">
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
            layer1:'all',
            curLayer1:null,
            curLayer2:null,
            layer1List:[{value:'all',label:this.$t('eventView.all')}],
            layer2:'all',
            layer2List:[{value:'all',label:this.$t('eventView.all')}],
            itemList:[{value:'all',label:this.$t('eventView.all')}],
            selectedItem:'',
            curItem:null,
            selAllString:this.$t('eventView.all'),
            showItems:false,
        }
  },
  created() {
    console.log("InspectItemSelect Created")
    this. getLayer1List(this.inspectItemList);
  },
  watch: {
      inspectItemList: {
        immediate: false, 
        deep: true,
        handler (val,old ) {
          console.log("selectedItemList Changed")
          this.getLayer1List(val);
        }
    },
  },
  computed: {

  },
  methods: {
    getLayer1List(list){
      let layer1List =[];
      let layer2List =[{value:'all',label:this.$t('eventView.all')}];
      let showItems = false;
      if(list){

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
      this.showItems= showItems;
      this.layer2 = 'all'
      this.selectedItem = 'all'
      this.layer2List = layer2List;
      this.itemList =[{value:'all',label:this.$t('eventView.all')}];
      this.layer1List = layer1List;
      this.notifyItemChanged();
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
          return item.qualifiedScore;
        }
    },
    changeLayer1(e){
      console.log("Change Layer1 to="+e)
      this.curLayer1=null;
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
      this.layer1 =e;
      this.layer2 = 'all'
      this.selectedItem = 'all'
      this.layer2List = layer2List;
      this.itemList =[{value:'all',label:this.$t('eventView.all')}];
      this.notifyItemChanged();
    },
    changeLayer2(e){
      this.layer2 = e;
      let itemList =[{value:'all',label:this.$t('eventView.all')}];
      if(e=='all'){
          this.curLayer2 =null;
      }
      else{
        this.curLayer2 =null;
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
      this.itemList=itemList;
      this.curItem =null;
      this.selectedItem = 'all'
      this.notifyItemChanged();

    },
    changeItem(e){
      console.log("Change Layer1")
    },
    notifyItemChanged(){
       console.log("NOtify changed")
       let item = this.curLayer2?this.curLayer2:this.curLayer1;
       let ids = this.getIds(item)
       console.log(ids)
       item.ids = ids;
       item.qualifiedScore = this.getScore(item);
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
            height: 18px;
            margin: 2px 0 4px 4px;
            font-family: NotoSansCJKtc;
            font-size: 13px;
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