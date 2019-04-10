<template>
    <div class="el-container">
        <div class="btn-content">
            <el-button size="mini" class="btns" @click="deleteSource">删除</el-button>
            <el-button size="mini" class="btns" @click="exportSource">导出</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="el-source-tabs">
           <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">

           </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name:'DataCenter',
    data(){
        return{
            activeName:'0',
            tabList:[
                {
                    label:'图片'
                },
                {
                    label:'视频'
                },
                {
                    label:'音频'
                }
            ]
        }
    },
    methods:{

        getSourceList(){

        },
        handleClick(val){
            console.log(val);
        },
        deleteSource(){

        },
        exportSouce(){

        }
    },
    mounted(){

    },
    methods:{

    }
}
</script>
<style lang="scss" scoped>
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
    .el-container{
        width: 100%;
        height: 100%;
        position: relative;
        .btn-content{
            position: absolute;
            right: 0;
            @include point(top,20);
            @include point(margin-right,25);
            .btns{
                width: 90px;
            }
        }
        .el-source-tabs{
            @include point(margin-top,25);
            @include point(margin-left,20);
            width:96%;
            height: 700px;
        }
    }
</style>
<style>
    .el-source-tabs .el-tabs__active-bar{
        height: 4px !important;
        width: 70px !important;
    }
    .el-source-tabs .el-tabs__item{
        width: 90px !important;
    }
</style>