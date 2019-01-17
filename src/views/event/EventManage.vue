<template>
    <div class="el-event-content">
       <div class="el-date">
            <span class="date-title">起始时间</span>
            <el-date-picker
                class="date-picker"
                v-model="startDate"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00"
                size="mini"
                format="yyyy/MM/dd HH:mm"
                :editable=false
                :clearable=false
                :picker-options='startDateOpt'
                @change="startDateChange">
            </el-date-picker>
            <span class="date-title" style="margin-left:30px;margin-right:20px;">截止时间</span>
            <el-date-picker
                class="date-picker"
                v-model="endDate"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00"
                size="mini"
                format="yyyy/MM/dd HH:mm"
                :editable=false
                :clearable=false
                :picker-options='endDateOpt'
                @change="endDateChange">
            </el-date-picker>
            <el-tooltip :popper-class="toolTipClass" class="item" effect="light"
                placement="bottom-end">
                <div slot="content">*最长搜索时间为一个月</div>
                <i class="iconfont icon-bangzhu" style="margin-left:10px;font-size:20px;position:relative;top:2px;color:#FB505F"></i>
            </el-tooltip>
            <span class="date-title" 
            style="margin-left:30px;margin-right:20px;" v-if="activeName!='0'">处理状态</span>
            <el-select v-model="value" placeholder="请选择" 
            class="el-select-content" size="small" @change="selectChange" v-if="activeName!='0'">
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
                v-model="serachVale" @keyup.enter.native="searchEventList">
                <i @click="searchEventList" slot="prefix" class="iconfont icon-sousuo" style="margin-left:5px;font-size:18px;"></i>
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
            <el-button type="primary" size="mini" class="export-btn" @click="exportData">
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
                            empty-text='没有异常数据'
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
   // import {getUserInfo,isLoginIn} from '@/api/login'
    export default {
        name: "ExceptEvent",
        data(){
            return{
                startDate:new Date().setTime(new Date().getTime()-3600 * 1000 * 24),
                endDate:new Date(),
                // defaultTime:new Date().getHours()+':'+new Date().getMinutes(),
                endDateOpt: {
                    disabledDate:(time)=>{
                        console.log(time);
                        let date=this.startDate;
                        console.log(date);
                        return (time.getTime() > Date.now())||time.getTime()<date.getTime();
                    }
                },
                startDateOpt:{
                    disabledDate:(time)=>{
                        let date=this.endDate;
                        return (time.getTime() < date.getTime() -31*8.64e7)||time.getTime()>date.getTime();
                    }
                },
                toolTipClass: 'page-login-toolTipClass',
                states: [
                {
                    value: 1,
                    label: '全部'
                }],
                curState:'',
                value:1,
                serachVale:'',
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
                page:0,
                sizeNum:10,
                params:{},
                fileName:'数据详情'+'.csv',
                dialogFormVisible:false,
                exportDataList:[],  //需要导出的数据
                exportDataHeader:['事件名称','所属门店','提报人','提报时间'], //需要导出数据的表头
                timeid:0,
                windowHeight:window.innerHeight,
                userId:''
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
            startDateChange(val){
                console.log(val);
                let self=this;
                self.params.beginTs=self.startDate.getTime();
                self.params.endTs=self.endDate.getTime();
                self.getEventList(self.params);
                let start=self.startDate.getTime();
                let end=self.endDate.getTime();
                self.getEventCount(start,end);  //切换初试时间
                
            },
            endDateChange(val){
                console.log(val);
                let self=this;
                self.params.beginTs=self.startDate.getTime();
                self.params.endTs=self.endDate.getTime();
                self.getEventList(self.params);
                let start=self.startDate.getTime();
                let end=self.endDate.getTime();
                self.getEventCount(start,end);  //切换结束时间
            },
            handleClick(val){
                let self=this;
                console.log(val.index);
                switch(Number(val.index)){
                    case 0: self.states=[{value: 1,label: '全部'}];  
                            self.params.clause={"status":0,"assignee":self.userId};break;
                    case 1: self.states=[{value: 1,label: '全部'},{value: 2,label: '未处理'}, 
                                        {value: 3,label: '已处理'}, {value: 4,label: '已结案'}];
                            self.params.clause={"assigner":self.userId};break;
                    case 2:self.states=[{value: 1,label: '全部'},{value: 2,label: '未处理'}, 
                                        {value: 3,label: '已处理'}, {value: 4,label: '已结案'}];
                            self.params.clause={}; break;
                }
                this.getEventList(this.params);
            },
            selectChange(val){
                console.log(val);
                let self=this;
                switch(val){
                    case 1: self.params.clause={};break; //全部状态
                    case 2: self.params.clause={
                        "status":0
                    };
                    break;  //未处理状态
                    case 3: self.params.clause={
                        "status":1
                    };
                    break;
                    case 4:self.params.clause={
                        "status":2
                    };
                    break;
                }
                self.getEventList(self.params);
            },
            searchEventList(){
                let self=this;
                if(self.serachVale!=undefined&&self.serachVale.length!=0){
                    self.params.like={subject:this.serachVale,assignerName:this.serachVale,storeName:this.serachVale};
                }
                else{
                    self.params.like={};
                }
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
            getEventList(params){
                let self=this;
                let tabIndx=Number(self.activeName);
                console.log(self.activeName);
                params.filter={page:this.tableDataList[tabIndx].page,size:this.tableDataList[tabIndx].sizeNum};
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
                            subject:item.subject
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
                self.getEventList(this.params);
            },
            currentChange(val){
                let self=this;
                let tabIndx=Number(self.activeName);
                this.tableDataList[tabIndx].page=val-1;
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
                self.params.filter={};
                return new Promise((resolve,reject)=>{
                    eventRESTful.getEventList(self.params).then((res)=>{
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
                    self.exportDataList=temp;
                }).catch(err=>{
                    console.log("Error:"+err);
                });
            },
            exportCSV(){
                if(this.fileName==null||this.fileName.length==0){
                    return false;
                }
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
            if(!self.timeid){
                self.timeid=window.setInterval(self.getEventList(self.params),60*1000);
            }
        },
        beforeDestroy(){
           window.clearInterval(self.timeid);
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
        .date-picker{
            @include point(width,180);
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
    .el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color:#FB505F !important;
        color:#fff !important;
    }
</style>

