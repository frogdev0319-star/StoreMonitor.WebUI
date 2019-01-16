<template>
    <el-row class="el-schedule-container">
        <el-col :span="24" class="el-header">
            <span>排程</span>
        </el-col>
        <el-col :span="24" class="el-content">
            <el-col :span="8" class="schedule-group">
                <div class="title-content">
                    <i class="iconfont icon-wenjian icontitle"></i><span class="level2">排程名称</span>
                    <el-button size="mini" @click="addSchedule" class="title-btn"><i class="el-icon-plus"></i><span>添加排程</span></el-button>
                </div>
                <div class="group-items group-title">
                   <div v-for="(item,index) in groupList" 
                   :key="index" class="groupItem" @click="clickGroupItem(index,item)" @mouseenter="getEditGroup(index,item)"
                   :class="item.isClick?'noraml-color':'noraml-groupColor'">
                        <div class="proper-flag" v-if="item.isClick"></div>
                        <span v-if="!item.isEdit" :style="item.isClick?{'color':'#FB505F'}:{}">{{item.groupName}}</span>
                        <el-input size="mini" v-model="item.groupName" class="nape-input input-details" v-if="item.isEdit"></el-input>
                        <div class="iconcontent" v-if="item.showEdit">
                            <div class="nape-items-handle" v-if="!item.isEdit">
                                <i class="iconfont icon-bianji" 
                                style="font-size: 20px;cursor:pointer;margin-right:10px;" 
                                 @click="editGroup(index,item)"></i>
                                <i class="iconfont icon-shanchu" style="font-size: 20px;cursor:pointer;"
                                  @click="deleteGroup(index, item)"></i>
                            </div>
                        </div>
                        <div class="iconcontent">
                            <div class="iconlised" style="background-color:#FB505F" @click="confirmEditGroup(index,item)" v-if="item.isEdit">
                                <i class="el-icon-check"></i>
                            </div>
                            <div class="iconrised" @click="cancelEditGroup(index,item)" v-if="item.isEdit">
                                <i class="el-icon-close"></i>
                            </div>
                        </div>
                    </div>
               </div>
               <div class="group-add" v-if="showAddGroup">
                   <el-input size="mini" class="groupName-input input-details" placeholder="输入类别名" v-model="groupNameInput"></el-input>
                    <div class="iconcontent">
                        <div class="iconlised" style="background-color:#FB505F" @click="confirmAddGroup">
                            <i class="el-icon-check"></i>
                        </div>
                        <div class="iconrised" @click="cancelAddGroup">
                            <i class="el-icon-close"></i>
                        </div>
                    </div>
               </div>
            </el-col>
            <el-col :span="16" class="schedule-content">
                <div class="schedule-title">
                   <span v-if="groupList.length!=0" class="level2"><i class="iconfont icon-icon-test icontitle"></i>{{napeTitle}}详情</span>
                   <el-button size="mini" @click="saveSchedule" class="title-btn">保 存</el-button>
                </div>
                <div class="scheule-info">
                    <div class="scheule-choice">
                        <el-radio v-model="radioDate" label="1">按天设置</el-radio>
                        <el-radio v-model="radioDate" label="2">按时间设置</el-radio>
                    </div>
                    <div v-if="radioDate=='1'" class="radio-date">
                        <span style="margin-right:15px;">选择月份</span>
                        <el-date-picker
                        class="el-date"
                        v-model="modeMonth" size="mini"
                        type="month"
                        :clearable=false
                        placeholder="选择月" @change="changeMonth">
                        </el-date-picker>
                        <span style="margin-left:30px;margin-right:20px;">日期</span>
                        <el-input size="mini" style="width:200px;" v-model="modeDate"></el-input>
                        <div class="date-content">
                            <div class="date-header">
                                <i @click="forWard" class="el-icon-arrow-left icon-arrow"></i>
                                <span>{{curYear}}年{{curMonth}}月</span>
                                <i @click="backWard" class="el-icon-arrow-right icon-arrow"></i>

                            </div>
                            <div class="date-data">
                                <span class="date-title" v-for="(item,index) in weekTitles" :key="index">
                                    {{item}}
                                </span>
                                <div class="date-details" v-for="item in weekDays">
                                    <div class="data" v-for="(_item,_index) in item" :key="_index">
                                        <span :class="_item.showBack?'opColor':'noramlColor'"
                                        :style="_item.showOp?{'color':'#E8E9ED'}:{'color':'black'}">{{_item.data}}</span>
                                    </div>
                                </div>
                                <div class="schedule-tag">
                                </div>
                                <span style="margin-left:20px;color:#94a4b4;font-size:14px;">已设排程</span>
                                <div class="all-month">
                                     <el-checkbox v-model="allMonth"></el-checkbox><span class="allMonth-title">应用至所有月份</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="rside-content">
                        <div class="day-deatil">
                            <span class="day-title">按天选择</span>
                            <div class="city-content" @click="choiceWeek">
                                <div class="input-arrow-panel"></div>
                                    <el-input v-model="weekValue" size="mini" id="elCity" placeholder="城市" :readonly=true></el-input>
                                    <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                            </div>
                            <div class="week-panel" v-if="showWeekContent"> 
                                <div class="week-details" v-for="(item,index) in weekList" :key="index">
                                    <el-checkbox v-model="item.checked" @change="changeWeekItem(item)"></el-checkbox>
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="rside-deatil">
                            <span>开始时间</span>
                            <el-time-picker class="date-picker"
                                v-model="startTime"
                                format='HH:mm'     
                                value-format="HH:mm" 
                                size="mini"
                                :picker-options="{
                                    format: 'HH:mm'
                                }">
                            </el-time-picker>
                            <span style="margin-left:10px;">时</span>
                        </div>
                        <div class="rside-deatil">
                            <span>结束时间</span>
                            <el-time-picker class="date-picker"
                                v-model="endTime"
                                format='HH:mm'     
                                value-format="HH:mm" 
                                size="mini"
                                :picker-options="{
                                    format: 'HH:mm'
                                }">
                            </el-time-picker>
                            <span style="margin-left:10px;">时</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-col>
    </el-row>
</template>
<script>
import util from '@/common/util'
export default {
    name:'ScheduleManage',
    data(){
        return{
            groupList:[
                {
                    groupName:'排程一',
                    isClick:false,
                    isEdit:false,
                    showEdit:false
                },
                {
                    groupName:'排程二',
                    isClick:false,
                    isEdit:false,
                    showEdit:false
                },
                {
                    groupName:'排程三',
                    isClick:false,
                    isEdit:false,
                    showEdit:false
                }
            ],
            napeTitle:'',
            radioDate:'1',
            modeMonth:new Date(),
            modeDate:'',
            showAddGroup:false,
            curYear:new Date().getFullYear(),
            curMonth:new Date().getMonth()+1,
            curDay:new Date().getDate(),
            weekTitles:[
                '日','一','二','三','四','五','六'
            ],
            weekList:[
                {
                    'checked':false,
                    'name':'周一',
                    'value':'Mon',
                },
                {
                    'checked':false,
                    'name':'周二',
                    'value':'Tue',
                }, 
                {
                    'checked':false,
                    'name':'周三',
                    'value':'Wed',
                }, 
                {
                    'checked':false,
                    'name':'周四',
                    'value':'Thur',
                }, 
                {
                    'checked':false,
                    'name':'周五',
                    'value':'Fri',
                }, 
                {
                    'checked':false,
                    'name':'周六',
                    'value':'Sat',
                }, 
                {
                    'checked':false,
                    'name':'周日',
                    'value':'Sun',
                }
            ],
            weekValue:'每天',
            weekDays:[],
            curStartIndex:0,
            allMonth:false,
            showWeekContent:false,
            startTime:'',
            endTime:'',
            groupIndex:0,
        }
    },
    methods:{
        addSchedule(){
            this.showAddGroup=true;
        },
        clickGroupItem(index,item){
            let self=this;
            item.isClick=true;
            self.groupIndex=index;
            self.curGroup=item;
            self.napeTitle=`${item.groupName}`;
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
            self.getNapeList(index,item);
        },
        forWard(){
            let self=this;
            if(self.curMonth==1){
                self.curMonth=12;
                self.curYear--;
            }
            else{
                self.curMonth--;
            }
            self.getWeekDay();
        },
        backWard(){
            let self=this;
            if(self.curMonth==12){
                self.curMonth=1;
                self.curYear++;
            }
            else{
                self.curMonth++;
            }
            self.getWeekDay();
        },
        saveSchedule(){

        },
        choiceWeek(){
            let self=this;
            self.showWeekContent=!self.showWeekContent;
        },
        changeWeekItem(item){
            let self=this;
            console.log(item);
            let dateStr="";
            let count=0;
            self.weekList.forEach(item=>{
                if(item.checked){
                    dateStr=dateStr+item.name+',';
                    count++;
                }
            })
            console.log(dateStr);
            if(dateStr.length!=0){
                self.weekValue=dateStr;
                if(count==self.weekList.length){
                    self.weekValue='每天';
                }
            }
        },
        changeMonth(val){
            console.log(val);
            let self=this;
            console.log(self.modeMonth);
            let year=val.getFullYear();
            let month=val.getMonth()+1;
            self.curYear=year;
            self.curMonth=month;
            self.getWeekDay();
        },
        getWeekDay(){
            let self=this;
            let curWeek=util.getDateCurMonth(self.curYear,self.curMonth);
            console.log(curWeek);
            let dayNum=util.getDayNum(self.curYear,self.curMonth);
            console.log(dayNum);
            let forWardMonth=(self.curMonth==1?12:self.curMonth-1);
            let forWardYear=(self.curMonth==1?self.curYear-1:self.curYear);
            let forWardDayNum=util.getDayNum(forWardYear,forWardMonth);
            console.log(forWardDayNum);
            let datenew=new Array(42);
            let indexTemp=0;
            let temp=[];
            for(let i=0;i<datenew.length;i++){
                let obj={};
                if(i<curWeek){
                    obj.showBack=false;
                    if(i==2){
                        obj.showBack=true;
                    }
                    obj.showOp=true;
                    obj.data=forWardDayNum-(curWeek-1-i);
                    datenew[i]=forWardDayNum-(curWeek-1-i);
                }
                else if(i==curWeek){
                    obj.showBack=false;
                    obj.showOp=false;
                    obj.data=1;
                    datenew[i]=1;
                }
                else{
                    datenew[i]=1+(i-curWeek);
                    if(datenew[i]==dayNum){
                        indexTemp=i;
                    }
                    if(i%6==0){
                        obj.showBack=true;
                    }
                    else{
                        obj.showBack=false;
                    }
                    obj.showOp=false;
                   
                    obj.data=datenew[i]=1+(i-curWeek);
                }
                temp.push(obj);
            }
           // for(let i=0;i<datenew.length;i++){
                // if(i>indexTemp){
                    // console.log(indexTemp);
                    // datenew[i]=i-indexTemp;
            temp=temp.slice(1,indexTemp+1);
            //}
            // }
            var dateList=[];
            for(let i=0;i<temp.length;i+=7){
                dateList.push(temp.slice(i,i+7));
            }
            console.log(temp);
            self.weekDays=dateList;
            console.log(self.weekDays);
        },
        getEditGroup(index,item){
            let self=this;
            item.showEdit=true;
            
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.showEdit=false;
                }
            })
        },
        editGroup(index,item){
            let self=this;
            item.isEdit=true;
            item.showEdit=false;
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isEdit=false;
                }
            })
        },
        getTheTodayColor(){
            let self=this;
            let today=new Date().getDate();
        },
         cancelEditGroup(index,item){
            item.isEdit=false;
        },
        confirmAddGroup(){

        },
        cancelAddGroup(){
            let self=this;
            self.showAddGroup=false;
        },
    },
    mounted(){
        this.getWeekDay();
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../assets/css/textstyle.css';
    $mainColor:#FB505F;
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
    .today{
        color: lightskyblue;
    }
    .nape-input{
        @include point(width,220);
        float: left;
        @include point(margin-left,10);
        @include point(line-height,50);
    }
    .opColor{
        background-color: #FB505F !important;
        color: #fff !important;
    }
    .noramlColor{
        background-color: #fff;
    }
    .icontitle{
        @include point(margin-right,10);
        font-weight: normal;
        @include point(font-size,20);
        @include point(margin-left,15);
    }
    .title-btn{
        position: absolute;
        @include point(right,15);
        @include point(top,16);
        background-color: $mainColor;
        color: #fff;
        @include point(width,120);
        @include point(font-size,14);
        span{
            @include point( margin-left,15);
        }
    }
    .iconcontent{
        position: absolute;
        right: 10px;
        margin-top: 13px;
        margin-right: 15px;
        .iconlised{
            float: left;
            position: relative;
            background-color: orange;
            padding: 1px 6px;
            color: #fff;
            border-width: 1px 1px 1px 1px;
            border-style: solid;
            border-color: #ddd;
            cursor: pointer;
        }
        .iconrised{
            float: left;
            position: relative;
            padding: 1px 6px;
            border-width: 1px 1px 1px 0px;
            border-style: solid;
            border-color: #ddd;
            background-color: #fff;
            cursor: pointer;
        }
    }
    .el-schedule-container{
        .el-header{
            @include point(height,60);
            @include point(line-height,60);
            @include point(font-size,18);
            font-weight: bold;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .el-content{
            height: auto;
            @include point(min-height,650);
            .schedule-group{
                text-align: left;
                position: relative;
                .title-content{
                    @include point(height,60);
                    @include point(line-height,60);
                    text-align: left;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid #ddd;
                    span{
                        @include point(margin-left,10);
                        font-weight: bold;
                    }
                }
                .group-items{
                    @include point(font-size,14);
                    .groupItem{
                        @include point(height,50);
                        position: relative;
                        overflow: hidden;
                        border-bottom: 1px solid #ddd;
                        cursor: pointer;
                        .proper-flag{
                            height: 70%;
                            width: 4px;
                            position:absolute;
                            top: 15%;
                            background-color: $mainColor;
                        }
                        span{
                            float: left;
                            @include point(margin-left,25);
                            @include point(line-height,50);
                        }
                    }
                }
                .group-add{
                    @include point(margin-top,15);
                    position: relative;
                    overflow: hidden;
                    @include point(height,50);
                    .groupName-input{
                        width: 60%;
                        float: left;
                        @include point(margin-left,25);
                        @include point(line-height,50);
                    }
                }
                .noraml-color{
                    background-color: #fff;
                }
                .noraml-groupColor{
                    background-color: #FAFAFA;
                }
                .group-add{
                    @include point(margin-top,15);
                    position: relative;
                    overflow: hidden;
                    @include point(height,50);
                    .groupName-input{
                        width: 60%;
                        float: left;
                        @include point(margin-left,25);
                        @include point(line-height,50);
                    }
                }
            }
            
            .schedule-content{
                position: relative;
                .schedule-title{
                    @include point(height,60);
                    @include point(line-height,60);
                    text-align: left;
                    position: relative;
                    @include point(font-size,16);
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                    .icontitle{
                        @include point(margin-left,25);
                    }
                }
                .scheule-info{
                    .scheule-choice{
                        @include point(height,50);
                        @include point(line-height,60);
                        text-align: left;
                        @include point(margin-left,30);
                    }
                    .radio-date{
                        @include point(height,50);
                        @include point(line-height,50);
                        text-align: left;
                        @include point(margin-left,30);
                        @include point(font-size,14);
                        color: #424151;
                        .el-date{
                            @include point(width,200);
                        }
                        .date-content{
                            width: 90%;
                            text-align: center;
                            margin-top: 0px;
                            padding-right: 10%;
                            .date-header{
                                user-select: none;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                .icon-arrow{
                                    @include point(font-size,30);
                                    opacity: 0.4;
                                    position: relative;
                                    top: 4px;
                                    cursor: pointer;
                                }
                                span{
                                    @include point(font-size,14);
                                    font-weight: bold;
                                    @include point(margin,25);
                                }
                            }
                            .date-data{
                                text-align: left;
                                padding-left: 10%;
                                .date-title{
                                    display: inline-block;
                                    width: 14%;
                                    position: relative;
                                    @include point(left,10);
                                }
                                .date-details{
                                    .data{
                                        width: 14%;
                                        display: inline-block;
                                    }
                                    span{
                                        display: block;
                                        @include point(width,36);
                                        @include point(height,36);
                                        background-color: #fff;
                                        @include point(line-height,36);
                                        text-align: center;
                                        @include point(font-size,14);
                                        @include point(border-radius,18);
                                    }
                                }
                                .schedule-tag{
                                    width: 16px;
                                    height: 16px;
                                    background-color: #FB505F;
                                    border-radius: 8px;
                                    margin-top: 20px;
                                    display: inline-block;
                                }
                                .all-month{
                                    position: relative;
                                    bottom: 20px;
                                    .allMonth-title{
                                        margin-left: 28px;
                                        font-size: 14px;
                                        font-weight: bold;
                                    }
                                }
                            }
                        }
                    }
                    .rside-content{
                        position: relative;
                        text-align: left;
                        .city-content{
                            display: inline-block;
                            position: relative;
                            cursor: pointer;
                            #elCity{
                                width: 200px;
                                border-radius: 0px;
                                background-color: #f0f5f8;
                            }
                            .el-input{
                                width: 200px;
                            }
                            .input-arrow-panel{
                                width: 200px;
                                height: 28px;
                                position: absolute;
                                background-color: transparent;
                                cursor: pointer;
                                z-index: 100;
                            }
                            .icon-input{
                                position: absolute;
                                right: 10px;
                                top: 6px;
                            }
                        }
                        .week-panel{
                            position: absolute;
                            margin-top: 3px;
                            left: 102px;
                            width: 188px;
                            height: auto;
                            z-index: 980;
                            background-color: #fff;
                            border: 1px solid #ddd;
                            padding: 5px;
                            .week-details{
                                padding: 2px 10px;
                                span{
                                    margin-left: 10px;
                                    font-size: 14px;
                                }
                            }
                        }
                        .day-deatil{
                            padding-left: 30px;
                            height: 50px;
                            font-size: 14px;
                            position: relative;
                            top: 18px;
                            span{
                                margin-right: 12px;
                            } 
                        }
                        .rside-deatil{
                            padding-left: 30px;
                            height: 50px;
                            line-height: 60px;
                            font-size: 14px;
                            span{
                                margin-right: 12px;
                            } 
                            .date-picker{
                                width: 200px;
                            }
                        }
                    }
                    
                }
            }
        }
    }
</style>
<style>
.scheule-info .el-radio__label{
    font-weight: bold !important;
}
.el-radio__input.is-checked .el-radio__inner{
    background-color: #FB505F;
    border-color:#FB505F;
}
.el-radio__input.is-checked+.el-radio__label{
    color: #FB505F;
}
.el-month-table td .cell:hover, .el-month-table td.current:not(.disabled) .cell{
    color: #FB505F;
}
.el-input .el-input__inner:focus{
    border-color: #FB505F;
}
.el-checkbox__inner:hover{
    border-color: #FB505F !important;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB505F}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB505F !important;
    border-color:#FB505F !important;
}
.el-time-panel__btn.confirm{
    background-color: #FB505F;
    color: #fff;
    padding:0px 10px;
    background-color: #EAEDF2;
    color: #708090;
    line-height: 20px;
}
.el-time-panel__btn.confirm:hover{
    color: #FB505F;
}
</style>
