<template>
    <el-row class="el-addrute">
        <el-col :span="24" class="el-rute-title">
            <p class="tab-name" v-if="!showEditTab">{{tabName}}<i class="iconfont icon-bianji icon-tabname"
             @click="editTabName"></i></p>
            <el-input size="mini" v-if="showEditTab" class="tabName-input input-details" placeholder="输入巡检表名" v-model="tabName"></el-input>
            <div class="iconcontent" v-if="showEditTab" style="position:relative;left:30px;top:5px;">
                <div class="iconlised" style="background-color:#FB4C5D" @click="confirmEditTab">
                    <i class="el-icon-check"></i>
                </div>
                <div class="iconrised" @click="cancelEditTab">
                    <i class="el-icon-close"></i>
                </div>
            </div>
        </el-col>
       <el-col :span="7" class="el-rute-group">
           <div class="group-content">
               <div class="title-content">
                   <span class="level2"><i class="iconfont icon-wenjian icontitle"></i>{{groupTitle}}</span>
                   <div class="btn-content">
                       <el-button class="rute-btn" size="mini" @click="addGroup"><i class="el-icon-plus"></i><span>添加巡检类别</span></el-button>
                   </div>
               </div>
               <el-scrollbar style="height:100%;" id="el-menuscrollbar">
               <div class="group-items group-title" :style="{'max-height':varyDivHeight+'px'}">
                   <div v-for="(item,index) in groupList" 
                   :key="index" class="groupItem" @click="clickGroupItem(index,item)" @mouseenter="getEditGroup(index,item)"
                   :class="item.isClick?'noraml-color':'noraml-groupColor'">
                        <div class="proper-flag" v-if="item.isClick"></div>
                            <span v-if="!item.isEdit" :style="item.isClick?{'color':'#FB4C5D'}:{}">{{item.groupName}}（{{item.groupNum}}）</span>
                        <el-input  size="mini" maxlength='10' v-model="item.groupName" class="group-input input-details" v-if="item.isEdit"></el-input>
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
                            <div class="iconlised" style="background-color:#FB4C5D" @click="confirmEditGroup(index,item)" v-if="item.isEdit">
                                <i class="el-icon-check"></i>
                            </div>
                            <div class="iconrised" @click="cancelEditGroup(index,item)" v-if="item.isEdit">
                                <i class="el-icon-close"></i>
                            </div>
                        </div>
                    </div>
                    <div class="group-add" v-if="showAddGroup">
                        <el-input  size="mini" maxlength="10" class="groupName-input input-details" placeholder="输入类别名" v-model="groupNameInput"></el-input>
                            <div class="iconcontent">
                                <div class="iconlised" style="background-color:#FB4C5D" @click="confirmAddGroup">
                                    <i class="el-icon-check"></i>
                                </div>
                                <div class="iconrised" @click="cancelAddGroup">
                                    <i class="el-icon-close"></i>
                                </div>
                            </div>
                    </div>
               </div>
               </el-scrollbar>
        
           </div>
       </el-col>
       <el-col :span="17" class="el-rute-nape">
           <div class="nape-content">
               <div class="title-content">
                    <span  v-if="groupList.length!=0" class="item-title level2"><i class="iconfont icon-icon-test icontitle"></i>{{napeTitle}}</span>
                    <div class="btn-content" v-if="groupList.length!=0">
                        <el-button class="rute-btn" size="mini" @click="addNape"><i class="el-icon-plus"></i><span>新增巡检项</span></el-button>
                        <el-button class="rute-btn" size="mini" @click="deleteNape"><i class="iconfont icon-shanchu"></i><span>删除巡检项</span></el-button>
                    </div>
               </div>
               <el-scrollbar style="height:100%;" id="el-menuscrollbar">
               <div class="nape-items" :style="{'max-height':varyDivHeight+'px'}">
                   <div class="nape-items-title tabTitle" v-if="napeList.length!=0">
                       <div class="nape-name-title">
                           <span>巡检名称</span>
                       </div>
                       <div class="nape-dep-title">
                           <span>巡检项需求描述</span>
                       </div>
                       <div class="nape-handle-title">
                           <span>操作</span>
                       </div>
                   </div>
                   <div class="nape-items-data" 
                   v-for="(item,index) in napeList" 
                   :key="index" @click="clickItem(index,item)" :class="!item.isClick?'noraml-color':'active-color'">
                       <div class="nape-name-data">
                            <el-checkbox v-model="item.checked" class="item-checkbox"></el-checkbox>
                            <span class="nape-name" v-if="!item.isClick">{{item.napeNameShow}}</span>
                            <el-input maxlength="25" size="mini" v-model="item.napeName" class="nape-input input-details" placeholder="输入巡检项名称" v-if="item.isClick"></el-input>
                       </div>
                       <div class="nape-dep-data">
                           <span class="nape-dep" v-if="!item.isClick">{{item.napeDep}}</span>
                           <el-input maxlength="75" size="mini" v-model="item.napeDep" class="nape-input input-details" placeholder="输入巡检项描述" v-if="item.isClick"></el-input>
                            <div class="iconcontent" v-if="item.isClick">
                                <div class="iconlised" style="background-color:#FB4C5D" @click="confirmeditNape(index,item)">
                                    <i class="el-icon-check"></i>
                                </div>
                                <div class="iconrised" @click="cancelEditNape(index,item)">
                                    <i class="el-icon-close"></i>
                                </div>
                            </div>
                       </div>
                       <div class="nape-items-handle">
                           <i class="iconfont icon-bianji" style="font-size: 20px;cursor:pointer;margin-right:10px;"  @click="handleEdit(index,item)"></i>
                           <i class="iconfont icon-shanchu" style="font-size: 20px;cursor:pointer;"  @click="handleDelete(index, item)"></i>
                       </div>
                   </div>
                    <el-dialog title='确认删除'
                    :visible.sync="showDeleteItem" v-if="showDeleteItem"
                    :append-to-body='true'
                    :close-on-click-modal="false"
                    width="28%"
                    top="35vh"
                    left="40vh">
                        <div  style="overflow:hidden;">
                            <hr style="border: 0.5px solid #FB4C5D;"/>
                            
                            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                                <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                                <span>确认是否删除当前巡检项?</span>
                            </p>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button class="file-cancel-btn" @click="showDeleteItem = false" size="mini" style="">取 消</el-button>
                            <el-button class="file-confirm-btn" @click="confirmDeleteItem" size="mini" style="color:#fff">确 认</el-button>
                        </div>
                    </el-dialog>

                     <el-dialog title='确认删除'
                    :visible.sync="showDeleteGroup" v-if="showDeleteGroup"
                    :append-to-body='true'
                    :close-on-click-modal="false"
                    width="28%"
                    top="35vh"
                    left="40vh">
                        <div  style="overflow:hidden;">
                            <hr style="border: 0.5px solid #FB4C5D;"/>
                            
                            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                                <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                                <span>确认是否删除当前巡检类别及其巡检项?</span>
                            </p>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button class="file-cancel-btn" @click="showDeleteGroup = false" size="mini" style="">取 消</el-button>
                            <el-button class="file-confirm-btn" @click="confirmDeleteGroup" size="mini" style="color:#fff">确 认</el-button>
                        </div>
                    </el-dialog>
                    <div class="nape-items-data" v-if="showAddNape"  :class="'active-color'">
                       <div class="nape-name-data">
                            <el-checkbox v-model="newNapeChecked" class="item-checkbox"></el-checkbox>
                            <el-input maxlength="25" size="mini" v-model="newNapeName" class="nape-input input-details" placeholder="输入巡检项名称" ></el-input>
                       </div>
                       <div class="nape-dep-data">
                           <el-input maxlength="75" size="mini" v-model="newNapeDep" class="nape-input input-details" placeholder="输入巡检项描述"></el-input>
                            <div class="iconcontent">
                                <div class="iconlised" style="background-color:#FB4C5D" @click="confirmaddNape">
                                    <i class="el-icon-check"></i>
                                </div>
                                <div class="iconrised" @click="cancelAddNape">
                                    <i class="el-icon-close"></i>
                                </div>
                            </div>
                       </div>
                   </div>
               </div>
               </el-scrollbar>
           </div>
       </el-col>
    </el-row>
</template>

<script>
import api from '@/api/index'
import util from '@/common/util'
import {validateInput} from '@/common/validate'
import {inpectRESTful} from '@/api/index'
import PubSub from 'pubsub-js'
export default {
    name:'AddRuteInspect',
    data(){
        return{
            groupTitle:'巡检类别',
            tabName:'',
            groupList:[],
            groupNameTemp:'',  //临时存放
            groupNameInput:'',
            napeTitle:'',
            showEditTab:false,
            napeList:[],
            napeDepTemp:'', //临时存放
            showAddGroup:false,
            showAddNape:false,
            newNapeChecked:false,
            newNapeName:'',
            newNapeDep:'',
            groupIndex:0,   //当前选择的类别索引.
            curGroup:'',     //当前点击的类别实体
            showDeleteItem:false,
            showDeleteGroup:false,
            deleteItemFlag:'',
            curItemId:'',
            varyWindowHeight:window.innerHeight,
            bindStoreList:[]
        }
    },
    computed:{
        varyDivHeight:function(){
            if(this.varyWindowHeight>800){
                return this.varyWindowHeight*0.72;
            }
            else if(this.varyWindowHeight>700){
                return this.varyWindowHeight*0.67;
            }
            else{
                return this.varyWindowHeight*0.65;
            }
        }
    },
    methods:{
        // check(strVal){
        //     console.log(strVal);
        //     if(validateInput(strVal)){
        //         alert('含有非法字符！');
        //     }
        // },
        editTabName(){
            let self=this;
            self.showEditTab=true;
        },
        cancelEditTab(){
            let self=this;
            self.showEditTab=false;
        },
        clickGroupItem(index,item){
            let self=this;
            item.isClick=true;
            self.groupIndex=index;
            self.curGroup=item;
            self.napeTitle=`${item.groupName}类别巡检项`;
            self.showAddNape=false;
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
            self.getNapeList(index,item);
        },
        clickItem(index,item){
            let self=this;
        },
        
        confirmEditGroup(index,item){
            let self=this;
            let temp=[];
            if(item.groupName==null||item.groupName.length==0){
                self.notify('类别名称不能为空！','warning',3000);
                return false;
            }
            if(validateInput(item.groupName)){
                self.notify('当前输入含有非法字符！','warning',3000);
                return false;
            }
            let obj={
                id:item.id,
                name:item.groupName,
                tag:self.tabName
            }
            temp.push(obj);
            let params={
                "groups":temp
            };
            inpectRESTful.updateInspectGroup(params).then(res=>{
                console.log(res);
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    self.notify('修改成功!','success',3000);
                    item.isEdit=false;
                }
                else{
                    self.notify('修改失败!','warning',3000);
                    return false;
                }
            })
        },
        cancelEditGroup(index,item){
            let self=this;
            item.isEdit=false;
            item.groupName=self.groupNameTemp;
        },
        /**
         * Add group functions
         */
        addGroup(){
            let self=this;
            self.showAddGroup=true;
            self.groupNameInput='';
            self.groupList.forEach(item=>{
                item.isEdit=false;
            })
        },
        confirmAddGroup(){
            let self=this;
            let temp=[];
            if(self.groupNameInput.trim().length==0){
                self.notify('类别名称不能为空！','warning',3000);
                return false;
            }
            if(validateInput(self.groupNameInput)){
                self.notify('当前输入含有非法字符！','warning',3000);
                return false;
            }
            let mode=0;
            if(self.tabName=='远程巡检'){
                mode=0;
            }
            else if(self.tabName=='现场巡检'){
                mode=1;
            }
            else{
                mode=0;
            }
            let obj={
                name:self.groupNameInput,
                mode:mode,
                tag:self.tabName
            }
            temp.push(obj);
            let params={
                "groups":temp
            };
            inpectRESTful.addInspectGroup(params).then(res=>{
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    let obj={
                        id:res.data[0],
                        groupName:self.groupNameInput,
                        groupNum:0,
                        isClick:false,
                        showEdit:false,
                        isEdit:false,
                        itemData:[]
                    };
                    self.groupList.push(obj);
                    self.groupNameInput='';
                    self.showAddGroup=false;
                    self.refreshData(self.groupList.length-1);
                    self.notify('添加成功!','success',3000);
                    // setTimeout(function(){
                    //     PubSub.publish('change-color',{showTag:true});
                    // },1000)
                   
                }
                else{
                    self.notify('添加失败!','warning',3000);
                    return false;
                }
            })
        },
        cancelAddGroup(){
            let self=this;
            self.showAddGroup=false;
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
            self.groupNameTemp=item.groupName;
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isEdit=false;
                }
            })
        },
        deleteItemData(idArr){
            let self=this;
            let params={"itemIds":idArr};
            return new Promise((resolve,reject)=>{
                inpectRESTful.deleteInspectItem(params).then(res=>{
                    let errMsg=res.errMsg;
                    console.log(errMsg);
                    resolve(errMsg);
                })
            })
        },
        deleteGroupData(idArr){
            let self=this;
            let params={"groupIds":idArr};
            return new Promise((resolve,reject)=>{
                inpectRESTful.deleteInspectGroup(params).then(res=>{
                    let errMsg=res.errMsg;
                    console.log(errMsg);
                    resolve(errMsg);
                })
            })
        },
        deleteGroup(index,item){
            this.showDeleteGroup=true;
            this.curGroup=item;
            console.log(this.curGroup);
        },
        async confirmDeleteGroup(){
            let self=this;
            let idGroupArr=[];
            let idItemArr=[];
            idGroupArr.push(self.curGroup.id);
            self.curGroup.itemData.forEach(item=>{
                idItemArr.push(item.id);
            })
            self.showDeleteGroup=false;
            if(idItemArr.length==0){   //当前分组下无巡检项
                let errMsg= await self.deleteGroupData(idGroupArr);
                if(errMsg!=undefined&&errMsg=='Success'){
                    self.notify('删除成功！','success',3000);
                    if(self.groupList.length==1){
                        self.groupList=[];
                        self.napeList=[];
                        self.napeTitle='';
                    }
                    else{
                        console.log(self.groupIndex);
                        self.refreshData(self.groupIndex==0?self.groupIndex:self.groupIndex-1);
                    }
                    
                }
            }
            else{
                let errMsgItem=await self.deleteItemData(idItemArr);
                if(errMsgItem!=undefined&&errMsgItem=='Success'){
                    let errMsgGroup=await self.deleteGroupData(idGroupArr);
                    if(errMsgGroup!=undefined&&errMsgGroup=='Success'){
                        self.notify('删除成功！','success',3000);
                        //刷新页面
                        if(self.groupList.length==1){
                            self.groupList=[];
                            self.napeList=[];
                            self.napeTitle='';
                        }
                        else{
                            console.log(self.groupIndex);
                            self.refreshData(self.groupIndex==0?self.groupIndex:self.groupIndex-1);
                        }
                    }
                    else{
                        self.notify('删除失败！','warning',3000);
                        return false;
                    }
                }
                else{
                    self.notify('删除失败！','warning',3000);
                    return false;
                }
            }
        },
        addNape(){
            let self=this;
            self.showAddNape=!self.showAddNape;
            self.napeList.forEach((_item,_index)=>{
                _item.isClick=false;
            })
        },
        deleteNape(item){
            let self=this;
            let count=0;
            self.napeList.forEach(item=>{
                if(item.checked){
                    count++;
                }
            })
            if(count==0){
                self.notify('请勾选需要删除的巡检项!','warning',3000);
                return false;
            }
            self.showDeleteItem=true;
            self.deleteItemFlag='G';
        },
        async confirmDeleteItem(){
            let self=this;
            let idArr=[];
            switch(self.deleteItemFlag){
                case 'S': idArr.push(self.curItemId);break;
                case 'G':
                self.napeList.forEach(item=>{
                    if(item.checked){
                        idArr.push(item.id);
                    }
                });break;
                deafult:
                console.log("error Flag!");break;
            }
            let errMsg=await self.deleteItemData(idArr);
            if(errMsg!=undefined&&errMsg=='Success'){
                self.notify('删除成功！','success',3000);
                self.showDeleteItem=false;
                //刷新页面,删除页面上在后台已经删除的数据
                self.refreshData(self.groupIndex);
                self.groupList[self.groupIndex].groupNum-=idArr.length;
            }
            else{
                self.notify('删除失败！','warning',3000);
                return false;
            }
        },
        confirmeditNape(index,item){
            let self=this;
            let temp=[];
            if(item.napeName.trim().length==0){
                self.notify('巡检项名称不能为空！','warning',3000);
                return false;
            }
            if(validateInput(item.napeName)||validateInput(item.napeDep)){
                self.notify('当前输入含有非法字符！','warning',3000);
                return false;
            }
            let obj={
                id:item.id,
                subject:item.napeName,
                description:item.napeDep,
                itemScore:10
            }
            temp.push(obj);
            let params={
                "items":temp
            };
            inpectRESTful.updateInspectItem(params).then(res=>{
                console.log(res);
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    self.notify('修改成功!','success',3000);
                    item.isClick=false;
                    self.refreshData(self.groupIndex);
                }
                else{
                    self.notify('修改失败!','warning',3000);
                    return false;
                }
            })
        },
        cancelEditNape(index,item){
            let self=this;
            item.isClick=false;
            item.napeDep=self.napeDepTemp;
        },
        confirmaddNape(){
            let self=this;
            let temp=[];
            if(self.newNapeName.trim().length==0){
                self.notify('巡检项名称不能为空！','warning',3000);
                return false;
            }
            if(validateInput(self.newNapeName)||validateInput(self.newNapeDep)){
                self.notify('当前输入含有非法字符！','warning',3000);
                return false;
            }
            let objItem={
                subject:self.newNapeName.trim(),
                description:self.newNapeDep.trim(),
                itemScore:10,
            };
            temp.push(objItem);

            let obj={
                groupId:self.curGroup.id,
                items:temp
            };
            let tempParam=[];
            tempParam.push(obj);
            let params={
                "request":tempParam
            };
            inpectRESTful.addInspectItem(params).then((res)=>{
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    let obj={
                        napeName:self.newNapeName,
                        napeNameShow:`${self.napeList.length+1}，${self.newNapeName}`,
                        napeDep:self.newNapeDep,
                        isClick:false,
                        checked:false
                    };
                    self.napeList.push(obj);
                    self.newNapeName='';
                    self.newNapeDep='';
                    self.showAddNape=false;
                    self.refreshData(self.groupIndex);
                    self.groupList[self.groupIndex].groupNum++;

                    let data=res.data;
                    let storeList=self.bindStoreList;
                    let tempParams=[];
                    storeList.forEach(item=>{
                        let obj={
                            storeId:item,
                            itemIds:data,
                        }
                        tempParams.push(obj);
                    })
                    let paramsApply={
                        storeList:tempParams
                    };
                    inpectRESTful.applyItemInspectItem(paramsApply).then(resApply=>{
                        let res=resApply;
                        console.log(res);
                    })
                    self.notify('添加成功!','success',3000);
                    setTimeout(function(){
                        PubSub.publish('change-color',{showTag:true});
                    },1000)
                }
                else{
                    self.notify('添加失败!','warning',3000);
                    return false;
                }
            })
        },
        cancelAddNape(){
            this.showAddNape=false;
        },
        handleEdit(index,item){
            let self=this;
            self.napeDepTemp=item.napeDep;
            item.isClick=true;
            self.showAddNape=false;
            self.napeList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
        },
        handleDelete(index,item){
            console.log(index);
            let self=this;
            self.showDeleteItem=true;
            self.deleteItemFlag='S';
            self.curItemId=item.id;
        },

        getAllData(){
            return new Promise((resolve,reject)=>{
                inpectRESTful.getInspectItemList().then(res=>{
                    console.log(res);
                    let code=res.errMsg;
                    let data=res.data;
                    if(code!=null&&code=='Success'){
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        getBindStoreList(){
            let self=this;
            let tagName=self.tabName;
            let params={tagName:tagName};
            inpectRESTful.getInspectBindList(params).then(res=>{
                console.log(res.errMsg);
                if(res.errMsg!=undefined&&res.errMsg=='Success'){
                    let data=res.data;
                    self.bindStoreList=data;
                }
            })
        },
        async refreshData(index){
            let self=this;
            let curTag=self.tabName;
            let allData=await self.getAllData();
            let data=util.getRouteByTag(curTag,allData);
            console.log(data);
            let temp=[];
            data.forEach(item=>{
                let obj={};
                obj.id=item.id;
                obj.groupName=item.name;
                obj.groupNum=item.items.length;
                obj.isClick=false;
                obj.showEdit=false;
                obj.isEdit=false;
                obj.itemData=item.items;
                temp.push(obj);
            })
            self.groupList=temp;
            self.groupList[index].isClick=true;
            self.curGroup=self.groupList[index];
            self.groupIndex=index;
            self.napeTitle=`${self.groupList[index].groupName}类别巡检项`;
            self.getNapeList(index,self.groupList[index]);
        },
        getNapeList(index,item){
            console.log(index);
            let self=this;
            let temp=[];
            item.itemData.forEach((_item,index)=>{
                let obj={
                    id:_item.id,
                    napeName:_item.subject,
                    napeNameShow:`${index+1}，${_item.subject}`,
                    napeDep:_item.description,
                    score:_item.itemScore,
                    isClick:false
                }
                temp.push(obj);
            })
            self.napeList=temp;
        },
        
        initData(){
            let self=this;
            self.tabName=sessionStorage.getItem('GroupName');
            self.refreshData(0);
            self.getBindStoreList();
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
    mounted(){
        let self=this;
        self.initData();
    },
    beforeRouteLeave (to, from, next) {
        console.log(to.path);
        next();
        if(to.path=='/storemanage'){
            PubSub.publish('change-color',{showTag:false});
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
@import '../../../assets/css/textstyle.css';
    $mainColor:#FB4C5D;
    $itemHeight:50px;
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
    .nape-input{
        @include point(width,220);
        float: left;
        @include point(margin-left,10);
        @include point(line-height,50);
    }
    .el-addrute{
        width: 100%;
        height: 100%;
        .el-rute-title{
            width: 100%;
            @include point(height,60);
            @include point(padding-left,15);
            border-bottom: 1px solid #ddd;
            .tab-name{
                text-align: left ;
                @include point(margin-left,10);
                font-size: 18px;
                font-weight: bold;
            }
            .icon-tabname{
                @include point(margin-left,20);
                font-size: 18px;
                color: #ddd;
                cursor: pointer;
            }
            .tabName-input{
                @include point(width,220);
                float: left;
                @include point(margin-left,5);
            }
        }
        .rute-btn{
            background-color: $mainColor;
            color: #fff;
            font-size: 12px;
            width: 120px;
            .el-icon-plus{
                font-size:16px;
            }
        }
        .iconcontent{
            position: absolute;
            @include point(right,10);
            @include point(margin-top,13);
            @include point(margin-right,15);
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
        .title-content{
            @include point(height,60);
            @include point(line-height,60);
            text-align: left;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid #ddd;
            span{
                @include point(margin-left,10);
            }
            .item-title{
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
                word-wrap: break-word;
                width: 60%;
                cursor: pointer;
            }
            .icontitle{
                @include point(margin-right,10);
                font-weight: normal;
                font-size: 20px;
                @include point(margin-left,15);
            }
            .btn-content{
                width: auto;
                height: auto;
                float: right;
                @include point(margin-right,15);
            }
        }
        .el-rute-group{
            height: auto;
            //min-height: 90%;
            min-height:calc(100%-60px);
            min-height: -webkit-calc(100%-60px);
            min-height: -moz-calc(100%-60px);
            background-color: #FAFAFA;
            .group-items{
                font-size: 14px;
                .groupItem{
                    height: $itemHeight;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid #ddd;
                    cursor: pointer;
                    text-align: left;
                    .proper-flag{
                        height: 70%;
                        width: 4px;
                        position:absolute;
                        top: 15%;
                        background-color: $mainColor;
                    }
                    .group-input{
                        max-width: 60%;
                        float: left;
                        @include point(margin-left,20);
                        @include point(line-height,50);
                    }
                    span{
                        float: left;
                        @include point(margin-left,25);
                        @include point(line-height,50);
                        width: 70%;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    &:last-child{
                        @include point(margin-bottom,15);
                    }
                }
            }
            .group-add{
                @include point(margin-top,5);
                position: relative;
                overflow: hidden;
                @include point(height,50);
                @include point(margin-bottom,20);
                .groupName-input{
                    width: 60%;
                    float: left;
                    @include point(margin-left,25);
                    @include point(line-height,50);
                }
            }
        }
        .el-rute-nape{
            height: auto;
            min-height: 90%;
            .nape-name-title{
                width: 36%;
                display: inline-block;
                span{
                    position: relative;
                    left: 20%;
                }
                
            }
            .nape-dep-title{
                width: 50%;
                display: inline-block;
                span{
                    position: relative;
                    left: 10%;
                }
            }
            .nape-handle-title{
                width: 10%;
                display: inline-block;
                span{
                    position: relative;
                    left: 20%;
                }
            }
            .nape-items-title{
                height: $itemHeight;
                line-height: $itemHeight;
                text-align: left;
                font-size: 14px;
            }
            .nape-items-data{
                overflow: hidden;
                position: relative;
                width: 96%;
                margin: 0 0 0 3%;
                padding-left: 1%;
                cursor: pointer;
                font-size: 14px;
                color: #424151;
                &:last-child{
                    @include point(margin-bottom,15);
                }
                .nape-input{
                    @include point(width,220);
                    float: left;
                    @include point(margin-left,10);
                    @include point(line-height,50);
                }
                .nape-name-data{
                    width: 36%;
                    display: inline-block;
                    position: relative;
                    float: left;
                    @include point(line-height,50);
                    .item-checkbox{
                        float: left;
                        margin-right: 0px;
                    }
                    span{
                        float: left;
                        @include point(margin-left,20);
                        text-align: left;
                        width: 80%;
                    }
                }
                .nape-dep-data{
                    width: 50%;
                    display: inline-block;
                    position: relative;
                    float: left;
                    @include point(line-height,25);
                    // @include point(margin-top,10);
                    overflow: hidden;
                    span{
                        float: left;
                        @include point(margin-left,25);
                        @include point(margin-top,10);
                        text-align: left;
                    }
                    .nape-input{
                        @include point(line-height,50);
                    }
                }
                .nape-items-handle{
                    width: 10%;
                    display: inline-block;
                    @include point(line-height,50);

                }
            }
        }
        .noraml-color{
            background-color: #fff;
        }
        .active-color{
            background-color: #FEE4E7;
        }
        .noraml-groupColor{
            background-color: #FAFAFA;
        }
    }
</style>
<style>
.input-details .el-input__inner{
    border:1px solid #FB4C5D !important;
    border-radius: 0px !important;
}
.el-checkbox__inner:hover{
    border-color: #FB4C5D !important;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB4C5D !important;}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB4C5D !important;
    border-color:#FB4C5D !important;
}
.el-dialog__body{
    padding: 0px !important;
}
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>