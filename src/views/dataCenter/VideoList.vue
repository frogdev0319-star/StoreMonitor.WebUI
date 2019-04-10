<template>
    <div class="content">
        <el-checkbox v-model="allChecked" class="all-checkbox"></el-checkbox>
        <div class="source-content">
            <div class="source-details" v-for="(item,index) in daysList" :key="index">
                <span class="day-str">{{item.dayStr}}</span>
                <div class="details">
                    <div class="img-content" v-for="(_item,_index) in item.imgList" :key="_index">
                        <img :src="_item.src" :alt="_item.alt" height="90" class="imgs"/>
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
    name:'VideoList',
    data(){
        return{
            allChecked:false,
            daysList:[
                
            ]
        }
    },
    methods:{
        currentChange(val){

        }
    }
}
</script>
