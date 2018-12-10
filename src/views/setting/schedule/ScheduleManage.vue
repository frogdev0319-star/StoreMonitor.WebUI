<template>
    <el-row class="el-schedule-container">
        <el-col :span="24" class="el-header">
            <span>排程</span>
        </el-col>
        <el-col :span="24" class="el-content">
            <el-col :span="8" class="schedule-group">
                <div class="group-title">
                    <i class="iconfont icon-wenjian icontitle"></i><span>排程名称</span>
                    <el-button size="mini" @click="addSchedule" class="title-btn">添加排程</el-button>
                </div>
                <div class="group-details" v-for="(item,index) in groupList" 
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
                   <span v-if="groupList.length!=0"><i class="iconfont icon-icon-test icontitle"></i>{{napeTitle}}详情</span>
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
                        v-model="curMonth" size="mini"
                        type="month"
                        placeholder="选择月">
                        </el-date-picker>
                        <span style="margin-left:30px;margin-right:20px;">日期</span>
                        <el-input size="mini" style="width:200px;" v-model="curDay"></el-input>
                    </div>
                    <div v-else>
                    </div>
                </div>
            </el-col>
        </el-col>
    </el-row>
</template>
<script>
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
            curMonth:'',
            curDay:''
        }
    },
    methods:{
        addSchedule(){

        },
        clickGroupItem(index,item){

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
        
    }
}
</script>
<style lang="scss" scoped>
    .el-schedule-container{
        .el-header{
            height: 60px;
            line-height: 60px;
            font-size: 18px;
            font-weight: bold;
            text-align: left;
            border-bottom: 1px solid #ddd;
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
                font-size: 16px;
                font-weight: bold;
                position: relative;
                .group-title{
                    height: 60px;
                    line-height: 60px;
                    border-bottom: 1px solid #ddd;
                    
                    .title-btn{
                        position: absolute;
                        right: 10px;
                        margin-top: 16px;
                    }
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
                        line-height: 50px;
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
                    }
                }
            }
        }
    }
</style>
