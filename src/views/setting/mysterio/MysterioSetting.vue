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
                            <span>{{ $t('audit.workFlows.save') }}</span>
                        </div>
                    </delay-button>
                </div>
            </div>
            <div class="mysterio-body">
                <div style="height:148px;flex:1;">
                <div class="store-item" style="height:85px;">
                    <div class="item-label"><span style="color:'#C60957'">*</span>{{$t('mysterio.nickName')}}</div>
                    <div class="nickName-input"> 
                        <el-input
                        ref="nickName"
                        v-model="nickName"
                        :disabled="noInput"
                        @input="(val) => itemInputChanged(val, 50)"
                        />
                        <span class="text_limit_notice" v-if="showInputLimit"> {{$t('mysterio.nickNameTip')}}  </span>
                    </div>
                </div>
                <div class="store-item">
                    <div class="item-label"><span style="color:'#C60957'">*</span>{{$t('remotePatrol.stores')}}</div>
                    <div class="item-selection">
                        <el-select
                            v-model="selStoreValue"
                            @change="onChangeSelectedStore"
                            size="mini">
                            <el-option v-for="(sitem) in storeDataList"
                                :key="sitem.storeId"
                                :label="sitem.label"
                                :value="{value:sitem.storeId,label:sitem.label}"
                        />
                        </el-select>
                    </div>
                </div>
                </div>
                <div style="height:148px;flex:1;">
                    <div style="height:85px;"></div>
                    <div class="store-item">
                        <div class="item-label"><span style="color:'#C60957'">*</span>{{$t('overview.patrolLists')}}</div>
                        <div class="item-selection">
                            <el-select
                                v-model="selInspectVaule"
                                @change="onChangeSelectedInspect"
                                size="mini">
                                <el-option-group
                                    v-for="group in storeDataList[selStoreIndex].inspectList"
                                    :key="group.label"
                                    :label="group.label">
                                    <el-option v-for="(sitem) in group.options"
                                        :key="sitem.inspId"
                                        :label="sitem.label"
                                        :value="{value:sitem.inspId,label:sitem.label}"
                                    />
                                </el-option-group>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div style="height:148px;">
                    <div style="height:85px;"></div>
                    <delay-button @click="addAuth" style="margin-left:32px;height:36px; margin-top:calc(36/1920*100vw) ;">
                        <div class="button-area">
                            <i class="iconfont el-icon-plus"/>
                            <span>{{$t('mysterio.addAuth')}}</span>
                        </div>
                    </delay-button>
                </div>
            </div>
            <div class="addList">
                <div style="border-left:4px solid #2c90d9;text-align: left;margin-bottom:17px ;"><span style="margin-left:12px;">{{$t('mysterio.authList')}}</span></div>
                <table-only
                    ref="elTP"
                    class="table-white"
                    table-themes="white"
                    :column-data="columnData"
                    :table-data="tableData"
                    :table-operation ="columnOperationData"
                    :highlight-current-row= "false"
                    :is-loading-data="isLoadingData"
                    :allowRowExpand = "false"
                    :showBorder = "false"
                    :default-sort = "defaultSort"
                    :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                    :tableHeight = "760"
                    :cellStyle="{'backgroundColor': '#fff !important'}"    
                    @sortChange="handleSortChange"         
                    @handleOperation="handleOperation"             
                />
                <div style="width:100%; margin-top:12px;height:31px;">
                    <tbl-pagination-only
                        :btn-style="{'backgroundColor':'transparent'}"
                        :total="total"
                        :current-page="curPage"
                        :page-size="curSizeNum"
                        layout = "prev,pager, next,sizes,slot"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange"
                    />
                </div>
            </div>
        </div>
        <dialog-pop
            :title="warnningTitle"
            :isWarning="true"
            :visible="showItemExitedDialog"
            @cancelHandler = "onShowItemExitedDialogClose"
            @confirmHandler="onShowItemExitedDialogClose">
        </dialog-pop>
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
import filterString from '@/common/filterString.js';

export default {
    name: 'MysterioSetting',
    components: {DelayButton,DialogPop,TableOnly,TblPaginationOnly },
    data() {
      return {
        isLoadingData: true,
        loadingGif: require('@/../static/img/loading.svg'),
        iconDelete:require('@/../static/img/ic_delete_blue.svg'),
        iconAdd:require('@/../static/img/add_icon.png'),
        storeSettingArray:[],
        storeDataList:[],
        selStoreValue:{value:null,label:""},
        selStoreId:null,
        selStoreName:"",
        selStoreIndex:0,
        selInspectVaule:{value:null,label:""},
        selInspectId:null,
        selInspecName:"",
        userId:null,
        inspectDisable:true,
        total:0,
        curPage:1,
        curSizeNum:10,
        defaultSort:{prop: 'storeName', order: 'ascending'},
        allTableData:[],
        tableData:[],
        columnData:[{
            'prop': 'storeName',
            'label': this.$t('remotePatrol.stores'),
            'sortable': true,
            'width': 200,
            'maxWidth': 200,
            'isExpand': false
          },
          {
            'prop': 'incetionTag',
            'label': this.$t('overview.patrolLists'),
            'sortable': true,
            'width': 360,
            'maxWidth': 360,
            'isExpand': false
          }],
          columnOperationData: {
          label: this.$t('mysterio.authDelete'),
          minWidth: '50',
          align: 'left',
          operation: [
            {
              lable: '',
              icon: 'icon-delete',
              methods: 'delete'
            }
          ]
        },
        showItemExitedDialog:false,
        warnningTitle:"",
        nickName:"",
        showInputLimit:false
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
            this.nickName = this.$route.params.nickName;
            console.log("userId:",this.userId);
        },
        init(){
            this.getGetStoreData();
            
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
                console.log("result:",result);
                Promise.all( result.content.map(store=>{

                    var storeObj = {
                        storeId:store.storeId,
                        label:store.name,
                        value:store.storeId,
                        inspectList:{
													// remote:{label:"遠程",options:[]},
													onSite:{label:"現場",options:[]}
												}
                    }
                    
                    store.appliedInspect.map(insp=>{
                        var inspObj={
                            inspId:insp.id,
                            label:insp.name,
                            value:insp.id
                        }
												
												if(insp.mode !==0)
													storeObj.inspectList.onSite.options.push(inspObj);

												// ==== 2024 sprint1 遠端巡檢關閉 ====
                        // if(insp.mode==0)
                        //   storeObj.inspectList.remote.options.push(inspObj);
                        // else
                        //   storeObj.inspectList.onSite.options.push(inspObj);
                    })
                    
                    storeList.push(storeObj);
                })).then(res =>{
                    self.storeDataList = storeList;
                    self.getAuthList();
                })
            });
        },
        doMapStoreAndTag(storeId,inspId){
            var mapData = {storeId:-1,storeName:"",inspId:-1,incetionTag:""};
            var storeInfo = this.storeDataList.find(store => store.storeId == storeId);
            if(storeInfo!=null){
                mapData.storeId = storeInfo.storeId;
                mapData.storeName = storeInfo.label;
                var tag=null;
                tag = storeInfo.inspectList.remote.options.find(it=>it.inspId==inspId);
                if(tag==null){
                    tag = storeInfo.inspectList.onSite.options.find(it=>it.inspId==inspId);
                    if(tag){
                        mapData.inspId = tag.inspId;
                        mapData.incetionTag = tag.label;
                    }
                }else{
                    mapData.inspId = tag.inspId;
                    mapData.incetionTag = tag.label;
                }
            }
            return mapData;
        },
        getAuthList(){
            const self = this;
            mysteroRESTful.getMysterySetting({userId:this.userId}).then(res=>{
                var tempAuthLit = [];
                if(res.errCode==0){
                    res.data.settings.map(setting=>{
                        var obj = self.doMapStoreAndTag(setting.storeId,setting.inspectTagId);
                        obj['id']=setting.id;
                        tempAuthLit.push(obj);
                    });
                    self.nickName = res.data.nickname;
                }
                self.allTableData = tempAuthLit;
                self.total = Math.ceil( self.allTableData.length/self.curSizeNum);
                self.setDataTable();
                self.isLoadingData = false;
            });
        },
        setDataTable(){
            this.orderAllTableData();
            this.tableData = [];
            let page = this.curPage;
            let sizeNum = this.curSizeNum;
            let tempTable = this.allTableData.slice( (page - 1)* sizeNum, page* sizeNum);
            this.tableData = [...tempTable];
        },
        
        orderAllTableData(){
            let key = this.defaultSort.prop;
            this.allTableData = util.sort_by_key(this.allTableData,key,this.defaultSort.order );
        },
        saveAuth(){
            if(this.nickName.trim()==""){
                this.warnningTitle = this.$t('mysterio.pleaseInputNickName');
                this.showItemExitedDialog = true;
                return;
            }
            const self = this;
            var settingList=[];
            self.allTableData.map(auth =>{
                let obj={
                    userId:self.userId,
                    storeId:auth.storeId,
                    inspectTagId:auth.inspId
                };
                settingList.push(obj);
            });
            mysteroRESTful.batchAddMysterySetting({userId:self.userId,settingList,nickname:self.nickName}).then(res=>{
                if(res.errCode==0){
                    this.$router.push({name: 'MysterioManage'});
                }else if(res.errCode==500){//代稱重複
                    if(res.errMsg =="this nickname is exist!"){
                        this.warnningTitle = this.$t('mysterio.duplicateNickName');
                        this.showItemExitedDialog = true;
                    }else{
                        util.notify(self.$t('mysterio.saveMysterioSettingFail')+":"+res.errMsg, 'error', 3000);
                    }
                }else{
                    util.notify(self.$t('mysterio.saveMysterioSettingFail'), 'error', 3000);
                }
            });
        },
        onChangeSelectedStore(val){
            console.log("onChangeSelectedStore idx:",val);
            if(val){
                this.selStoreValue = val;
                this.selInspectVaule = {value:null,label:""};
                this.selInspectId = null;
                this.selStoreId = val.value;
                this.selStoreName=val.label;
                var storeIndex = this.storeDataList.findIndex((store) =>store.value == val.value);
                this.selStoreIndex = storeIndex;
            }
        },
        onChangeSelectedInspect(val){
            console.log("onChangeSelectedInspect val:",val);
            this.selInspectId = val.value;
            this.selInspectName = val.label;
            this.selInspectVaule = val;
        },
        clearSelection(){
            this.selStoreValue = {value:null,label:""};
            this.selInspectVaule = {value:null,label:""};
            this.selStoreId = null;
            this.selInspectId = null;
        },
        addAuth(){
            if(this.selStoreId==null){
                this.warnningTitle = this.$t('mysterio.pleaseChooseStore');
                this.selInspectId = null;
                this.showItemExitedDialog = true;
                return;
            }
            if(!this.selInspectId){
               this.warnningTitle = this.$t('mysterio.pleaseChooseTag');
                this.showItemExitedDialog = true;
                return;
            }
            const exitedItem = this.allTableData.find(item => (item.storeId==this.selStoreId && item.inspId == this.selInspectId));
            if(exitedItem){
                this.warnningTitle = this.$t('mysterio.authExited');
                this.showItemExitedDialog = true;
                return;
            }else{
                var maxid = Math.max.apply(null, this.allTableData.map(function (o) {
                    return o.id;
                }))
                this.allTableData.push({id:maxid+1,storeId:this.selStoreId,storeName:this.selStoreName,inspId:this.selInspectId,incetionTag:this.selInspectName});
                this.total = Math.ceil( this.allTableData.length/this.curSizeNum); 
                this.setDataTable();
                this.clearSelection();
            }
        },
        handleOperation({ method, row }) {
            console.log('List row =====>> ', row);
            switch(method){
                case 'delete':{
                  this.deleteAuth(row);
                break;      
                }
                default: {
                break;
                }
            }
        },
        deleteAuth(row){
            console.log("delete item row:",row);
            var delIndex = this.allTableData.findIndex(item=>item.id==row.id);
            this.allTableData.splice(delIndex,1);
            this.total = Math.ceil( this.allTableData.length/this.curSizeNum); 
            this.setDataTable();
        },
        currentChange(val) {
            const self = this;
            self.curPage = val.page;
            //self.params.filter = { page: val.page - 1, size: self.sizeNum };
            self.setDataTable();
        },
        sizeChange(val) {
            const self = this;
            self.curSizeNum = val.size;
            self.curPage = 1;
            self.total = Math.ceil( self.allTableData.length/self.curSizeNum);
            self.setDataTable();
        },
        handleSortChange(order, defaultSort){
            console.log(order,defaultSort);
            this.defaultSort={...defaultSort};
            this.setDataTable();
        },
        onShowItemExitedDialogClose(){
            this.showItemExitedDialog = false;
        },
        itemInputChanged(val, n){
            const content = filterString.all(val, n);
            this.nickName = content

            const length = filterString.getContentLength(val);
            if(length > n) {
                this.showInputLimit = true
            } else {
                this.showInputLimit = false
            }
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
.mysterio-nickName{
    width:auto;
    margin-top: 32px;
    margin-bottom: 27px;
    margin-right: 32px;
    display: flex;
    flex-direction: column;
    .item-label{
        flex:1;
        align-self: flex-start;
        margin-left: 32px;
        span{
                color:#C60957;
                font-size: 12px;
            }
    }
    .store-item{
        flex:1;
        height: 74px;
        align-content: flex-start;
        display: flex;
        flex-direction: row;
        align-items:flex-start;
        margin-top: 10px;
        margin-left: 32px;
        margin-right: 27px;
        justify-content: space-between;
        .nickName-input{
            display: flex;
            flex:1;
            .text_limit_notice{
                position: absolute;
                text-align: right;
                margin-left: 5px;
                font-size: 10px;
                margin-top: 2px;
                color: #ff2400;
                display: block;
            }
        }
    }
}
.mysterio-body{
    width:auto;
    margin-top: 32px;
    margin-bottom: 27px;
    margin-right: 32px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .store-item{
        flex:1;
        height: 74px;
        align-content: center;
        align-self: center;
        display: flex;
        flex-direction: column;
        align-items:flex-start;
        margin-left: 32px;
        span{
                color:#C60957;
                font-size: 12px;
            }
        .nickName-input{
            width:100%;
            .text_limit_notice{
                position: absolute;
                text-align: right;
                margin-left: 5px;
                font-size: 10px;
                margin-top: 2px;
                color: #ff2400;
                display: block;
            }
        }
        .item-selection{
            margin-top: 6px;
            display: flex;
            flex:1;
            width: 100%;
            .el-select{
                width:100%
            }
            /deep/ .el-input__inner {
                flex:1;
                font-size: 15px;
                height: 46px;
                line-height: calc(28/1440*100vw);
                width:100%;
            }
        }
    }
}
.addList{
    padding:0 32px;
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