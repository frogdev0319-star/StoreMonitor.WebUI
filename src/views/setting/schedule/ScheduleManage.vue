<template>
    <el-row class="el-schedule-container">
        <el-col :span="24" class="el-header">
            <span>排程</span>
        </el-col>
        <el-col :span="24" class="el-content">
            <el-col :span="8" class="schedule-group">
                <div class="group-title">
                    <i class="iconfont icon-wenjian icontitle"></i><span class="level2">排程名称</span>
                    <el-button size="mini" @click="addSchedule" class="title-btn"><i class="el-icon-plus"></i><span>添加排程</span></el-button>
                </div>
                <div class="group-details group-title" v-for="(item,index) in groupList" 
                :key="index" @click="clickGroupItem(index,item)" @mouseenter="getEditGroup(index,item)"
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
                        <div class="iconlised" style="background-color:#FB505F" @click="confirmEditGroup(index,item)" v-if="item.isEdit">
                            <i class="el-icon-check"></i>
                        </div>
                        <div class="iconrised" @click="cancelEditGroup(index,item)" v-if="item.isEdit">
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
                        <span class="normal-text" style="margin-right:15px;">选择月份</span>
                        <el-date-picker
                        class="el-date"
                        v-model="modeYear" size="mini"
                        type="month"
                        placeholder="选择月">
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
                                }"
                                placeholder="">
                            </el-time-picker>
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
                                }"
                                placeholder="">
                            </el-time-picker>
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
                    isEdit:false
                },
                {
                    groupName:'排程二',
                    isClick:false,
                    isEdit:false
                },
                {
                    groupName:'排程三',
                    isClick:false,
                    isEdit:false
                }
            ],
            napeTitle:'',
            radioDate:'1',
            modeYear:'',
            modeDate:'',
            curYear:2018,
            curMonth:12,
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
        }
    },
    methods:{
        addSchedule(){

        },
        clickGroupItem(index,item){

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
    },
    mounted(){
        this.getWeekDay();
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../assets/css/textstyle.css';
    $mainColor:#FB505F;
    .opColor{
        background-color: #FB505F !important;
        color: #fff !important;
    }
    .noramlColor{
        background-color: #fff;
    }
    .el-schedule-container{
        .el-header{
            height: 60px;
            line-height: 60px;
            font-size: 18px;
            font-weight: bold;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .title-btn{
            position: absolute;
            right: 15px;
            margin-top: 16px;
            background-color: $mainColor;
            color: #fff;
            width: 120px;
            font-size: 14px;
            span{
                margin-left: 15px;
            }
        }
        .el-content{
            height: auto;
            .icontitle{
                margin-right: 10px;
                font-weight: normal;
                font-size: 20px;
                margin-left: 15px;
            }
            .schedule-group{
                text-align: left;
                position: relative;
                .group-title{
                    height: 60px;
                    line-height: 60px;
                    border-bottom: 1px solid #ddd;
                }
                .group-details{
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ddd;
                    span{
                        margin-left: 45px;
                        font-size: 14px;
                    }
                }
            }
            .schedule-content{
                position: relative;
                .schedule-title{
                    height: 60px;
                    line-height: 60px;
                    text-align: left;
                    position: relative;
                    font-size: 16px;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                    .icontitle{
                        margin-left: 25px;
                    }
                }
                .scheule-info{
                    .scheule-choice{
                        height: 50px;
                        line-height: 60px;
                        text-align: left;
                        margin-left: 30px;
                    }
                    .radio-date{
                        height: 50px;
                        line-height: 50px;
                        text-align: left;
                        margin-left: 30px;
                        .el-date{
                            width: 200px;
                        }
                        .date-content{
                            width: 90%;
                            text-align: center;
                            margin-top: 0px;
                            padding-right: 10%;
                            .date-header{
                                .icon-arrow{
                                    font-size: 30px;
                                    opacity: 0.4;
                                    position: relative;
                                    top: 4px;
                                    cursor: pointer;
                                }
                                span{
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin: 25px;
                                }
                            }
                            .date-data{
                                text-align: left;
                                padding-left: 10%;
                                .date-title{
                                    display: inline-block;
                                    width: 14%;
                                    position: relative;
                                    left: 10px;
                                }
                                .date-details{
                                    .data{
                                        width: 14%;
                                        display: inline-block;
                                    }
                                    span{
                                        display: block;
                                        width: 40px;
                                        height: 40px;
                                        background-color: #fff;
                                        line-height: 40px;
                                        text-align: center;
                                        border-radius: 20px;
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
                            left: 104px;
                            width: 147px;
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
