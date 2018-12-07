<template>
    <el-row class="el-storeEdit-content">
        <el-col :span="24" class="storeEdit-header">
            <div class="store-title">
                <span>{{storeTitle}}</span>
                <el-button @click="submitData" class="sub-btn" size="mini">提交</el-button>
            </div>
            <div class="store-info">
                <span><strong style="margin-right:15px;">负责人：</strong>{{storeLinder}}</span>
                <span><strong style="margin-right:15px;">联系方式：</strong>{{phone}}</span>
                <span style="margin-right:10px;"><strong>巡检排程</strong></span>
                <el-select v-model="schedule" placeholder="请选择" size="mini" class="el-schedule">
                    <el-option
                    v-for="item in scheduleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="store-handle">
                <span style="font-size:14px;font-weight:bold;">关联巡检表</span>
                <span>远程巡检</span>
                <span>解除关联</span>
            </div>
        </el-col>
        <el-col :span="24" class="storeEdit-content">
            <div class="el-table-title">
                <span class="name-title">巡检名称</span>
                <span class="schedule-title">关联通道</span>
            </div>
            <div class="el-table-data" v-for="(item,index) in scheduleData" :key="index">
                <span class="group-title">
                    {{item.napeName}}（{{item.napeNum}}）
                </span>
                <div class="schedule-data">
                    <div v-for="(_item,_index) in item.itemData" :key="_index" class="schedule-detials" style="overflow:hidden;">
                        <span class="nape-title">
                            {{_item.name}}
                        </span>
                        <el-select v-model="_item.value" class="nape-value" size="mini">
                            <el-option
                            v-for="item in alleList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
    name:'EditStoreVue',
    data(){
        return{
            storeTitle:'西安5店',
            storeLinder:'王三洋',
            phone:'17686840503',
            schedule:'',
            scheduleList:[
                {
                    id:0,
                    label:'排程一',
                    value:'排程一'
                },
                {
                    id:1,
                    label:'排程二',
                    value:'排程二'
                },
            ],
            scheduleData:[
                {
                    id:0,
                    napeName:'门店形象',
                    napeNum:2,
                    itemData:[
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                         {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                        
                    ]
                },
                {
                    id:1,
                    napeName:'员工形象',
                    napeNum:4,
                     itemData:[
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                         {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象3eqweqew',
                            value:0
                        },
                        
                    ]
                },
                {
                    id:2,
                    napeName:'服务',
                    napeNum:1,
                     itemData:[
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                        
                    ]
                    
                },
                {
                    id:3,
                    napeName:'商品',
                    napeNum:2,
                    itemData:[
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                        {
                            id:0,
                            name:'店外整洁，无乱堆乱放现象',
                            value:0
                        },
                    ]
                }
            ],
            alleList:[
                {
                    id:0,
                    name:'水吧'
                },
                {
                    id:1,
                    name:'收银台'
                },
                {
                    id:2,
                    name:'物料成列'
                }
            ]
        }
    },
    methods:{
        submitData(){
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-storeEdit-content{
        padding-left: 30px;
        padding-top: 20px;
        padding-right: 10px;
        .storeEdit-header{
            .store-title{
                overflow: hidden;
                span{
                    float: left;
                    font-size: 18px;
                    font-weight: bold;
                }
                .sub-btn{
                    float: right;
                    margin-right: 20px;
                    width: 80px;
                    color: #fff;
                    background-color: #FB505F;
                    border-color: #FB505F;
                }
            }
            .store-info{
                text-align: left;
                margin-top: 15px;
                font-size: 14px;
                span{
                    width:auto;
                    margin-right: 6%;
                }
                .el-schedule{
                    width: 160px;
                }
               
            }
            .store-handle{
                margin-top: 20px;
                text-align: left;
                span{
                    margin-right: 30px;
                }
            }
        }
        .storeEdit-content{
            margin-top: 20px;
            background-color: #F6F7FB;
            .el-table-title{
                height: 50px;
                line-height: 50px;
                text-align: left;
                border-bottom: 1px solid #ddd;
                margin:auto 10px;
                color: #94A4B4;
                font-size: 14px;
                font-weight: bold;
                .name-title{
                    width: 20%;
                    margin-right: 36%;
                    margin-left: 2%;
                }
                .schedule-title{

                }
            }
            .el-table-data{
                padding-left: 10px;
                padding-right: 10px;
                text-align: left;
                .group-title{
                    margin-left: 2%;
                    font-size: 18px;
                    font-weight: bold;
                    display: inline-block;
                    margin-top: 10px;
                }
                .schedule-data{
                    
                    .schedule-detials{
                        text-align: left;
                        height: 50px;
                        line-height: 50px;
                        border-bottom: 1px solid #ddd;
                        font-size: 14px;
                    }
                    .nape-title{
                        margin-left: 2%;
                        float: left;
                        width: 40%;
                    }
                    .nape-value{
                        margin-left: 2%;
                        width: 120px;
                        .el-input__inner{
                            background-color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>
<style>
.el-input__inner{
    border-radius: 0px;
    background-color: #fff;
}
.el-select-dropdown__item{
    padding: 0 20px !important;
}
.el-select-dropdown__item.hover{
    background-color:#FEE4E7;
}
.el-select .el-input.is-focus .el-input__inner{
    border-color: #FEE4E7;
}
.el-select-dropdown__item.selected{
    color:#FB505F;
}
</style>
