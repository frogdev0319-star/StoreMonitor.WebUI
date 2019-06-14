<template>
    <el-dialog :title='dialogTitle'
        :visible.sync="dialogClosed" :close-on-click-modal="false" v-if="dialogClosed"  width="28%" top="35vh" @close='cancle'>
        <div class="dialog-content">
            <hr style="border: 0.5px solid #f31d65;"/>
            <p style="margin:20px;">
                <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;float:left;"></i>
                <span>{{showInfo}}</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button class="cancel-btn" @click="cancle" size="mini" v-if="isWarning">{{generatePatrolLang('cancel')}}</el-button>
            <el-button class="confirm-btn" @click="confirm" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
  import {generatePatrolLang} from '@/api/i18n'
  export default {
    name:'DialogVue',
    props:{
        dialogTitle:String,
        showInfo:String,
        isWarning:Boolean,
        dialogClosed:Boolean,
    },
    data(){
        return{
        }
    },
    mounted(){
        let self=this;
    },
    methods:{
        generatePatrolLang,
        confirm(ev){
            let self=this;
            console.log(ev.target);
            let value=self.dialogClosed;
            self.$emit('confirmed',value)
        },
        cancle(ev){
            let self=this;
            let value=self.dialogClosed;
            self.$emit('canceled',value)
        },
    }
}
</script>
<style lang="scss" scoped>
    @function rem($val){
        @return $val/16+rem;
    }
    @function checkRem($val){
        @if($val==0){
            @return 0;
        }
        @else if($val==auto){
            @return auto;
        }
        @else{
            @return rem($val);
        }
    }
    @mixin point($poi,$val){
        #{$poi}:checkRem($val);
    }
    .dialog-content{
        text-align: left;
        overflow:hidden;
        width:100%;
    }
    .el-dialog__body{
        padding: 0px !important;
    }
    .el-dialog__title{
        font-size: 14px !important;
        color: #303133 !important;
        float: left !important;
    }
    .cancel-btn{
        @include point(width,76);
        background-color: #EAEDF2 !important;
        color: #708090 !important;
        font-size: 12px;
    }
    .confirm-btn{
        @include point(width,76);
        font-size: 12px;
    }
</style>
