<template>
    <div class="content">
        <el-checkbox v-model="allChecked" class="all-checkbox"></el-checkbox>
        <div class="source-content">
            <div class="title-content">
                <div v-for="(item,index) in titleList" :key="index">
                    <span>{{item.title}}</span>
                </div>
            </div>
            <div class="source-details" v-for="(item,index) in daysList" :key="index">
                <span class="day-str">{{item.dayStr}}</span>
                <div class="details">
                    <div class="audio-content" v-for="(_item,_index) in item.audioList" :key="_index">
                        <div class="name">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="length">
                            <span>{{item.length}}</span>
                        </div>
                        <div class="size">
                            <span>{{item.size}}</span>
                        </div>
                        <div class="dateStr">
                            <span>{{item.dateStr}}</span>
                        </div>
                        <div class="handle">
                            <i class="iconfont"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="toolbar pagination" style="width:100%; margin:10px 15px;height:13%;margin-bottom:0px;">
            <el-pagination background small 
                @current-change="currentChange"
                :current-page="item.page"
            layout="jumper,total, prev, pager, next"  
            :page-size="item.sizeNum" :total="item.total" style="float:right;margin-top:10px;margin-bottom:10px;">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name:'AudioList',
    data(){
        return{
            allChecked:false,
            titleList:[
                {
                    title:'文件名称'
                },
                {
                    title:'语音长度'
                },
                {
                    title:'文件大小'
                },
                {
                    title:'创建时间'
                },
                {
                    title:'操作'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
