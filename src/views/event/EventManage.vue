<template>
    <div class="el-event-content" :style="{'minHeight':windowHeight-118+'px'}">
       <div class="el-date">
            <span class="date-title">{{generateEventLang('time')}}</span>
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
            <!--<input type="text" id="dateinput" v-model="dateInputStr" readonly @focus="getNewestDate">-->
            <el-tooltip :popper-class="toolTipClass" class="item" effect="dark"
                placement="bottom-end">
                <div slot="content">*{{generateEventLang('timePlaceholder')}}</div>
                <i class="iconfont icon-bangzhu iconbangzhu"></i>
            </el-tooltip>
            <span class="date-title"
            style="margin-left:30px;margin-right:20px;">{{generateEventLang('status')}}</span>
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
            <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="export2Excel" >
              <div class="btn-area">
                <img :src="exportPng" class="icon-excel">
                <span class="spanClass">{{generateEventLang('exportReport')}}</span>
              </div>
            </el-button>
            <el-tabs v-model="activeName" @tab-click="handleClick" :id="lang=='en'? 'en-tabs-content': 'tabs-content'">
                <el-tab-pane v-for="(item,index) in tableDataList"
                :key="index" :label="`${item.label} （${item.eventCount}）`">
                    <div class="el-table-panel">
                        <el-table
                            :data="item.tableData"
                            :highlight-current-row="true"
                            empty-text='没有事件数据'
                            align='left'
                            stripe
                            :height="windowHeight-260"
                            @sort-change='sortChange'
                            @row-click='rowClickItem'
                            style=""
                            class="table-content"
                            :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
                            :cell-style="cellStyle"
                        >
                                <el-table-column
                                    min-width="80"
                                    header-align="center"
                                    align="center">
                                        <template slot-scope="scope" >
                                        <span class="icon-span" style="background-color:#FDBA40;" v-if="scope.row.status==0" >{{generateEventLang('pending')}}</span>
                                        <span class="icon-span" style="background-color:#434C5E;" v-else-if="scope.row.status==1" >{{generateEventLang('handled')}}</span>
                                        <span class="icon-span" style="background-color:#6097F3;" v-else>{{generateEventLang('closed')}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="subject"
                                    :label="generateEventLang('name')"
                                    min-width="220"
                                    sortable='custom'
                                    align="left"
                                    :class-name = "selfClassName"
                                >
                                  <template slot-scope="scope">
                                        <img class='sourceType-icon' v-if="scope.row.sourceType==0" :src='videoSrc'/>
                                        <img class='sourceType-icon' v-else-if="scope.row.sourceType==1" :src='inspectSrc'/>
                                        <img class='sourceType-icon' v-else :src='insiteInspectSrc'/>
                                        <span class="event-subject">{{scope.row.subject}}</span>
                                    </template>
                                </el-table-column>
                            <el-table-column v-for="(_item,_index) in tableInfoData" :key="_index"
                                :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="_item.width">
                            </el-table-column>
                            <el-table-column
                                prop="option"
                                :label= "generateEventLang('operation')"
                                min-width="80"
                                align="left">
                                <template slot-scope="scope">
                                    <i class="iconfont icon-gengduo" @click="toEventDetail(scope.row)"></i>
                                </template>
                            </el-table-column>
                            <div slot="empty">
                                <div>
                                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                                    <span :style="{'margin-left':'20px','font-size':'16px','color':'#7d8cad','font-family':'Microsoft YaHei'}">{{generateEventLang('noEvents')}}</span>
                                </div>
                            </div>
                        </el-table>
                    </div>
                    <div class="toolbar pagination clearfix" style="width:100%; margin:10px 15px 0px 0px;height:13%;">
                        <el-pagination background small
                            :page-sizes="[10, 20, 50, 100]"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="item.page"
                        layout="jumper,total, prev, pager, next,sizes"
                        :page-size="item.sizeNum" :total="item.total" style="float:right;margin-top:10px;margin-bottom:10px;margin-right: 10px;">
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
import {generateEventLang} from '@/api/i18n'
// require(['bootstrap-multiselect'], function(purchase){
//   $('#example-multiple-selected').multiselect();
// });
export default {
    name: "ExceptEvent",
    data(){
        return{
            dateValue:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()],
            dateInputStr:'',
            dateOpt: {
                disabledDate:(time)=>{
                    return time.getTime() > Date.now();
                }
            },
            toolTipClass: 'page-login-toolTipClass',
            states:[{value: 0,label: this.$t('eventView.all')},{value: 1,label: this.$t('eventView.pending')}, {value: 2,label: this.$t('eventView.handled')}, {value: 3,label: this.$t('eventView.closed')}],
            curState:'',
            value:0,
            serachVale:'',
            serachData:'',
            tableDataList:[
                {
                    label: this.$t('eventView.pendingEve'),
                    eventCount:0,
                    tableData:[],
                    total:0,
                    sizeNum:10,
                    page:1
                },
                {
                    label: this.$t('eventView.myEvent'),
                    eventCount:0,
                    tableData:[],
                    total:0,
                    sizeNum:10,
                    page:1
                },
                {
                    label: this.$t('eventView.allEvents'),
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
                    "prop": "storeName",
                    "label": this.$t('eventView.stores'),
                    "sortable":'custom',
                    "width":160
                },
                {
                    "prop":"assignerName",
                    "label": this.$t('eventView.submitter'),
                    "sortable":'custom',
                    "width":120
                },
                {
                    "prop":"ts",
                    "label": this.$t('eventView.submitTime'),
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
            exportDataHeader:[this.$t('eventView.name'),this.$t('eventView.stores'),this.$t('eventView.submitter'),this.$t('eventView.submitTime')], //需要导出数据的表头
            windowHeight:window.innerHeight,
            userId:'',
            poperClass:'date-picker-poper',
            selectpoperClass:'select-poper',
            defaultTime:[],
            lang: this.$i18n.locale,
            isFirstLoad: false, //是否首次加载
            order: '',
          ifChangeAccount: false,
          numberOfElements: 0,
          totalElements: 0,
          sortColumnOfTab: [{tabIndex: 0, sortType:{prop: '', order: ''} }, {tabIndex: 1, sortType:{prop: '', order: ''} }, {tabIndex: 2, sortType:{prop: '', order: ''} }],
          exportPng: require('../../../static/img/icon_excel.png'),
          selfClassName: 'self-class-name'
        }

    },
    computed:{
        tableHieght(){
            if(this.windowHeight>800){
                return this.windowHeight*0.85;
            }
            else if(this.windowHeight>700){
                return this.windowHeight*0.58;
            }
            else{
                return this.windowHeight*0.7;
            }
        },
        ...mapGetters({accountChanged:'accountChanged'})
    },
    watch:{
        accountChanged(val,oldVal){
            console.log(val);
            let self=this;
            if(val!=0) {
              console.log(self.dateValue)
              self.searchEventList(false)
              window.setTimeout(function(){
                  self.$route.meta.keepAlive = true;
                  console.log(self.$route.meta.keepAlive);
                },
                300);
              self.ifChangeAccount = true;
            }
        },
        numberOfElements(val,oldVal){
          console.log(val);
          console.log(oldVal);
          let self = this;
          if(val == 0 && self.totalElements > 0){
            self.params.filter.page -= 1;
            self.getEventList(self.params);
          }
        }
    },
    methods:{
      cellStyle({ row, column, rowIndex, columnIndex}){
        console.log(row);
        console.log(columnIndex);
        let obj = {};
        if(columnIndex == 0){
          obj = {'border-left': '1px solid #e3e9f4','border-right':'1px solid #e3e9f4'};
        }
        else{
          obj = {'border-right':'1px solid #e3e9f4'}
        }
        return obj;
      },
        generateEventLang,
        /*focusDate(val){
            let self=this;
            console.log(val);
        },*/
        dealDateStr(val){
            let dateRet='';
            let startStr=val.split('~')[0];
            let endStr=val.split('~')[1];
            let start=new Date(startStr).getTime();
            let end=new Date(endStr).getTime();

            let todayFullYear=new Date().getFullYear();
            let todayMonth=(new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1);
            let todayDate=new Date().getDate()<10?'0'+(new Date().getDate()):(new Date().getDate());
            let nowHour=new Date().getHours()<10?'0'+(new Date().getHours()):(new Date().getHours());
            let nowMin=new Date().getMinutes()<10?'0'+(new Date().getMinutes()):(new Date().getMinutes());
            let nowSec=new Date().getSeconds()<10?'0'+(new Date().getSeconds()):(new Date().getSeconds());

            let endFullYear=new Date(endStr).getFullYear();
            let endMonth=new Date(endStr).getMonth()+1<10?('0'+(new Date(endStr).getMonth()+1)):new Date(endStr).getMonth()+1;
            let endDate=new Date(endStr).getDate()<10?'0'+new Date(endStr).getDate():new Date(endStr).getDate();
            if(todayFullYear==endFullYear&&todayMonth==endMonth&&todayDate==endDate){  //截至日期选的是今天
                //dateRet=startStr
            }
        },
        dateChangeInput(val){
            let self=this;
            console.log(val);
            let startStr=val.split('~')[0];
            let endStr=val.split('~')[1];
            let start=new Date(startStr).getTime();
            let end=new Date(endStr).getTime();

            if((end-start)/(3600*24*30*1000)>1){  //当前选择的时间范围超过了30天
                Message({
                    message: this.$t('eventView.changeTimeRange'),
                    type:'warning',
                    duration:3*1000
                })
                start=end-3600*24*30*1000;
                let initDateStr=util.getDateStr1(start)+' ~ '+util.getDateStr1(end);
                self.dateInputStr=initDateStr;
            }
            self.serachData='';
            let tabIndex=Number(self.activeName);
            self.tableDataList[tabIndex].page=1;
            self.params.like={};
            self.params.beginTs=start;
            self.params.endTs=end;
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
        dateChange(val){
            let self=this;
            console.log(val);
            let tabIndex=Number(self.activeName);
            let start=typeof(val[0])==='object'?val[0].getTime():val[0];
            let end=typeof(val[1])==='object'?val[1].getTime():val[1];
            if((end-start)/(3600*24*30*1000)>1){  //当前选择的时间范围超过了30天
                Message({
                    message: this.$t('eventView.changeTimeRange'),
                    type:'warning',
                    duration:3*1000
                })
                start=end-3600*24*30*1000;
                self.dateValue=[new Date().setTime(start),new Date().setTime(end)];
            }
            else{
              self.dateValue = [new Date().setTime(start),new Date().setTime(end)]
            }
            self.serachData='';
            self.tableDataList[tabIndex].page=1;
            self.params.like={};
            self.params.beginTs=start;
            self.params.endTs=end;
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
            //let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
            //let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
            let dateval=self.dateValue;
            console.log(dateval)
            let startStr=dateval[0];
            let endTime = dateval[1];
            let endStr= endTime.constructor == Date ? new Date(endTime).getTime() : endTime;

            // let start=new Date(startStr).getTime();
            // let end=new Date(endStr).getTime();

            self.params.beginTs=startStr;
            self.params.endTs=endStr;
            self.params.filter={page:self.tableDataList[tabIndex].page-1,size:self.tableDataList[tabIndex].sizeNum};
            console.log(self.params);
            let curTabSortColumn = self.sortColumnOfTab[tabIndex];
              let order = curTabSortColumn.sortType.order;
              let prop = curTabSortColumn.sortType.prop;
              if(order!= '' && prop != ''){
                self.params.order={
                  "direction": order,
                  "property": prop
                }
              }
              this.getEventList(self.params);
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
            self.tableDataList[tabIndex].page=1;
            self.params.like={};

            //let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
            //let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
            let dateval=self.dateValue;
            console.log(dateval)
            let start=dateval[0];
            let endTime = dateval[1];
            let end = endTime.constructor == Date ? new Date(endTime).getTime() : endTime;

            self.params.beginTs = start;
            self.params.endTs = end;
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
            self.params.filter={page:self.tableDataList[tabIndex].page-1,size:self.tableDataList[tabIndex].sizeNum};
            self.getEventList(self.params);

            //let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
            //let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
            let dateval=self.dateValue;
            console.log(dateval)
            let start=dateval[0];
            let endTime = dateval[1];
            let end= endTime.constructor == Date ? new Date(endTime).getTime() : endTime;
            console.log(start)
          console.log(end)
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
            this.$router.push({name:"eventDetails",params:{event:this.event}});
        },
        toEventDetail(row){
            console.log(row);
            let self=this;
            this.event=row;
            sessionStorage.setItem('event',JSON.stringify(this.event));
            sessionStorage.setItem('queryparams',JSON.stringify(self.params));
            this.$router.push({name:"eventDetails",params:{event:this.event}});
        },
        sortChange(col){
            console.log(col);
            let self=this;
            let tabIndex=Number(self.activeName);
            self.tableDataList[tabIndex].page=1;
            let column=col.column;
            let order=col.order;
            self.order = order;
            let prop  = '';
            let tempOrder = '';
            if(order=="ascending"){
                self.params.order={
                    "direction":"asc",
                    "property":col.column.property
                }
              prop = col.column.property;
              tempOrder =  "asc";
            }
            else if(order=="descending"){
                self.params.order={
                    "direction":"desc",
                    "property": col.column.property
                }
                prop = col.column.property;
                tempOrder =  "desc";
            }
            else{
                self.params.order={};
            }
            self.sortColumnOfTab[tabIndex].sortType.prop = prop;
            self.sortColumnOfTab[tabIndex].sortType.order = tempOrder;
          console.log(self.sortColumnOfTab);
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
                        initialComment:item.initialComment,
                        relatedDeviceIds: item.relatedDeviceIds
                    }
                    temp.push(obj);
                })
                self.tableDataList[tabIndex].tableData=temp;
                self.tableDataList[tabIndex].total=res.data.totalElements;
                //if(tabIndex==0){
                self.tableDataList[tabIndex].eventCount=res.data.totalElements;
                self.totalElements = res.data.totalElements;
                self.numberOfElements = res.data.numberOfElements;
                //}
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
            let dom=document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0];
            let offestTop=dom.offsetTop;
            if(dom!=undefined){
                document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0].scrollTop=0;
            }
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
                case 0: label=this.$t('eventView.pendingEve');break;
                case 1: label=this.$t('eventView.myEvent');break;
                case 2: label=this.$t('eventView.all');break;
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
                        message: this.$t('eventView.noEvents'),
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
        getInitDateStr(){
            let self=this;
            let dateRetStr='';
            let startStr=self.dateInputStr.split('~')[0];
            let endStr=self.dateInputStr.split('~')[1];
            let formatDate=function(datetype){
                return datetype<10?('0'+datetype):datetype;
            }
            let getDateObj=dateStr=>{
                let obj={
                    year:new Date(dateStr).getFullYear(),
                    month:formatDate(new Date(dateStr).getMonth()+1),
                    date:formatDate(new Date(dateStr).getDate()),
                    hour:formatDate(new Date(dateStr).getHours()),
                    minutes:formatDate(new Date(dateStr).getMinutes()),
                    second:formatDate(new Date(dateStr).getSeconds())
                }
                return obj;
            }
            let nowHours=formatDate(new Date().getHours());
            let nowMin=formatDate(new Date().getMinutes());
            let nowSecond=formatDate(new Date().getSeconds());
            let start=getDateObj(startStr);
            let end=getDateObj(endStr);
            let startRet=start.year+'-'+start.month+'-'+start.date+' '+nowHours+':'+nowMin+':'+nowSecond;
            let endRet=end.year+'-'+end.month+'-'+end.date+' '+nowHours+':'+nowMin+':'+nowSecond;
            dateRetStr=startRet+' ~ '+endRet;
            return dateRetStr;
        },
        getNewestDate(){
            let self=this;
            let dateStr=self.getInitDateStr();
            console.log(dateStr);
            //self.dateInputStr=dateStr;
        },
       initData(){
        let self=this;
        self.activeName = '0';
        self.value = 0;
        self.dateValue = [new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()];
        self.serachVale='';
         self.total= 0;
           self.page=1;
           self.sizeNum=10;
           self.params={};
         self.tableDataList = [
           {
             label: this.$t('eventView.pendingEve'),
             eventCount:0,
             tableData:[],
             total:0,
             sizeNum:10,
             page:1
           },
           {
             label: this.$t('eventView.myEvent'),
             eventCount:0,
             tableData:[],
             total:0,
             sizeNum:10,
             page:1
           },
           {
             label: this.$t('eventView.allEvents'),
             eventCount:0,
             tableData:[],
             total:0,
             sizeNum:10,
             page:1
           }
         ],
        self.getDeafultTime();
        let windowHeight=window.innerHeight;
        if(windowHeight>800){
          self.tableHeight=770+'px';
        }
        console.log(self.tableHeight);
        self.getUserId();
        self.getInitList();

      }
    },
    created(){
      console.log('created')
      this.isFirstLoad = true
    },
    async mounted(){
        let self=this;
        console.log('mounted')
        self.getDeafultTime();
        //await self.isLoginIn();
        let windowHeight=window.innerHeight;
        if(windowHeight>800){
            self.tableHeight=770+'px';
        }
        console.log(self.tableHeight);
        self.getUserId();
        self.getInitList();

        let initDateStr=util.getDateStr1(new Date().getTime()-3600*1000*24)+' ~ '+util.getDateStr1(new Date().getTime());
        self.dateInputStr=initDateStr;
    },
  beforeRouteEnter (to, from, next) {
    if(from.name=='eventDetails'&& to.name == 'eventManage'){
      to.meta.isBack = true;
      next();
    }
    else{
      to.meta.isBack = false;
      next();
    }
  },
  activated(){
    let self=this;
    console.log('调用')
    self.windowHeight = window.innerHeight;
    if(!self.$route.meta.isBack || self.isFirstLoad){
      console.log('调用initData')
    }
    else{
      self.getEventList(self.params);
      let status=[];
      let selectValue=self.value;
      switch(selectValue){
        case 0:status=[0,1,2];break;
        default:status=selectValue-1;break;
      }
      let like=self.params.like;
      let start = self.params.beginTs;
      let end = self.params.endTs;
      self.getEventCount(start,end,status);
    }
    self.$route.meta.isBack = false;
    self.isFirstLoad = false;
  },
    beforeRouteLeave (to, from, next) {
      console.log(this.params);
        if(to.name != 'eventDetails'){
          from.meta.keepAlive = false;
          next(vm=>{
            console.log(vm)
          });
        }
        else{
          from.meta.keepAlive = true;
          next(vm=>{
            console.log(vm)
          });
        }
    },
    // beforeRouteEnter (to, from, next) {
    //   console.log(to);
    //   to.meta.keepAlive=true;
    //   next(vm => {
    //     console.log(vm);
    //     // let queryStr = sessionStorage.getItem('queryparams')
    //     // vm.params = JSON.parse(queryStr);
    //     // if(from.name=='eventDetails' && to.name == 'eventManage'){
    //     //   console.log(vm.params)
    //     //   vm.getEventList(vm.params);
    //     // }
    //   });
    // },
    // activated(){
    //     let self=this;
    //     self.getEventList(self.params);
    // }
    // beforeRouteLeave (to, from, next) {
    //   if(to.name=='eventDetails'){
    //     if(!from.meta.keepAlive){
    //       from.meta.keepAlive=true;
    //     }
    //   }
    //   else{
    //     from.meta.keepAlive=false;
    //     //this.$destroy();
    //   }
    //   next();
    // },
    // beforeRouteEnter (to, from, next) {
    //   if(from.name!='eventDetails'&&from.path!='/'){
    //     to.meta.keepAlive=false;
    //   }
    //   else{
    //     to.meta.keepAlive=true;
    //   }
    //   next(vm => {
    //     console.log(vm);
    //   });
    // },
    // activated(){
    //   console.log('activated 调用')
    //   let self=this;
    //   console.log(self.params);
    //   self.getEventList(self.params);
    // }
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
    border: 1px solid #e3e9f4;
    /*overflow: hidden;*/
    .sourceType-icon{
        margin-right: calc(20/1920*100vw);
        position: relative;
        float: left;
        //@include point(bottom,2);
        height: calc(28/1920*100vw);
        width: calc(24/1920*100vw);
    }
    .icon-span{
        display:inline-block;
        width:60px;
        height:22px;
        color:white;
        font-size: 12px;
    }
    .icon-gengduo{
      font-size: calc(24/1920*100vw);
      vertical-align: middle;
      cursor: pointer;
      color: #7d8cad;
    }
    .el-date{
        height: 70px;
        line-height: 70px;
        text-align: left;
        border-bottom: 1px solid #e3e9f4;
        position: relative;
        background-color: #fff;
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
           color:$tab;
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
        background-color: #fff;
        position: relative;
        padding-top: calc(30/1920*100vw);
        .export-btn{
            position: absolute;
            @include point(right,20);
            //background-color: $red;
            border-color: $red;
            z-index: 990;
            height: calc(36/1920*100vw);
            width: calc(130/1920*100vw);
            margin: 0;
            padding: 0;
            font-size: calc(14/1920*100vw);
            line-height: calc(36/1920*100vw);
            color: #ffffff;
            border-width: 0;
            border-radius: 4px;
            top: calc(24/1920*100vw);
            .btn-area{
              position: relative;
              padding: 0 calc(6/1920*100vw);
              height: calc(36/1920*100vw);
              display: inline-flex;
              align-items: center;
              .icon-excel{
                margin: calc(6/1920*100vw) calc(18/1920*100vw) calc(6/1920*100vw) 0;
                font-size: calc(24/1920*100vw);
                height: calc(24/1920*100vw);
                width: calc(24/1920*100vw);
              }
              .spanClass{
                font-size: calc(14/1920*100vw);
                display: inline-block;
              }
            }
        }
      .en-export-btn{
        position: absolute;
        @include point(right,20);
        //background-color: $red;
        border-color: $red;
        z-index: 990;
        height: calc(36/1920*100vw);
        width: calc(130/1920*100vw);
        margin: 0;
        padding: 0;
        font-size: calc(14/1920*100vw);
        line-height: calc(36/1920*100vw);
        color: #ffffff;
        border-width: 0;
        border-radius: 4px;
        .btn-area{
          position: relative;
          padding: 0 calc(6/1920*100vw);
          height: calc(36/1920*100vw);
          display: inline-flex;
          align-items: center;
          .icon-excel{
            margin: calc(6/1920*100vw) calc(18/1920*100vw) calc(6/1920*100vw) 0;
            font-size: calc(24/1920*100vw);
          }
          .spanClass{
            font-size: calc(14/1920*100vw);
            display: inline-block;
          }
        }

        @media screen and (min-width: 1366px){
          width: 160px;
        }
        @media screen and (max-width: 1366px){
          width: 140px;
        }
      }
      .table-content{
            width:100%;
            text-align: center;
            /*height:300px;*/
            /*float:left;*/
        }
    }
    #tabs-content /deep/  .el-tabs__nav-scroll{
      margin-left:40px;
    }
    #tabs-content  /deep/ .el-tabs__header{
      margin-bottom:0px !important;
    }

    #tabs-content  /deep/ .el-tabs__active-bar{
      height: 4px !important;
      background-color: #f31d65 !important;
    }
  .el-table-panel{
    @include point(margin-left,15);
    @include point(margin-right,15);
  }
  .clearfix{
    content: "";
    display: block;
    height: 0;
    clear:both;
    overflow: auto;
  }
}
.el-select-content{
    @include point(width,120);
}
.empty-data-icon{
    @include point(font-size,22);
    color: #53c247;
}
#dateinput{
    width: calc(300/1920*100vw);
    height: calc(24/1920*100vw);
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding-left: 30px;
    font-size: 12px;
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
        background: #F4F5F9 !important;
        /*border-radius: 0px !important;*/
        /*border: 0 !important;*/
    }
</style>
<style>
 @import '../../assets/css/pagination.css';
 @import '../../assets/css/tabsItem.css';
    .layui-laydate .layui-this{
        background-color:#f31d65 !important;
    }
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
    .date-picker-poper .el-button--text{
        visibility: hidden !important;
    }
     .select-poper .el-select-dropdown__item.hover{
        background-color:#FEE4E7;
    }
   .self-class-name  /deep/ .cell{
     display: flex ;
     align-items: center;
   }
</style>

