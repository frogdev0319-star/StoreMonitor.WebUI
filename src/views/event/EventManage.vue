<template>
    <div class="el-event-content">
       <div class="el-date">
            <span class="date-title noraml-text">起始时间</span>
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
            <span class="date-title noraml-text" style="margin-left:30px;margin-right:20px;">截止时间</span>
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
            <span class="date-title noraml-text" style="margin-left:30px;margin-right:20px;">处理状态</span>
            <el-select v-model="value" placeholder="请选择" class="el-select-content" size="small" @change="selectChange">
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
                v-model="serachVale" @keyup.enter.native="searchEventList">
                <i @click="searchEventList" slot="prefix" class="iconfont icon-sousuo" style="margin-left:5px;font-size:18px;"></i>
            </el-input>
       </div>
       <el-dialog title="" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width=450px top=15%>
            <div class="fileNameContent" style="overflow:hidden;">
                <span>文件名称：</span>
                <el-input v-model="fileName" placeholder="请输入文件名称" style="width:300px;" size="mini"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button class="file-content-btn" @click="dialogFormVisible = false" size="mini" style="">取 消</el-button>
                    <el-button class="file-content-btn" type="primary" @click="exportCSV" size="mini">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <div class="el-table-content">
            <el-button type="primary" size="mini" class="export-btn" @click="exportData">
               <i style="margin-right:18px;font-size:16px;" class="iconfont icon-excel">
                </i>导出报表
            </el-button>
            <el-tabs v-model="activeName" @tab-click="handleClick" id="tabs-content">
                <el-tab-pane v-for="(item,index) in tableDataList" :key="index" :label="`${item.label} （${item.eventCount}）`">
                    <div class="el-table-panel">
                        <el-table 
                            :data="item.tableData" 
                            :highlight-current-row="true"
                            empty-text='没有异常数据'
                            align='left'
                            :height="windowHeight*(windowHeight>1000?0.68:0.55)"
                            @sort-change='sortChange'
                            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;">
                                <el-table-column
                                    width=""
                                    header-align="center"
                                    align="center">
                                        <template slot-scope="scope" >
                                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#FAD934;" v-if="scope.row.status=='0'" >待处理</span>
                                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:orange;" v-else-if="scope.row.rank=='1'" >已处理</span>
                                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#fd446d;" v-else>已结案</span>       
                                    </template>
                                </el-table-column>
                            <el-table-column v-for="(item,index) in tableInfoData" :key="index"
                                :prop="item.prop" :label="item.label" :sortable="item.sortable" :width="item.width">
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
                                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">无异常数据</span>
                                </div> 
                            </div>
                        </el-table>
                        <div class="toolbar pagination" style="width:100%; margin:10 15px;height:12%;margin-bottom:0px;">
                            <el-pagination background small 
                                :page-sizes="[10, 20, 50, 100]"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                            layout="jumper,total, prev, pager, next,sizes"  
                            :page-size="item.sizeNum" :total="item.total" style="float:right;margin-top:10px;">
                            </el-pagination>
                        </div>
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
                        return (time.getTime() > Date.now() - 8.64e6)||time.getTime()<date;
                    }
                },
                startDateOpt:{
                    disabledDate:(time)=>{
                        let date=this.endDate;
                        return (time.getTime() > Date.now() - 8.64e6)||time.getTime()>date.getTime();
                    }
                },
                toolTipClass: 'page-login-toolTipClass',
                states: [
                {
                    value: 1,
                    label: '全部'
                }, 
                {
                    value: 2,
                    label: '未处理',
                    disabled: true
                }, 
                {
                    value: 3,
                    label: '处理中'
                }, 
                {
                    value: 4,
                    label: '已处理'
                }],
                curState:'',
                value:1,
                serachVale:'',
                activeName:'',
                //0 表示未处理 1 表示处理中  2 已处理
                tableDataList:[
                    {
                        label:'待处理',
                        eventCount:10,
                        tableData:[
                            // {
                            //     'eventName':'001',
                            // }
                        ],
                    },
                    {
                        label:'我创建',
                        eventCount:30,
                        tableData:[
                            // {
                            //     'eventName':'001',
                            // }
                        ]
                    },
                    {
                        label:'全部事件',
                        eventCount:300,
                        tableData:[
                            // {
                            //     'eventName':'001',
                            // }
                        ]
                    }
                ],
                tableInfoData:[
                    {
                        "prop":"subject",
                        "label":"事件名称",
                        "sortable":false,
                         "width":180
                    },
                    {
                        "prop":"storeId",
                        "label":"所属门店",
                        "sortable":'custom',
                        "width":180
                    },
                    {
                        "prop":"assigner",
                        "label":"提报人",
                        "sortable":false
                    },
                    {
                        "prop":"ts",
                        "label":"提报时间",
                        "sortable":false
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
                exportDataHeader:['异常类型名称','设备名称','设备型号','发报时间'], //需要导出数据的表头
                timeid:0,
                windowHeight:window.innerHeight
            }

        },
        methods:{
            startDateChange(val){
                console.log(val);
                let self=this;
                self.params.beginTs=self.startDate.getTime();
                self.params.endTs=self.endDate.getTime();
                self.getEventList(self.params);
            },
            endDateChange(val){
                console.log(val);
                let self=this;
                self.params.beginTs=self.startDate.getTime();
                self.params.endTs=self.endDate.getTime();
                self.getEventList(self.params);

            },
            handleClick(val){

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
                    self.params.like={eventType:this.serachVale,deviceName:this.serachVale,
                    deviceType:this.serachVale,agentId:this.serachVale,description:this.serachVale};
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
                this.$router.push({name:"新增事件管理",params:{event:this.event}});
            },
            sortChange(col){
                console.log(col);
                let self=this;
                let column=col.column;
                let order=col.order;
                if(order=="ascending"){
                    self.params.order={
                        "direction":"asc",
                        "property": "deviceName"
                    }
                }
                else if(order=="descending"){
                     self.params.order={
                        "direction":"desc",
                        "property": "deviceName"
                    }
                }
                else{
                    self.params.order={};
                }
                self.getEventList(self.params);
            },
            getEventList(params){
                let self=this;
                params.filter={page:this.page,size:this.sizeNum};
                api.getEventList(params).then((res)=>{
                    console.log(res);
                    let data=res.data.data.content;
                    self.total=res.data.data.totalElements;
                    let temp=[];
                    data.forEach(item=>{
                        let obj={
                            id:item.id,
                            ts:util.getDateTime(item.ts),
                            assignee:item.assignee,
                            assigner:item.assigner,
                            deviceId:item.deviceId,
                            status:item.status,
                            storeId:item.storeId,
                            subject:item.subject
                        }
                       temp.push(obj);
                    })
                    self.tableDataList[0].tableData=temp;
                }).catch(err=>{
                    console.log("Error:"+err);
                });
            },
            sizeChange(val){
                this.sizeNum=val;
                this.getEventList(this.params);
            },
            currentChange(val){
                this.page=val-1;
                this.getEventList(this.params);
            },
            getInitList(){
                let self=this;
                let start=new Date().getTime()-1000*3600*24;
                let end=new Date().getTime();
                self.params.beginTs=start;
                self.params.endTs=end;
                self.getEventList(self.params);
            },
            exportData(){
                if(this.tableData.length==0){
                    return false;
                }
                this.dialogFormVisible=true;
                this.getExportData();
            },
            getExportDataSize(){
                let self=this;
                self.params.filter={};
                return new Promise((resolve,reject)=>{
                    api.getEventList(self.params).then((res)=>{
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
                api.getEventList(self.params).then((res)=>{
                    console.log(res);
                    let data=res.data.content;
                    let temp=[];
                    data.forEach(item=>{
                        let obj={};
                        obj.eventType=item.eventType;
                        obj.deviceName=item.deviceName;
                        obj.deviceType=item.deviceType;
                        //obj.group=item.group;
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
            this.getInitList();
            let windowHeight=window.innerHeight;
            if(windowHeight>800){
                this.tableHeight=770+'px';
            }
            console.log(this.tableHeight);
            if(!this.timeid){
                this.timeid=window.setInterval(this.getEventList(this.params),60*1000);
            }
        },
        beforeDestroy(){
           window.clearInterval(this.timeid);
        },
        activated(){
            this.getEventList(this.params);
        }
    }
</script>

<style lang="scss" scoped>
@import '../../assets/css/textstyle.css';
.el-event-content{
    width: 100%;
    position: relative;
    .el-date{
        height: 80px;
        line-height: 80px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        position: relative;
        .date-title{
            margin-left: 30px;
            margin-right:20px;
        }
        .date-picker{
            width:160px;
        }
        .el-search{
            position:absolute;
            right: 0px;
            margin-right: 20px;
            width: 160px;
        }
    }
    .dialog-footer{
        margin-top: 20px;
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
        padding-top: 20px;
        .export-btn{
            position: absolute;
            right: 0px;
            margin-right: 10px;
            background-color: #FB505F;
            border-color: #FB505F;
            border-radius: 0px;
        }
    }
    
}
.el-select-content{
    width: 120px;
}
.empty-data-icon{
    font-size: 22px;
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
    .el-input--small >>>.el-input__inner{
        background: #f0f5f8 !important;
        border-radius: 15px !important;
    }
</style>
<style>
    .el-tooltip__popper.is-light{
        background: #FEE4E7 !important;
        color: #FB505F !important;
        border: 1px solid #FB505F !important;
    }
    #tabs-content .el-tabs__nav-scroll{
        margin-left:40px;
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
</style>

