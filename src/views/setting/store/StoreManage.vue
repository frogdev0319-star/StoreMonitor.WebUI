<template>
    <div class="el-event-content">
       <div class="el-date">
            <span class="select-title">按省份选择</span>
            <el-select v-model="value" placeholder="省份" class="el-city" size="small" @change="selectChange">
                <el-option
                v-for="(item) in provinceList" 
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="value" placeholder="城市" class="el-city" size="small" @change="selectChange">
                <el-option
                v-for="(item) in cityList" 
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <div class="btn-content">
                <el-button class="rute-btn" size="mini" @click="searchNape"><span>搜索</span></el-button>
            </div>
            <el-input
                size="small"
                class="el-search-input"
                v-model="serachVale" @keyup.enter.native="searchEventList">
                <i @click="searchEventList" slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:2px;left:6px;"></i>
            </el-input>
       </div>
        <div class="el-table-content">
            <el-table 
            :data="tableData" 
            :highlight-current-row="true"
            empty-text='没有异常数据'
            align='left'
            height="470px"
            @sort-change='sortChange'
            style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;">
                <el-table-column
                    width=""
                    header-align="center"
                    align="center">
                        <template slot-scope="scope" >
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#FAD934;" v-if="scope.row.rank=='0'" >提示</span>
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:orange;" v-else-if="scope.row.rank=='1'" >警告</span>
                        <span style="display:inline-block;width:60px;height:22px;color:white;background-color:#fd446d;" v-else>严重</span>       
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
              layout="jumper,total, prev, pager, next,sizes"  :page-size="sizeNum" :total="total" style="float:right;">
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StoreManage",
        data(){
            return{
                tableInfoData:[
                     {
                        "prop":"storename",
                        "label":"门店名称",
                        "sortable":false,

                    },
                    {
                        "prop":"leading",
                        "label":"负责人",
                        "sortable":false,
                    },
                    {
                        "prop":"phone",
                        "label":"联系方式",
                        "sortable":false
                    },
                    {
                        "prop":"napeTable",
                        "label":"关联巡检表",
                        "sortable":false
                    },
                     {
                        "prop":"schedue",
                        "label":"巡检排程",
                        "sortable":false
                    }
                ]
            }

        },
        methods:{

        },
        mounted(){
            this.getInitList();
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
.el-event-content{
    width: 100%;
    position: relative;
    .el-date{
        width: 97.46%;
        height: 60px;
        margin: 15px;
        line-height: 60px;
        background-color: #fff;
        color: #4b5262;
        overflow: hidden;
        .select-title{
            margin-left:30px;
            float: left;
        }
        .el-city{
            float: left;
            width: 160px;
            margin-left: 15px;
        }
        .btn-content{
            width: auto;
            height: auto;
            float: left;
            margin-left: 20px;
            .rute-btn{
                background-color: #FB505F;
                color: #fff;
                width: 90px;
            }
        }
        .el-search-input{
            width:180px;
            float:right;
            margin-right:20px;
        }
    }
    .el-table-content{
        width: 97.46%;
        float: left;
        background-color: #fff;
    }
    
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
        border-radius: 15px;
    }
</style>
<style>
    .el-tooltip__popper.is-light{
        background: #E2F3FD !important;
        color: #4b5262 !important;
        border: 1px solid #2992FF !important;
    }
</style>

