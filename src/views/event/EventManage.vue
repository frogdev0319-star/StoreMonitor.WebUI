<template>
    <div class="el-event-content" :style="{'height':windowHeight-118+'px'}">
       <div class="el-date">
            <span class="date-title">起止时间</span>
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
                :popper-class="poperClass"
                :picker-options='dateOpt'
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"
                :default-time="defaultTime">
            </el-date-picker>
            <el-tooltip :popper-class="toolTipClass" class="item" effect="dark"
                placement="bottom-end">
                <div slot="content">*最长搜索时间为一个月</div>
                <i class="iconfont icon-bangzhu iconbangzhu"></i>
            </el-tooltip>
            <span class="date-title" 
            style="margin-left:30px;margin-right:20px;">处理状态</span>
            <el-select v-model="value" placeholder="请选择" 
            class="el-select-content" size="small" @change="selectChange" :popper-class="selectpoperClass">
                <el-option
                v-for="(item) in states" 
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-input
                size="small"
                class="el-search"
                clearable
                v-model="serachVale" @clear="searchEventList(true)" @keyup.enter.native="searchEventList(true)">
                <i slot="prefix" class="iconfont icon-sousuo" style="margin-left:5px;font-size:18px;"></i>
            </el-input>
       </div>
        <div class="el-table-content">
            <el-button type="primary" size="mini" class="export-btn" @click="export2Excel">
               <i style="margin-right:18px;font-size:16px;" class="iconfont icon-excel">
                </i>导出报表
            </el-button>
            <el-tabs v-model="activeName" @tab-click="handleClick" id="tabs-content">
                <el-tab-pane v-for="(item,index) in tableDataList" 
                :key="index" :label="`${item.label} （${item.eventCount}）`">
                    <div class="el-table-panel">
                        <el-table 
                            :data="item.tableData" 
                            :highlight-current-row="true"
                            empty-text='没有事件数据'
                            align='left'
                            border
                            stripe
                            :height="windowHeight-320"
                            @sort-change='sortChange'
                            @row-click='rowClickItem'
                            style="border-left:1px solid #eee;"
                            class="table-content">
                                <el-table-column
                                    min-width="80"
                                    header-align="center"
                                    align="center">
                                        <template slot-scope="scope" >
                                        <span class="icon-span" style="background-color:#FDBA40;" v-if="scope.row.status==0" >未处理</span>
                                        <span class="icon-span" style="background-color:#434C5E;" v-else-if="scope.row.status==1" >已处理</span>
                                        <span class="icon-span" style="background-color:#6097F3;" v-else>已结案</span>       
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="option"
                                    label="事件名称"
                                    min-width="220"
                                    sortable='custom'
                                    align="left">
                                    <template slot-scope="scope">
                                        <img class='sourceType-icon' v-if="scope.row.sourceType==0" :src='videoSrc' height="24px"/>
                                        <img class='sourceType-icon' v-else-if="scope.row.sourceType==1" :src='inspectSrc' height="24px"/>
                                        <img class='sourceType-icon' v-else :src='insiteInspectSrc' height="24px"/>
                                        <span class="event-subject">{{scope.row.subject}}</span>
                                    </template>
                                </el-table-column>
                            <el-table-column v-for="(_item,_index) in tableInfoData" :key="_index"
                                :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="_item.width">
                            </el-table-column>
                            <el-table-column
                                prop="option"
                                label="操作"
                                min-width="60"
                                align="left">
                                <template slot-scope="scope">
                                    <i class="iconfont icon-gengduo" style="font-size:20px;cursor: pointer;" @click="toEventDetail(scope.row)"></i>
                                </template>
                            </el-table-column>
                            <div slot="empty">
                                <div>
                                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">暂无事件</span>
                                </div> 
                            </div>
                        </el-table>
                    </div>
                    <div class="toolbar pagination" style="width:100%; margin:10px 15px;height:13%;margin-bottom:0px;">
                        <el-pagination background small 
                            :page-sizes="[10, 20, 50, 100]"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="item.page"
                        layout="jumper,total, prev, pager, next,sizes"  
                        :page-size="item.sizeNum" :total="item.total" style="float:right;margin-top:10px;margin-bottom:10px;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import api  from '../../api/index';
    import util from '../../common/util.js'
    import CsvExportor from 'csv-exportor'
    import {eventRESTful} from '@/api/index'
    import {Message} from 'element-ui'
    import {getCookie} from '@/common/auth';
    import {isLoginIn} from '@/api/login'
    import {mapGetters} from 'vuex'
    export default {
        name: "ExceptEvent",
        data(){
            return{
                dateValue:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()],
                dateOpt: {
                    disabledDate:(time)=>{
                        return time.getTime() > Date.now();
                    }
                },
                toolTipClass: 'page-login-toolTipClass',
                states:[{value: 0,label: '全部'},{value: 1,label: '未处理'}, {value: 2,label: '已处理'}, {value: 3,label: '已结案'}],
                curState:'',
                value:0,
                serachVale:'',
                serachData:'',
                tableDataList:[
                    {
                        label:'待处理事件',
                        eventCount:0,
                        tableData:[],
                        total:0,
                        sizeNum:10,
                        page:1
                    },
                    {
                        label:'我创建事件',
                        eventCount:0,
                        tableData:[],
                        total:0,
                        sizeNum:10,
                        page:1
                    },
                    {
                        label:'全部事件',
                        eventCount:0,
                        tableData:[],
                        total:0,
                        sizeNum:10,
                        page:1
                    }
                ],
                activeName:'0',
                videoSrc:require('../../../static/img/监控icon.png'),
                inspectSrc:require('../../../static/img/远程icon.png'),
                insiteInspectSrc:require('../../../static/img/现场icon.png'),
                tableInfoData:[
                    {
                        "prop":"storeName",
                        "label":"所属门店",
                        "sortable":'custom',
                        "width":160
                    },
                    {
                        "prop":"assignerName",
                        "label":"提报人",
                        "sortable":'custom',
                        "width":120
                    },
                    {
                        "prop":"ts",
                        "label":"提报时间",
                        "sortable":'custom',
                        "width":140
                    }
                ],
                event,
                total:0,
                page:1,
                sizeNum:10,
                params:{},
                fileName:'数据详情'+'.xlsx',
                exportDataList:[],  //需要导出的数据
                exportDataHeader:['事件名称','所属门店','提报人','提报时间'], //需要导出数据的表头
                windowHeight:window.innerHeight,
                userId:'',
                poperClass:'date-picker-poper',
                selectpoperClass:'select-poper',
                defaultTime:[],
            }

        },
        computed:{
            tableHieght(){
                if(this.windowHeight>800){
                    return this.windowHeight*0.63;
                }
                else if(this.windowHeight>700){
                    return this.windowHeight*0.58;
                }
                else{
                    return this.windowHeight*0.52;
                }
            },
            ...mapGetters({accountChanged:'accountChanged'})
        },
        watch:{
            accountChanged(val,oldVal){
                console.log(val);
                let self=this;
                if(val!=0){
                    self.searchEventList(false);
                }
            }
        },
        methods:{
            dateChange(val){
                let self=this;
                console.log(val);
                let tabIndex=Number(self.activeName);
                let start=typeof(val[0])==='object'?val[0].getTime():val[0];
                let end=typeof(val[1])==='object'?val[1].getTime():val[1];
               

                if((end-start)/(3600*24*30*1000)>1){  //当前选择的时间范围超过了30天
                    Message({
                        message:'当前选择时间范围最大为一个月，已调整！',
                        type:'warning',
                        duration:3*1000
                    })
                    // self.$refs.datePicker.pickerVisible=true;
                    // return false;
                    start=end-3600*24*30*1000;
                    self.dateValue=[new Date().setTime(start),new Date().setTime(end)];
                }
                self.serachData='';
                self.tableDataList[tabIndex].page=1;
                self.params.like={};
                self.params.beginTs=start;
                self.params.endTs=end;
                //self.params.filter={page:0,size:self.tableDataList[tabIndex].sizeNum};
                self.params.filter={page:self.tableDataList[tabIndex].page-1,size:self.tableDataList[tabIndex].sizeNum};
                let selectValue=self.value;
                let status=[];
                self.getEventList(self.params);
                switch(selectValue){
                    case 0:status=[0,1,2];break;
                    default:status=selectValue-1;break;
                }
                self.getEventCount(start,end,status);
            },
            handleClick(val){
                let self=this;
                console.log(val.index);
                let selectValue=self.value;
                let tabIndex=Number(val.index);
                //self.page=1;
                switch(tabIndex){
                    case 0:
                    if(selectValue==0||selectValue==1){
                        self.params.clause={"status":0,"assignee":self.userId};
                    }
                    else{
                        self.params.clause={"status":-1,"assignee":self.userId};
                    }
                    break;
                    case 1: 
                    if(selectValue==0){
                        self.params.clause={"status":[0,1,2],"assigner":self.userId};
                    }
                    else{
                        self.params.clause={"status":selectValue-1,"assigner":self.userId};
                    }
                    break;
                    case 2:
                    if(selectValue==0){
                        self.params.clause={"status":[0,1,2]};
                    }
                    else{
                        self.params.clause={"status":selectValue-1};
                    }
                    break;
                }
                if(self.serachData!=undefined&&self.serachData.length!=0){
                    self.params.like={subject:this.serachData,assignerName:this.serachData,storeName:this.serachData};
                }
                else{
                    self.params.like={};
                }
                let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
                let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
                self.params.beginTs=start;
                self.params.endTs=end;
                //self.params.filter={page:self.page-1,size:self.tableDataList[tabIndex].sizeNum};
                self.params.filter={page:self.tableDataList[tabIndex].page-1,size:self.tableDataList[tabIndex].sizeNum};
                this.getEventList(this.params);
            },
            //点击状态搜索时，总共需要时间范围，状态
            selectChange(val){
                console.log(val);
                let self=this;
                let tabIndex=Number(self.activeName);
                switch(val){
                    case 0:
                        if(tabIndex==0){
                            self.params.clause={
                                status:0,
                                assignee:self.userId
                            };
                        }
                        else if(tabIndex==1){
                            self.params.clause={
                                status:[0,1,2],
                                assigner:self.userId
                            };
                        }
                        else{
                            self.params.clause={
                                status:[0,1,2]
                            };
                        }
                    break;
                    case 1:
                        if(tabIndex==0){
                            self.params.clause={
                                status:0,
                                assignee:self.userId
                            };
                        }
                        else if(tabIndex==1){
                            self.params.clause={
                                status:0,
                                assigner:self.userId
                            };
                        }
                        else{
                            self.params.clause={
                                status:0
                            };
                        }
                    break;
                    default:
                    if(tabIndex==0){
                        self.params.clause={
                            status:-1,  //表示选择其他状态时为空。
                            assignee:self.userId
                        }
                    }
                    else if(tabIndex==1){
                        self.params.clause={
                            status:val-1,
                            assigner:self.userId
                        }
                    }
                    else{
                        self.params.clause={
                            status:val-1
                        }
                    }
                    break;
                }

                self.serachData='';
                //self.page=1;
                self.tableDataList[tabIndex].page=1;
                self.params.like={};

                let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
                let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
                self.params.beginTs=start;
                self.params.endTs=end;
                //self.params.filter={page:0,size:self.tableDataList[tabIndex].sizeNum};
                self.params.filter={page:self.tableDataList[tabIndex].page-1,size:self.tableDataList[tabIndex].sizeNum};
                self.getEventList(self.params);
                let status=[];
                if(val==0){
                    status=[0,1,2];
                }
                else{
                    status=val-1;
                }
                
                self.getEventCount(start,end,status);
            },
            searchEventList(flag){
                let self=this;
                let tabIndex=Number(self.activeName);
                let val=self.value;
                self.tableDataList[tabIndex].page=1;
                self.serachData=self.serachVale.trim();
                switch(val){
                    case 0:
                        if(tabIndex==0){
                            self.params.clause={
                                status:0,
                                assignee:self.userId
                            }
                        }
                        else if(tabIndex==1){
                            self.params.clause={
                                status:[0,1,2],
                                assigner:self.userId
                            }
                        }
                        else{
                            self.params.clause={
                                status:[0,1,2]
                            }
                        }
                    break;
                    case 1:
                        if(tabIndex==0){
                            self.params.clause={
                                status:0,
                                assignee:self.userId
                            }
                        }
                        else if(tabIndex==1){
                            self.params.clause={
                                status:0,
                                assigner:self.userId
                            }
                        }
                        else{
                            self.params.clause={
                                status:0
                            }
                        }
                    break;
                    default:
                        if(tabIndex==0){
                            self.params.clause={
                                status:-1,
                                assignee:self.userId
                            }
                        }
                        else if(tabIndex==1){
                            self.params.clause={
                                status:val-1,
                                assigner:self.userId
                            };
                        }
                        else{
                            self.params.clause={
                                status:val-1
                            };
                        }
                    break;
                }
                if(self.serachData!=undefined&&self.serachData.length!=0){
                    if(flag){
                        self.params.like={subject:this.serachData,assignerName:this.serachData,storeName:this.serachData};
                    }
                    else{
                        self.params.like={};
                    }
                }
                else{
                    self.params.like={};
                }
                //self.params.filter={page:0,size:self.tableDataList[tabIndex].sizeNum};
                self.params.filter={page:self.tableDataList[tabIndex].page-1,size:self.tableDataList[tabIndex].sizeNum};
                self.getEventList(self.params);
                
                let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
                let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
                let status=[];
                let selectValue=self.value;
                switch(selectValue){
                    case 0:status=[0,1,2];break;
                    default:status=selectValue-1;break;
                }
                let like=self.params.like;
                self.getEventCount(start,end,status,like);
            },
            rowClickItem(row,column,event){
                let self=this;
                this.event=row;
                sessionStorage.setItem('event',JSON.stringify(this.event));
                sessionStorage.setItem('queryparams',JSON.stringify(self.params));
                this.$router.push({name:"事件详情",params:{event:this.event}});
            },
            toEventDetail(row){
                console.log(row);
                let self=this;
                this.event=row;
                sessionStorage.setItem('event',JSON.stringify(this.event));
                sessionStorage.setItem('queryparams',JSON.stringify(self.params));
                this.$router.push({name:"事件详情",params:{event:this.event}});
            },
            sortChange(col){
                console.log(col);
                let self=this;
                let tabIndex=Number(self.activeName);
                //self.page=1;   //页码置为1
                self.tableDataList[tabIndex].page=1;
                let column=col.column;
                let order=col.order;
                if(order=="ascending"){
                    self.params.order={
                        "direction":"asc",
                        "property":col.column.property
                    }
                }
                else if(order=="descending"){
                    self.params.order={
                        "direction":"desc",
                        "property": col.column.property
                    }
                }
                else{
                    self.params.order={};
                }
                self.params.filter={
                    page:self.tableDataList[tabIndex].page-1,
                    size:self.tableDataList[tabIndex].sizeNum
                }
                self.getEventList(self.params);
            },
            getUserId(){
                let self=this;
                self.userId=getCookie('UserId');
                let start=new Date().getTime()-1000*3600*24;
                let end=new Date().getTime();
                let status=[0,1,2];
                self.getEventCount(start,end,status);  //初始加载
            },
            async getEventList(params){
                let self=this;
                let tabIndex=Number(self.activeName);
                if(params.hasOwnProperty('clause')&&typeof(params.clause.status)=='object'){  //传入的是一个数组类型
                    if(tabIndex==2){
                        for(var key in params){
                            if(key=='clause'){
                                delete params["clause"]
                            }
                        }
                    }
                    if(tabIndex==1){
                        params.clause={
                            assigner:self.userId
                        }
                    }
                }
                
                eventRESTful.getEventList(params).then((res)=>{
                    let data=res.data.content;
                    let temp=[];
                    data.forEach(item=>{
                        let obj={
                            id:item.id,
                            ts:util.getDateTime(item.ts),
                            assignee:item.assignee,
                            assignerName:item.assignerName,
                            assigneeName:item.assigneeName,
                            deviceId:item.deviceId,
                            status:item.status,
                            storeId:item.storeId,
                            storeName:item.storeName,
                            subject:item.subject,
                            score:item.score,
                            sourceType:item.sourceType,
                            initialComment:item.initialComment
                        }
                       temp.push(obj);
                    })
                    self.tableDataList[tabIndex].tableData=temp;
                    self.tableDataList[tabIndex].total=res.data.totalElements;
                }).catch(err=>{
                    console.log("Error:"+err);
                });
            },
            sizeChange(val){
                let self=this;
                let tabIndex=Number(self.activeName);
                self.tableDataList[tabIndex].sizeNum=val;
                //self.page=1;
                self.tableDataList[tabIndex].page=1;
                self.params.filter={page:self.tableDataList[tabIndex].page-1,size:val};
                self.getEventList(self.params);
            },
            currentChange(val){
                let self=this;
                let tabIndex=Number(self.activeName);
                self.tableDataList[tabIndex].page=val;
                self.params.filter={page:val-1,size:self.tableDataList[tabIndex].sizeNum};
                this.getEventList(this.params);
            },
            getInitList(){
                let self=this;
                let start=new Date().getTime()-1000*3600*24;
                let end=new Date().getTime();
                self.params.beginTs=start;
                self.params.endTs=end;
                self.params.clause={"status":0,"assignee":self.userId};
                self.params.order={"direction": "desc","property": "ts"};
                self.getEventList(self.params);
            },
            getEventCount(start,end,status,...value){
                console.log(value);
                let self=this;
                let params={
                    beginTs:start,
                    endTs:end,
                    "cases": [
                        1,
                        2,
                        3
                    ],
                    "clause":{
                        "status":status
                    },
                    
                };
                if(typeof(status)=='number'){  //只有是数值类型时才带
                    params.clause.status=status;
                }
                else{
                    for(var key in params){
                        console.log(key)
                        if(key=='clause'){
                            delete params["clause"];
                        }
                    }
                }
                if(value.length!=0){
                    params.like=value[0];
                }
                eventRESTful.getEventCount(params).then(res=>{
                    let data=res.data;
                    let errMsg=res.errMsg;
                    console.log(errMsg);
                    self.tableDataList[0].eventCount=data.assigned;
                    self.tableDataList[1].eventCount=data.reported;
                    self.tableDataList[2].eventCount=data.total;
                })
            },
            getExportDataSize(){
                let self=this;
                let params=self.params;
                params.filter={};
                return new Promise((resolve,reject)=>{
                    eventRESTful.getEventList(params).then((res)=>{
                        console.log(res);
                        let size=res.data.totalElements;
                        resolve(size);
                    }) 
                    .catch((error) => {
                        reject(error);
                    })
                })
                
            },
            async getExportData(){
                let self=this;
                let size=await self.getExportDataSize();
                self.params.filter={
                    "page": 0,
                    "size": size
                };
                return new Promise((resolve,reject)=>{
                    eventRESTful.getEventList(self.params).then((res)=>{
                        console.log(res);
                        let data=res.data.content;
                        let temp=[];
                        data.forEach(item=>{
                            let obj={};
                            obj.subject=item.subject;
                            obj.storeName=item.storeName;
                            obj.assignerName=item.assignerName;
                            obj.ts=util.getDateTime(item.ts);
                            temp.push(obj);
                        })
                        resolve(temp);
                    }).catch(err=>{
                        console.log("Error:"+err);
                    });
                })
            },
            getExportFileName(){
                let self=this;
                let tabIndex=Number(self.activeName);
                console.log(tabIndex);
                let label='';
                switch(tabIndex){
                    case 0: label='待处理';break;
                    case 1: label='我创建';break;
                    case 2: label='全部';break;
                    default: console.error('error tab pages！');break;
                }
                let fileName=label+'-'+util.getCurDateStr();
                return fileName;
            },
            async export2Excel() {
                var that = this;
                let ret=await that.isLoginIn();
                if(ret.data!=undefined&&ret.data.isLogin){
                    let tabIndex=Number(that.activeName);
                    if(that.tableDataList[tabIndex].tableData.length==0){
                        Message({
                            message:'暂无数据！',
                            type:'warning',
                            duration:3*1000
                        })
                        return false;
                    }
                    require.ensure([], async() => {
                        const { export_json_to_excel } = require('@/excel/Export2Excel'); 
                        const tHeader = that.exportDataHeader; // 导出的表头名
                        const filterVal = ['subject','storeName','assignerName','ts',]; // 导出的表头字段名
                        console.log(that.activeName);
                        let curData=await that.getExportData();
                        const data = that.formatJson(filterVal, curData);
                        
                        export_json_to_excel(tHeader, data, that.getExportFileName());// 导出的表格名称，根据需要自己命名
                    })
                }
                else{
                    window.location.href='https://portals.storeviu.com';
                }
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
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
            isLoginIn(){
                let self=this;
                return new Promise((resolve,reject)=>{
                    isLoginIn().then(res=>{
                        console.log(res);
                        resolve(res);
                    })
                }).catch(err=>{
                    console.log(err);
                })
            },
        },
        async mounted(){
            let self=this;
            self.getDeafultTime();
            await self.isLoginIn();
            let windowHeight=window.innerHeight;
            if(windowHeight>800){
                self.tableHeight=770+'px';
            }
            console.log(self.tableHeight);
            self.getUserId();
            self.getInitList();
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(from.name=='提交事件'){
                    to.meta.keepAlive=false;
                }
            });
        },
        beforeDestroy(){
        },
        activated(){
            let self=this;
            self.getEventList(self.params);
        }
    }
</script>

<style lang="scss" scoped>
@import '../../assets/css/textstyle.css';
@import '../../assets/css/importfile.css'; 
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
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
.el-event-content{
    width: 100%;
    position: relative;
    overflow: hidden;
    .sourceType-icon{
        margin-right: 15px;
        position: relative;
        float: left;
        @include point(bottom,3);
    }
    .icon-span{
        display:inline-block;
        width:60px;
        height:22px;
        color:white;
        font-size: 12px;
    }
    .el-date{
        height: 70px;
        line-height: 70px;
        text-align: left;
        border-bottom: 1px solid #e3e9f4;
        position: relative;
        .date-title{
            @include point(margin-left,30);
            @include point(margin-right,20);
            font-size: 14px;
            color: $black;
        }
        .iconbangzhu{
           margin-left:10px;
           font-size:20px;
           position:relative;
           top:2px;
           color:$black;
        }
        .date-range{
            width:320px;
        }
        .el-search{
            position:absolute;
            right: 0px;
            @include point(margin-right,20);
            @include point(width,160);
        }
    }
    .dialog-footer{
        @include point(margin-top,20);
        .file-content-btn{
            position: relative;
            left: 60%;
        }
    }
    .el-table-content{
        width: 100%;
        float: left;
        background-color: #fff;
        position: relative;
        @include point(padding-top,20);
        .export-btn{
            position: absolute;
            @include point(right,20);
            background-color: $red;
            border-color: $red;
            z-index: 990;
        }
        .table-content{
            width:96%;
            @include point(margin-left,15);
            @include point(margin-right,15);
            text-align: center;
            height:300px;
            float:left;
            border-top: 0;
            border-left: 0;
            border-right: 0;
        }
    }
    
}
.el-select-content{
    @include point(width,120);
}
.empty-data-icon{
    @include point(font-size,22);
    color: #53c247;
}
</style>
<style>
 @import '../../assets/css/pagination.css';
    .el-table::before{
        height: 0px !important;
    }
    .el-search .el-input__inner{
        background: #f0f5f8 !important;
        border-radius: 15px !important;
    }
    .page-login-toolTipClass.el-tooltip__popper.is-light{
        background: #FEE4E7 !important;
        color: #f31d65 !important;
        border: 1px solid #f31d65 !important;
    }
    #tabs-content .el-tabs__nav-scroll{
        margin-left:40px;
    }
    #tabs-content .el-tabs__header{
        margin-bottom:0px !important;
    }
    .el-tabs__active-bar{
        height: 4px !important;
        background-color: #f31d65 !important;
    }
    .date-picker-poper .el-button--text{
        visibility: hidden !important;
    }
     .select-poper .el-select-dropdown__item.hover{
        background-color:#FEE4E7;
    }
    .current-row > td {
        background: #FEE7E4 !important;
    }
    .el-table tbody tr:hover>td {
        background-color: #FDE8EF !important;
    }
    .el-table--border th{
        border-right: 0 !important;
    }
    .el-table--border, .el-table--group{
        border: none !important;
    }
    .el-table__header-wrapper th:nth-last-of-type(2){
        border-right: none !important;
    }
    .el-table--border td:nth-last-of-type(1){
        border-right: none !important;
    }
    .el-table--border::after, .el-table--group::after{
        width: 0 !important;
    }
</style>

