<template>
  <router-view></router-view>
    <!--<el-row class="el-schedule-container">-->
      <!--<router-view></router-view>-->
        <!--<el-col :span="24" class="el-header">-->
            <!--<span>{{generateScheduleLang('schedule')}}</span>-->
        <!--</el-col>-->
        <!--<el-col :span="24" class="el-content">-->
            <!--<el-col :span="8" class="schedule-group">-->
                <!--<div class="title-content">-->
                    <!--<i class="iconfont icon-wenjian icontitle"></i><span class="level2">{{generateScheduleLang('scheduleName')}}</span>-->
                    <!--<el-button size="mini" @click="addSchedule" :class="lang=='en'? 'add-btn':'title-btn'" type="primary"><i class="el-icon-plus"></i><span>{{generateScheduleLang('addSchedule')}}</span></el-button>-->
                <!--</div>-->
                <!--<div class="group-items group-title">-->
                   <!--<div v-for="(item,index) in groupList"-->
                   <!--:key="index" class="groupItem" @click="clickGroupItem(index,item)" @mouseenter="getEditGroup(index,item)"-->
                   <!--:class="item.isClick?'noraml-color':'noraml-groupColor'">-->
                        <!--<div class="proper-flag" v-if="item.isClick"></div>-->
                        <!--<span v-if="!item.isEdit" :style="item.isClick?{'color':'#f31d65'}:{}">{{item.groupName}}</span>-->
                        <!--<el-input size="mini" v-model="item.groupName" class="nape-input input-details" v-if="item.isEdit"></el-input>-->
                        <!--<div class="iconcontent" v-if="item.showEdit">-->
                            <!--<div class="nape-items-handle" v-if="!item.isEdit">-->
                                <!--<i class="iconfont icon-bianji"-->
                                <!--style="font-size: 20px;cursor:pointer;margin-right:10px;"-->
                                 <!--@click="editGroup(index,item)"></i>-->
                                <!--<i class="iconfont icon-shanchu" style="font-size: 20px;cursor:pointer;"-->
                                  <!--@click="deleteGroup(index, item)"></i>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div class="iconcontent">-->
                            <!--<div class="iconlised" style="background-color:#f31d65" @click="confirmEditGroup(index,item)" v-if="item.isEdit">-->
                                <!--<i class="el-icon-check"></i>-->
                            <!--</div>-->
                            <!--<div class="iconrised" @click="cancelEditGroup(index,item)" v-if="item.isEdit">-->
                                <!--<i class="el-icon-close"></i>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
               <!--</div>-->
               <!--<div class="group-add" v-if="showAddGroup">-->
                   <!--<el-input size="mini" class="groupName-input input-details" :placeholder="generateScheduleLang('inputPlaceholder')" v-model="groupNameInput"></el-input>-->
                    <!--<div class="iconcontent">-->
                        <!--<div class="iconlised" style="background-color:#FB4C5D" @click="confirmAddGroup">-->
                            <!--<i class="el-icon-check"></i>-->
                        <!--</div>-->
                        <!--<div class="iconrised" @click="cancelAddGroup">-->
                            <!--<i class="el-icon-close"></i>-->
                        <!--</div>-->
                    <!--</div>-->
               <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="16" class="schedule-content">-->
                <!--<div class="schedule-title">-->
                   <!--<span v-if="groupList.length!=0" class="level2"><i class="iconfont icon-icon-test icontitle"></i>{{napeTitle}}{{generateScheduleLang('details')}}</span>-->
                   <!--<el-button size="mini" @click="saveSchedule" class="title-btn" type="primary">{{generateScheduleLang('save')}}</el-button>-->
                <!--</div>-->
                <!--<div class="scheule-info">-->
                    <!--<div class="scheule-choice">-->
                        <!--<el-radio v-model="radioDate" label="1">{{generateScheduleLang('settingOnDay')}}</el-radio>-->
                        <!--<el-radio v-model="radioDate" label="2">{{generateScheduleLang('settingOnHou')}}</el-radio>-->
                    <!--</div>-->
                    <!--<div v-if="radioDate=='1'" class="radio-date">-->
                        <!--<span style="margin-right:15px;">{{generateScheduleLang('selectMonth')}}</span>-->
                        <!--<el-date-picker-->
                        <!--class="el-date"-->
                        <!--v-model="modeMonth" size="mini"-->
                        <!--type="month"-->
                        <!--:clearable=false-->
                        <!--placeholder="generateScheduleLang('selectMonth')" @change="changeMonth">-->
                        <!--</el-date-picker>-->
                        <!--<span style="margin-left:30px;margin-right:20px;">{{generateScheduleLang('date')}}</span>-->
                        <!--<el-input size="mini" class="show-dateStr"  v-model="modeDate"></el-input>-->
                        <!--<div class="date-content">-->
                            <!--<div class="date-header">-->
                                <!--<i @click="forWard" class="el-icon-arrow-left icon-arrow"></i>-->
                                <!--<span v-if="this.lang !== 'en'">{{curYear}}{{generateScheduleLang('year')}}{{curMonth}}{{generateScheduleLang('month')}}</span>-->
                                <!--<span v-else>{{curMonth}}/{{curYear}}</span>-->
                                <!--<i @click="backWard" class="el-icon-arrow-right icon-arrow"></i>-->

                            <!--</div>-->
                            <!--<div class="date-data">-->
                                <!--<span class="date-title" v-for="(item,index) in weekTitles" :key="index">-->
                                    <!--{{item}}-->
                                <!--</span>-->
                                <!--<div class="date-details" v-for="item in weekDays">-->
                                    <!--<div class="data" v-for="(_item,_index) in item" :key="_index">-->
                                        <!--<span :class="_item.showBack?'opColor':'noramlColor'"-->
                                        <!--:style="_item.showOp?{'color':'#E8E9ED'}:{'color':'black'}">{{_item.data}}</span>-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<div class="schedule-tag">-->
                                <!--</div>-->
                                <!--<span style="margin-left:20px;color:#94a4b4;font-size:14px;">{{generateScheduleLang('scheduleSet')}}</span>-->
                                <!--<div class="all-month">-->
                                     <!--<el-checkbox v-model="allMonth"></el-checkbox><span class="allMonth-title">{{generateScheduleLang('applyToAllMon')}}</span>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div v-else class="rside-content">-->
                        <!--<div class="day-deatil">-->
                            <!--<span class="day-title">{{generateScheduleLang('selectOnDay')}}</span>-->
                            <!--<div class="city-content" @click="choiceWeek">-->
                                <!--<div class="input-arrow-panel"></div>-->
                                    <!--<el-input v-model="weekValue" size="mini" id="elCity" :placeholder="generateScheduleLang('city')" :readonly=true></el-input>-->
                                    <!--<i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>-->
                            <!--</div>-->
                            <!--<div :class="lang==='en' ? 'en-week-panel':'week-panel'" v-if="showWeekContent">-->
                                <!--<div class="week-details" v-for="(item,index) in weekList" :key="index">-->
                                    <!--<el-checkbox v-model="item.checked" @change="changeWeekItem(item)"></el-checkbox>-->
                                    <!--<span>{{item.name}}</span>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div class="rside-deatil">-->
                            <!--<span v-if="lang=='en'" style="margin-right: 75px;">{{generateScheduleLang('startTime')}}</span>-->
                            <!--<span v-else>{{generateScheduleLang('startTime')}}</span>-->
                            <!--<el-time-picker class="date-picker"-->
                                <!--v-model="startTime"-->
                                <!--format='HH:mm'-->
                                <!--value-format="HH:mm"-->
                                <!--size="mini"-->
                                <!--:picker-options="{-->
                                    <!--format: 'HH:mm'-->
                                <!--}">-->
                            <!--</el-time-picker>-->
                            <!--<span style="margin-left:10px;">{{generateScheduleLang('hour')}}</span>-->
                        <!--</div>-->
                        <!--<div class="rside-deatil">-->
                            <!--<span v-if="lang=='en'" style="margin-right: 80px;">{{generateScheduleLang('endTime')}}</span>-->
                            <!--<span v-else>{{generateScheduleLang('endTime')}}</span>-->
                            <!--<el-time-picker class="date-picker"-->
                                <!--v-model="endTime"-->
                                <!--format='HH:mm'-->
                                <!--value-format="HH:mm"-->
                                <!--size="mini"-->
                                <!--:picker-options="{-->
                                    <!--format: 'HH:mm'-->
                                <!--}">-->
                            <!--</el-time-picker>-->
                            <!--<span style="margin-left:10px;">{{generateScheduleLang('hour')}}</span>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</el-col>-->
        <!--</el-col>-->
    <!--</el-row>-->
</template>
<script>
import util from '@/common/util'
import {generateScheduleLang} from '@/api/i18n'

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
            // weekTitles:[
            //     '日','一','二','三','四','五','六'
            // ],
            weekTitles:this.$t('scheduleView.week'),
            weekList:[
                {
                    'checked':false,
                    'name': this.$t('scheduleView.mon'),
                    'value':'Mon',
                },
                {
                    'checked':false,
                    'name': this.$t('scheduleView.tues'),
                    'value':'Tue',
                },
                {
                    'checked':false,
                    'name': this.$t('scheduleView.wed'),
                    'value':'Wed',
                },
                {
                    'checked':false,
                    'name': this.$t('scheduleView.thur'),
                    'value':'Thur',
                },
                {
                    'checked':false,
                    'name': this.$t('scheduleView.fri'),
                    'value':'Fri',
                },
                {
                    'checked':false,
                    'name':this.$t('scheduleView.sat'),
                    'value':'Sat',
                },
                {
                    'checked':false,
                    'name':this.$t('scheduleView.sun'),
                    'value':'Sun',
                }
            ],
            weekValue:this.$t('scheduleView.everyDay'),
            weekDays:[],
            curStartIndex:0,
            allMonth:false,
            showWeekContent:false,
            startTime:'',
            endTime:'',
            groupIndex:0,
            groupNameInput:'',
            lang: this.$i18n.locale
        }
    },
    methods:{
        generateScheduleLang,
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
                    self.weekValue = this.$t('scheduleView.everyDay');
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
        console.log(this.lang)
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../assets/css/textstyle.css';
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
        background-color: $red !important;
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
    .add-btn{
      position: absolute;
      @include point(right,15);
      @include point(top,16);
      color: #fff;
      @include point(width,120);
      font-size: 14px;
      span{
        @include point( margin-left,15);
      }
      @media screen and (min-width: 1366px){
        @include point(width,120);
      }
      @media screen and (max-width: 1366px){
        @include point(width,160);
        font-size: 12px;
      }
    }
    .title-btn{
        position: absolute;
        @include point(right,15);
        @include point(top,16);
        color: #fff;
        @include point(width,90);
        font-size: 14px;
        span{
            @include point( margin-left,15);
        }
        @media screen and (max-width: 1366px){
          font-size: 12px;
          @include point(width,120);
        }
    }

    .iconcontent{
        position: absolute;
        right: 10px;
        @include point(margin-top,12);
        margin-right: 15px;
        .iconlised{
            float: left;
            position: relative;
            background-color: $red;
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
                @media screen and(max-width:1440px){
                    .group-items{
                        font-size:14px;
                    }
                }
                @media screen and(min-width:1440px){
                    .group-items{
                        font-size:18px;
                    }
                }
                .group-items{

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
                            background-color: $red;
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
                        font-size: 14px;
                        color: #424151;
                        .el-date{
                            @include point(width,180);
                        }
                        .show-dateStr{
                            @include point(width,180);
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
                                    font-size: 30px;
                                    opacity: 0.4;
                                    position: relative;
                                    top: 4px;
                                    cursor: pointer;
                                }
                                span{
                                    font-size: 14px;
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
                                        width: 40px;
                                        height: 40px;
                                        background-color: #fff;
                                        line-height: 40px;
                                        text-align: center;
                                        font-size: 14px;
                                        border-radius: 50%;
                                    }
                                }
                                .schedule-tag{
                                    width: 16px;
                                    height: 16px;
                                    background-color: $red;
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
                        margin-left: 10px;
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
                        .en-week-panel{
                          position: absolute;
                          margin-top: 3px;
                          left: 173px;
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
                            .en-span-title{
                              width: 138px;
                              text-align: right;
                              /* display: block; */
                              float: left;
                              clear: both;
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
    background-color: #FB4C5D;
    border-color:#FB4C5D;
}
.el-radio__input.is-checked+.el-radio__label{
    color: #FB4C5D;
}
.el-month-table td .cell:hover, .el-month-table td.current:not(.disabled) .cell{
    color: #FB4C5D;
}
.el-input .el-input__inner:focus{
    border-color: #FB4C5D;
}
.el-checkbox__inner:hover{
    border-color: #FB4C5D !important;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB4C5D}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB4C5D !important;
    border-color:#FB4C5D !important;
}
.el-time-panel__btn.confirm{
    background-color: #FB4C5D;
    color: #fff;
    padding:0px 10px;
    background-color: #EAEDF2;
    color: #708090;
    line-height: 20px;
}
.el-time-panel__btn.confirm:hover{
    color: #FB4C5D;
}
  .showDrap{

  }
</style>
