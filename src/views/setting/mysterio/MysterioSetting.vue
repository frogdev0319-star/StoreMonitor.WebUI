<template>
    <div class="page-container mysterio-page paper">
        <div v-if="isLoadingData" class="empty-content">
          <img :src="loadingGif" class="loading_rotate">
          <span class="empty-text">{{ $t('remotePatrol.loading') }}</span>
        </div>
        <div v-else>
            <div class="mysterio-title padding flex-center">
                {{this.$t('mysterio.storeAuthSetting')}}
                <div class="spacer"></div>
                <div class="buttons">
                    <delay-button
                        type="filled"
                        @click="saveAuth">
                        <div class="button-area">
                            <span>{{ $t('titleView.save') }}</span>
                        </div>
                    </delay-button>
                </div>
            </div>
            <div class="mysterio-body" v-for="(item,index) in storeSettingArray" :key="item.id">
                <div class="store-item">
                    <span style="color:'#C60957'">*</span>
                    <div class="item-label">{{$t('remotePatrol.stores')}}</div>
                    <div class="item-selection shadow-light">
                        <el-select
                            v-model="item.storeId"
                            @change="onChangeSelectedStore(item.storeId,index)"
                            size="mini">
                            <el-option v-for="(sitem) in storeDataList"
                                :key="sitem.storeId"
                                :label="sitem.label"
                                :value="sitem.storeId"
                        />
                        </el-select>
                    </div>
                </div>
                <div class="store-item">
                    <span style="color:'#C60957'">*</span>
                    <div class="item-label">{{$t('overview.patrolLists')}}</div>
                    <div class="item-selection shadow-light">
                        <el-select
                            v-model="item.inspectTagId"
                            placeholder="请选择"
                            :disabled="item.tagDisable"
                            @change="onChangeSelectedInspect(item,index)"
                            size="mini">
                            <el-option-group
                                v-for="group in storeDataList[item.selStoreIndex].inspectList"
                                :key="group.label"
                                :label="group.label">
                                <el-option v-for="(sitem) in group.options"
                                    :key="sitem.inspId"
                                    :label="sitem.label"
                                    :value="sitem.inspId"
                                />
                            </el-option-group>
                        </el-select>
                    </div>
                </div>
                <el-button class="img-div"
                    type="primary" 
                    size="mini"
                    :disabled="item.buttonDisabled"
                    @click="(index==storeSettingArray.length-1)?addAuth(index):deleteAuth(item.id)"
                >
                    <img class="img-add" :src="(index==storeSettingArray.length-1)? iconAdd:iconDelete" width="40" height="40" />
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mysteroRESTful } from '@/api/index';
import { getStoreList} from '@/api/store';
import { mapGetters } from 'vuex';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
    name: 'MysterioSetting',
    components: {DelayButton,DialogPop },
    data() {
      return {
        isLoadingData: true,
        loadingGif: require('@/../static/img/loading.svg'),
        iconDelete:require('@/../static/img/ic_delete_blue.svg'),
        iconAdd:require('@/../static/img/add_icon.png'),
        storeSettingArray:[],
        storeDataList:[],
        selStoreId:null,
        selStoreIndex:0,
        selInspectId:null,
        userId:null,
        inspectDisable:true,

      };
    },

    computed: {
      ...mapGetters({ accountChanged: 'accountChanged' })
    },

    watch: {
      accountChanged(val) {
        val !== 0 && this.init();
      }
    },

    created() {
        this.getRouteData();
        this.init();
    },

    methods: {
        getRouteData(){
            this.userId = this.$route.params.userId;
            console.log("userId:",this.userId);
        },
        init(){
            this.getGetStoreData();
            this.getAuthList();
        },
        getGetStoreData() {
            const self = this;
            const params = {
                'filter': {
                'page': 0,
                'size': 2000
                }
            };
            new Promise((resolve, reject) => {
                getStoreList(params).then(res => {
                    const errMsg = res.errMsg;
                    if (errMsg && errMsg === 'Success') {
                        resolve(res.data);
                    }
                }).catch(err => {
                    reject(err);
                });
            }).then(result =>{
                var storeList = [];
                Promise.all( result.content.map(store=>{

                    var storeObj = {
                        storeId:store.storeId,
                        label:store.name,
                        value:store.storeId,
                        inspectList:{remote:{label:"遠程",options:[]},onSite:{label:"現場",options:[]}}
                    }
                    
                    store.appliedInspect.map(insp=>{
                        var inspObj={
                            inspId:insp.id,
                            label:insp.name,
                            value:insp.id
                        }
                        if(insp.mode==0)
                            storeObj.inspectList.remote.options.push(inspObj);
                        else
                            storeObj.inspectList.onSite.options.push(inspObj);
                    })
                    
                    storeList.push(storeObj);
                })).then(res =>{
                    self.storeDataList = storeList;
                    self.isLoadingData = false;
                    }
                )
            });
        },
        getAuthList(){
            this.storeSettingArray = [
                {id:1,storeId:"",storeName:"",selStoreIndex:0,incepId:"",incepName:"",tagDisable:true,buttonDisabled:true}
            ]
        },
        saveAuth(){},
        onChangeSelectedStore(val,idx){
            console.log("onChangeSelectedStore idx:",val);
            if(val){
                this.storeSettingArray[idx].tagDisable = false;
                this.storeSettingArray[idx].selStoreId = val;
                var storeIndex = this.storeDataList.findIndex((store) =>store.value == val);
                console.log("storeIndex:",storeIndex);
                this.storeSettingArray[idx].selStoreIndex = storeIndex;
                
                
            }
        },
        onChangeSelectedInspect(val,idx){
            console.log("onChangeSelectedInspect idx:",idx);
            this.storeSettingArray[idx].incepId = val;
            this.storeSettingArray[idx].buttonDisabled = false;
        },
        addAuth(index){
            console.log("add item index:",index);
        },
        deleteAuth(itemId){
            console.log("delete item id:",itemId)
        },
    }
}
</script>

<style scoped lang="scss">
.empty-content{
    display: flex;
    justify-content: center;
    align-items: center;
  }
.mysterio-page{
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
    .mysterio-title{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  }
}
.mysterio-body{
    padding: 40px;
    display: flex;
    flex-direction: row;
    .store-item{
        width:auto;
        height: 40px;
        align-content: center;
        align-self: center;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 40px;
        span{
                color:#C60957;
                font-size: 12px;
            }
        .item-label{
            
        }
        .item-selection{
            margin-left: 20px;
            /deep/ .el-input__inner {
                border: none;
                font-size: 15px;
                height: calc(28/1440*100vw);
                line-height: calc(28/1440*100vw);
            }
        }
    }
    .img-div{
        min-width:40px;
        height: 40px;
        align-content: center;
        align-self: center;
        display: flex;
        align-items: center;
        margin-left:20px;
        border:none;
    }
    .el-button--primary{
        background-color: #006ab7;
        min-width:40px;
    }
    .el-button--primary:hover{
        background-color:  #2c5a7d;
        min-width:40px;
    }
    .el-button--mini {
        padding: 0px 5px;
    }
}
.el-scrollbar .el-select-group__wrap{
        
        /deep/
        .el-select-group__title{
            background-color: #E4F3FD;
            font-size: 14px;
            font-weight: bold;
            padding-left: 5px;
        }
        
    }
</style>