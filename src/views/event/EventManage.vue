<template>
    <div class="el-event-content">
       <div class="el-date">
            <span class="date-title">时间</span>
            <el-date-picker
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
                @change="dateChange">
            </el-date-picker>
            <el-tooltip :popper-class="toolTipClass" class="item" effect="light"
                placement="bottom-end">
                <div slot="content">*最长搜索时间为一个月</div>
                <i class="iconfont icon-bangzhu" style="margin-left:10px;font-size:20px;position:relative;top:2px;color:#FB505F"></i>
            </el-tooltip>
            <span class="date-title" 
            style="margin-left:30px;margin-right:20px;">处理状态</span>
            <el-select v-model="value" placeholder="请选择" 
            class="el-select-content" size="small" @change="selectChange">
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
                v-model="serachVale" @clear="searchEventList" @keyup.enter.native="searchEventList">
                <i slot="prefix" class="iconfont icon-sousuo" style="margin-left:5px;font-size:18px;"></i>
            </el-input>
       </div>
       <el-dialog title="导出" :visible.sync="dialogFormVisible" :close-on-click-modal="false" v-if="dialogFormVisible" width=450px top=15%>
            <div class="dialog-content" style="overflow:hidden;">
                <hr style="border: 0.5px solid #FFC1C8;"/>
                <div class="tabName-input-content">
                    <el-input type="text" size="small" v-model="fileName" class="tabName-input" placeholder="请输入文件名称">
                    </el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="dialogFormVisible = false" size="mini" style="">取 消</el-button>
                <el-button class="file-confirm-btn" type="primary" @click="exportCSV" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <div class="el-table-content">
            <el-button type="primary" size="mini" class="export-btn" @click="exportCSV">
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
                            :height="tableHieght"
                            @sort-change='sortChange'
                            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;">
                                <el-table-column
                                    width=""
                                    header-align="center"
                                    align="center">
                                        <template slot-scope="scope" >
                                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#FDBA40;" v-if="scope.row.status==0" >待处理</span>
                                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#434C5E;" v-else-if="scope.row.status==1" >已处理</span>
                                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#6097F3;" v-else>已结案</span>       
                                    </template>
                                </el-table-column>
                            <el-table-column v-for="(_item,_index) in tableInfoData" :key="_index"
                                :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :width="_item.width">
                            </el-table-column>
                            <el-table-column
                                prop="option"
                                label="操作"
                                width="80"
                                align="left">
                                <template slot-scope="scope">
                                    <i class="iconfont icon-gengduo" style="font-size:20px;cursor: pointer;" @click="toEventDetail(scope.row)"></i>
                                </template>
                            </el-table-column>
                            <div slot="empty">
                                <div>
                                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">无事件数据</span>
                                </div> 
                            </div>
                        </el-table>
                    </div>
                    <div class="toolbar pagination" style="width:100%; margin:10px 15px;height:13%;margin-bottom:0px;">
                        <el-pagination background small 
                            :page-sizes="[10, 20, 50, 100]"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="page"
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
    export default {
        name: "ExceptEvent",
        data(){
            return{
                dateValue:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()],
                dateOpt: {
                    disabledDate:(time)=>{
                        //const lastMonthTime = new Date().setMonth(new Date().getMonth() - 1)
                        return time.getTime() > Date.now();
                    }
                },
                toolTipClass: 'page-login-toolTipClass',
                states:[{value: 0,label: '全部'},{value: 1,label: '待处理'}, 
                        {value: 2,label: '已处理'}, {value: 3,label: '已结案'}],
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
                        page:0
                    },
                    {
                        label:'我创建事件',
                        eventCount:0,
                        tableData:[],
                        total:0,
                        sizeNum:10,
                        page:0
                    },
                    {
                        label:'全部事件',
                        eventCount:0,
                        tableData:[],
                        total:0,
                        sizeNum:10,
                        page:0
                    }
                ],
                activeName:'0',
                tableInfoData:[
                    {
                        "prop":"subject",
                        "label":"事件名称",
                        "sortable":'custom',
                        "width":180
                    },
                    {
                        "prop":"storeName",
                        "label":"所属门店",
                        "sortable":'custom',
                        "width":180
                    },
                    {
                        "prop":"assignerName",
                        "label":"提报人",
                        "sortable":'custom',
                    },
                    {
                        "prop":"ts",
                        "label":"提报时间",
                        "sortable":'custom',
                    }
                ],
                event,
                total:0,
                page:1,
                sizeNum:10,
                params:{},
                fileName:'数据详情'+'.csv',
                dialogFormVisible:false,
                exportDataList:[],  //需要导出的数据
                exportDataHeader:['事件名称','所属门店','提报人','提报时间'], //需要导出数据的表头
                windowHeight:window.innerHeight,
                userId:'',
                poperClass:'date-picker-poper',
            }

        },
        computed:{
            tableHieght(){
                if(this.windowHeight>800){
                    return this.windowHeight*0.62;
                }
                else if(this.windowHeight>700){
                    return this.windowHeight*0.58;
                }
                else{
                    return this.windowHeight*0.52;
                }
            }
        },
        methods:{
            dateChange(val){
                let self=this;
                console.log(val);
                let start=typeof(val[0])==='object'?val[0].getTime():val[0];
                let end=typeof(val[1]==='object')?val[1].getTime():val[1];
                if((end-start)/(3600*24*30*1000)>1){  //当前选择的时间范围超过了30天
                    Message({
                        message:'当前选择时间范围最大为一个月，已调整！',
                        type:'warning',
                        duration:3*1000
                    })
                    start=end-3600*24*30*1000;
                    self.dateValue=[new Date().setTime(start),new Date().setTime(end)];
                }
                self.serachData='';
                self.page=0;
                self.params.like={};
                self.params.beginTs=start;
                self.params.endTs=end;
                self.getEventList(self.params);
                self.getEventCount(start,end);
            },
            handleClick(val){
                let self=this;
                console.log(val.index);
                let selectValue=self.value;
                let tabIndx=Number(val.index);
                self.page=0;
                switch(tabIndx){
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
                let end=typeof(self.dateValue[1]==='object')?self.dateValue[1].getTime():self.dateValue[1];
                self.params.beginTs=start;
                self.params.endTs=end;
                self.params.filter={page:0,size:self.tableDataList[tabIndx].sizeNum};
                this.getEventList(this.params);
            },
            //点击状态搜索时，总共需要时间范围，状态
            selectChange(val){
                console.log(val);
                let self=this;
                let tabIndx=Number(self.activeName);
                switch(val){
                    case 0:
                        if(tabIndx==0){
                            self.params.clause.status=0;
                        }
                        else{
                            self.params.clause.status=[0,1,2];
                        }
                    break;
                    case 1:
                        self.params.clause.status=0;
                    break;
                    default:
                    if(tabIndx==0){
                        self.params.clause.status=-1;  //表示选择其他状态时为空。
                    }
                    else{
                        self.params.clause.status=val-1;break;
                    }
                }
                //self.serachVale='';
                //self.serachData='';
                self.page=0;
                self.params.like={};

                let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
                let end=typeof(self.dateValue[1]==='object')?self.dateValue[1].getTime():self.dateValue[1];
                self.params.beginTs=start;
                self.params.endTs=end;
                self.params.filter={page:0,size:self.tableDataList[tabIndx].sizeNum};
                self.getEventList(self.params);
            },
            searchEventList(){
                let self=this;
                let tabIndx=Number(self.activeName);
                let val=self.value;
                self.page=0;
                self.serachData=self.serachVale.trim();
                switch(val){
                    case 0:
                        if(tabIndx==0){
                            self.params.clause.status=0;
                        }
                        else{
                            self.params.clause.status=[0,1,2];
                        }
                    break;
                    case 1:
                        self.params.clause.status=0;
                    break;
                    default:
                    if(tabIndx==0){
                        self.params.clause.status=-1;  //表示选择其他状态时为空。
                    }
                    else{
                        self.params.clause.status=val-1;break;
                    }
                }
                
                if(self.serachData!=undefined&&self.serachData.length!=0){
                    self.params.like={subject:this.serachData,assignerName:this.serachData,storeName:this.serachData};
                }
                else{
                    self.params.like={};
                }
                self.params.filter={page:0,size:self.tableDataList[tabIndx].sizeNum};
                self.getEventList(self.params);
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
                self.getEventList(self.params);
            },
            getUserId(){
                let self=this;
                self.userId=sessionStorage.getItem('UserId');
                let start=new Date().getTime()-1000*3600*24;
                let end=new Date().getTime();
                self.getEventCount(start,end);  //初始加载
            },
            async getEventList(params){
                let self=this;
                let tabIndx=Number(self.activeName);
                eventRESTful.getEventList(params).then((res)=>{
                    console.log(res);
                    let data=res.data.content;
                    let temp=[];
                    data.forEach(item=>{
                        let obj={
                            id:item.id,
                            ts:util.getDateTime(item.ts),
                            assignee:item.assignee,
                            assignerName:item.assignerName,
                            deviceId:item.deviceId,
                            status:item.status,
                            storeId:item.storeId,
                            storeName:item.storeName,
                            subject:item.subject,
                            initialComment:item.initialComment
                        }
                       temp.push(obj);
                    })
                    self.tableDataList[tabIndx].tableData=temp;
                    self.tableDataList[tabIndx].total=res.data.totalElements;
                }).catch(err=>{
                    console.log("Error:"+err);
                });
            },
            sizeChange(val){
                let self=this;
                let tabIndx=Number(self.activeName);
                self.tableDataList[tabIndx].sizeNum=val;
                self.params.filter={page:self.page,size:val};
                self.getEventList(self.params);
            },
            currentChange(val){
                let self=this;
                let tabIndx=Number(self.activeName);
                this.page=val;
                self.params.filter={page:val-1,size:self.tableDataList[tabIndx].sizeNum};
                this.getEventList(this.params);
            },
            getInitList(){
                let self=this;
                let start=new Date().getTime()-1000*3600*24;
                let end=new Date().getTime();
                self.params.beginTs=start;
                self.params.endTs=end;
                self.params.clause={"status":0,"assignee":self.userId}
                self.getEventList(self.params);
            },
            exportData(){
                let self=this;
                let tabIndx=Number(self.activeName);
                if(self.tableDataList[tabIndx].tableData.length==0){
                    return false;
                }
                self.dialogFormVisible=true;
                self.getExportData();
            },
            getEventCount(start,end){
                let self=this;
                let params={
                    beginTs:start,
                    endTs:end,
                    "cases": [
                        1,
                        2,
                        3
                    ]
                };
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
            async exportCSV(){
                let self=this;
                let tabIndx=Number(self.activeName);
                if(self.tableDataList[tabIndx].tableData.length==0){
                    Message({
                        message:'暂无数据！',
                        type:'warning',
                        duration:3*1000
                    })
                    return false;
                }
                self.exportDataList=await self.getExportData();
                CsvExportor.downloadCsv(
                this.exportDataList, { header: this.exportDataHeader}, 
                this.fileName);
                this.dialogFormVisible=false;
            },
        },
        mounted(){
            let self=this;
            let windowHeight=window.innerHeight;
            if(windowHeight>800){
                self.tableHeight=770+'px';
            }
            console.log(self.tableHeight);
            self.getUserId();
            self.getInitList();
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
$red:#FB505F;
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
    .tabName-input-content{
        background: #fff;
        @include point(height,73);
        width: 100%;
    }
    .el-date{
        @include point(height,80);
        @include point(line-height,80);
        text-align: left;
        border-bottom: 1px solid #ddd;
        position: relative;
        .date-title{
            @include point(margin-left,30);
            @include point(margin-right,20);
            font-size: 14px;
            color: #424151;
        }
        .date-range{
            @include point(width,320);
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
        width: 97.46%;
        float: left;
        background-color: #fff;
        position: relative;
        @include point(padding-top,20);
        .export-btn{
            position: absolute;
            right: 0px;
            margin-right: 10px;
            background-color: $red;
            border-color: $red;
            border-radius: 0px;
            z-index: 990;
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
<style scoped>
    .page-login-toolTipClass{
        background-color: #2992FF !important;
        color: red;
    }
    .el-select >>> .el-input__inner{
        background: #f0f5f8 !important;
        border-radius: 0px;
        border: 0px;
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
    .el-tooltip__popper.is-light{
        background: #FEE4E7 !important;
        color: #FB505F !important;
        border: 1px solid #FB505F !important;
    }
    #tabs-content .el-tabs__nav-scroll{
        margin-left:40px;
    }
    #tabs-content .el-tabs__header{
        margin-bottom:0px !important;
    }
    .el-tabs__active-bar{
        height: 4px !important;
        background-color: #FB505F !important;
    }
    .el-tabs__item.is-active{
        font-weight: bold !important;
        color: #FB505F !important;
    }
    .el-tabs__item:hover{
        color: #FB505F !important;
    }
    .el-dialog__body{
        padding: 0px;
    }
    .tabName-input .el-input__inner{
        border-radius: 0px !important;
        border-left: 0px;
        border-top: 0px;
        border-right: 0px;
        border-bottom: 1px  solid #FB505F;
        font-size: 14px;
    }
    .date-picker-poper .el-button--text{
        visibility: hidden !important;
    }

    .date-range.el-range-editor.is-active,.date-range .el-range-editor.is-active:hover{
        border-color:#f0f5f8 !important;
    }
</style>

